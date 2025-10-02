// Global data storage
let currentProducts = [];
let allProducts = [];

// Format price to Vietnamese currency
function formatPrice(price) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
    .format(price)
    .replace("₫", "đ");
}

// Load page data
async function loadProducts() {
  try {
    // Load product data from JSON files
    const [productsResponse, discountsResponse] = await Promise.all([
      fetch("/data/products.json"),
      fetch("/data/discounts.json"),
    ]);

    if (!productsResponse.ok || !discountsResponse.ok) {
      throw new Error("Failed to load data");
    }

    const productsData = await productsResponse.json();
    const discountsData = await discountsResponse.json();

    // Process products with discounts and sort by best sellers
    const bestSellerProducts = combineProductsWithDiscounts(
      productsData.products,
      discountsData.discounts
    ).sort((a, b) => b.soLuongBan - a.soLuongBan);

    // Store products and render
    allProducts = currentProducts = bestSellerProducts;
    renderProducts(bestSellerProducts);

    // Set up UI elements
    setupFilters();
    initializeMoreLinks();
    checkLoginStatus();
    updateCartBadge();
  } catch (error) {
    console.error("Error loading product data:", error);
  }
}

// Combine products with their discount information
function combineProductsWithDiscounts(products, discounts) {
  const now = new Date();
  return products.map((product) => {
    const discount = discounts.find((d) => d.maSanPham === product.maSanPham);

    if (discount && new Date(discount.ngayKetThuc) > now) {
      const giaSauGiam = Math.round(discount.giaGoc * (1 - discount.phanTramGiam / 100));
      return {
        ...product,
        giaSauGiam,
        giamGia: {
          giaGoc: discount.giaGoc,
          phanTramGiam: discount.phanTramGiam,
        },
      };
    }
    return { ...product, giaSauGiam: product.gia };
  });
}

// Render products to the page
function renderProducts(products) {
  const productGrid = document.querySelector(".product-grid");
  if (!productGrid) return;

  productGrid.innerHTML =
    products.length === 0 ? "<div class='no-products'>Không tìm thấy sản phẩm phù hợp.</div>" : "";

  if (products.length === 0) return;

  const fragment = document.createDocumentFragment();

  products.forEach((product) => {
    const productItem = document.createElement("div");
    productItem.className = "product-item";
    productItem.setAttribute("data-product-id", product.id);

    // Create discount badge if product has a discount
    const discountBadge = product.giamGia
      ? `<div class="discount-badge">-${product.giamGia.phanTramGiam}%</div>`
      : "";

    productItem.innerHTML = `
      ${discountBadge}
      <div class="image-container">
        <img src="../${product.hinhAnh}" alt="${product.tenSanPham}">
      </div>
      <div class="brand">${product.tenThuongHieu}</div>
      <div class="name">${product.tenSanPham}</div>
      <div class="price">
        ${formatPrice(product.giaSauGiam)}
        ${
          product.giamGia
            ? `<span class="old-price">${formatPrice(product.giamGia.giaGoc)}</span>`
            : ""
        }
      </div>
      <button class="add-to-cart-btn" onclick="event.stopPropagation(); addToCart('${
        product.id
      }', 1)">
        Thêm vào giỏ
      </button>
    `;

    productItem.addEventListener("click", () => {
      window.location.href = `ChiTietSanPham.html?id=${product.id}`;
    });

    fragment.appendChild(productItem);
  });

  productGrid.appendChild(fragment);
}

// Setup filters
function setupFilters() {
  if (!allProducts.length) return;

  // Get unique filter values
  const getUniqueValues = (property, nestedProp) => {
    const values = nestedProp
      ? [...new Set(allProducts.map((p) => p.thuocTinh?.[nestedProp]).filter(Boolean))]
      : [...new Set(allProducts.map((p) => p[property]))];
    return values;
  };

  // Populate filter dropdowns
  const allBrands = getUniqueValues("tenThuongHieu");
  const allCategories = getUniqueValues("tenDanhMuc");
  const allVolumes = getUniqueValues(null, "dungTich");
  const allScents = getUniqueValues(null, "huongThom");

  populateFilterDropdown("thuongHieuDropdown", allBrands);
  populateFilterDropdown("danhMucDropdown", allCategories);
  populateFilterDropdown("dungTichDropdown", allVolumes);

  // Hide scent filter if no scents available
  if (allScents.length > 0) {
    populateFilterDropdown("muiHuongDropdown", allScents);
  } else {
    const scentDropdown = document.querySelector(".dropdown:has(#muiHuongDropdown)");
    if (scentDropdown) scentDropdown.style.display = "none";
  }

  // Setup other filter components
  setupPriceFilters();
  setupDropdownSearch();
  setupFilterChangeEvents();
  setupResetFiltersButton();
}

// Populate filter dropdowns with product data
function populateFilterDropdown(dropdownId, items) {
  const dropdown = document.getElementById(dropdownId);
  if (!dropdown) return;

  // Save search input if exists
  const searchInput = dropdown.querySelector(".search");
  dropdown.innerHTML = "";
  if (searchInput) dropdown.appendChild(searchInput.cloneNode(true));

  // Get product count by property
  const getCount = (item) => {
    switch (dropdownId) {
      case "thuongHieuDropdown":
        return allProducts.filter((p) => p.tenThuongHieu === item).length;
      case "danhMucDropdown":
        return allProducts.filter((p) => p.tenDanhMuc === item).length;
      case "dungTichDropdown":
        return allProducts.filter((p) => p.thuocTinh?.dungTich === item).length;
      case "muiHuongDropdown":
        return allProducts.filter((p) => p.thuocTinh?.huongThom === item).length;
      default:
        return 0;
    }
  };

  // Add items with count
  const fragment = document.createDocumentFragment();

  items.forEach((item) => {
    const count = getCount(item);
    const label = document.createElement("label");
    label.innerHTML = `<input class="checkbox" type="checkbox" value="${item}"> ${item} (${count})`;
    fragment.appendChild(label);
  });

  dropdown.appendChild(fragment);

  // Add "Xem thêm" link if needed
  if (items.length > 5) {
    const moreLink = document.createElement("a");
    moreLink.href = "#";
    moreLink.className = "more-link";
    moreLink.textContent = "Xem thêm";
    dropdown.appendChild(moreLink);
  }
}

// Setup price range filters
function setupPriceFilters() {
  const priceDropdown = document.getElementById("giaSanPhamDropdown");
  if (!priceDropdown) return;

  // Price ranges in VND
  const priceRanges = [
    { min: 0, max: 200000, label: "Dưới 200.000₫" },
    { min: 200000, max: 300000, label: "200.000₫ - 300.000₫" },
    { min: 300000, max: 400000, label: "300.000₫ - 400.000₫" },
    { min: 400000, max: 500000, label: "400.000₫ - 500.000₫" },
    { min: 500000, max: 700000, label: "500.000₫ - 700.000₫" },
    { min: 700000, max: 1000000, label: "700.000₫ - 1.000.000₫" },
    { min: 1000000, max: 1500000, label: "1.000.000₫ - 1.500.000₫" },
    { min: 1500000, max: 2000000, label: "1.500.000₫ - 2.000.000₫" },
    { min: 2000000, max: Infinity, label: "Trên 2.000.000₫" },
  ];

  priceDropdown.innerHTML = "";

  // Create a document fragment for better performance
  const fragment = document.createDocumentFragment();

  priceRanges.forEach((range) => {
    const count = allProducts.filter(
      (p) => p.giaSauGiam >= range.min && p.giaSauGiam < range.max
    ).length;

    if (count > 0) {
      const label = document.createElement("label");
      label.innerHTML = `<input class="checkbox price-checkbox" type="radio" name="priceRange" data-min="${range.min}" data-max="${range.max}"> ${range.label} (${count})`;
      fragment.appendChild(label);
    }
  });

  priceDropdown.appendChild(fragment);
}

// Setup search functionality for filter dropdowns
function setupDropdownSearch() {
  document.querySelectorAll(".dropdown-content .search").forEach((input) => {
    input.addEventListener("input", function () {
      const searchTerm = this.value.toLowerCase();
      const dropdown = this.parentElement;

      dropdown.querySelectorAll("label").forEach((label) => {
        label.style.display = label.textContent.toLowerCase().includes(searchTerm) ? "" : "none";
      });
    });
  });
}

// Setup filter change events
function setupFilterChangeEvents() {
  document.querySelectorAll(".dropdown-content .checkbox").forEach((checkbox) => {
    checkbox.addEventListener("change", filterProducts);
  });
}

// Filter products based on selected criteria
function filterProducts() {
  // Get selections
  const selectedBrands = getSelectedValues("#thuongHieuDropdown .checkbox:checked");
  const selectedCategories = getSelectedValues("#danhMucDropdown .checkbox:checked");
  const selectedVolumes = getSelectedValues("#dungTichDropdown .checkbox:checked");
  const selectedScents = getSelectedValues("#muiHuongDropdown .checkbox:checked");

  // Get selected price ranges
  const selectedPriceRanges = Array.from(
    document.querySelectorAll("#giaSanPhamDropdown .price-checkbox:checked")
  ).map((checkbox) => ({
    min: parseInt(checkbox.dataset.min, 10),
    max: parseInt(checkbox.dataset.max, 10),
  }));

  // Apply filters
  const filteredProducts = allProducts.filter((product) => {
    // Check if product passes all active filters
    return (
      (selectedBrands.length === 0 || selectedBrands.includes(product.tenThuongHieu)) &&
      (selectedCategories.length === 0 || selectedCategories.includes(product.tenDanhMuc)) &&
      (selectedVolumes.length === 0 || selectedVolumes.includes(product.thuocTinh?.dungTich)) &&
      (selectedScents.length === 0 || selectedScents.includes(product.thuocTinh?.huongThom)) &&
      (selectedPriceRanges.length === 0 ||
        selectedPriceRanges.some(
          (range) => product.giaSauGiam >= range.min && product.giaSauGiam < range.max
        ))
    );
  });

  // Update products and render
  currentProducts = filteredProducts;
  renderProducts(filteredProducts);
}

// Helper function to get selected values from checkboxes
function getSelectedValues(selector) {
  return Array.from(document.querySelectorAll(selector)).map((checkbox) => checkbox.value);
}

// Initialize more links for dropdowns
function initializeMoreLinks() {
  document.querySelectorAll(".dropdown-content").forEach((dropdown) => {
    const labels = dropdown.querySelectorAll("label");
    const moreLink = dropdown.querySelector(".more-link");

    if (labels.length > 5 && moreLink) {
      // Initially hide labels beyond the first 5
      Array.from(labels).forEach((label, index) => {
        label.style.display = index >= 5 ? "none" : "";
      });
    } else if (moreLink) {
      // Hide the link if we have 5 or fewer items
      moreLink.style.display = "none";
    }
  });
}

// Add to cart functionality
function addToCart(productId, quantity) {
  // Check login status
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) {
    if (
      confirm(
        "Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng. Bạn có muốn đăng nhập ngay bây giờ?"
      )
    ) {
      window.location.href = "Login.html";
    }
    return;
  }

  // Find product in current products to avoid extra fetch
  const product = allProducts.find((p) => p.id == productId);
  if (product) {
    addProductToCart(product, quantity);
    return;
  }

  // Fallback: fetch from JSON if not found in current products
  fetch("../js/data/products.json")
    .then((response) => response.json())
    .then((data) => {
      const product = data.products.find((p) => p.id == productId);
      if (product) {
        addProductToCart(product, quantity);
      }
    })
    .catch((error) => {
      console.error("Error adding to cart:", error);
    });
}

// Helper function to add product to cart
function addProductToCart(product, quantity) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const existingProduct = cart.find((item) => item.id == product.id);

  if (existingProduct) {
    existingProduct.quantity += quantity;
    showNotification(`Đã cập nhật số lượng sản phẩm ${product.tenSanPham} trong giỏ hàng!`);
  } else {
    cart.push({
      id: product.id,
      name: product.tenSanPham,
      price: product.gia,
      image: `../${product.hinhAnh}`,
      quantity: quantity,
      brand: product.tenThuongHieu,
    });
    showNotification(`Đã thêm ${product.tenSanPham} vào giỏ hàng!`);
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartBadge();
}

// Setup reset filters button
function setupResetFiltersButton() {
  const resetButton = document.getElementById("resetFilters");
  if (resetButton) {
    resetButton.addEventListener("click", resetAllFilters);
  }
}

// Reset all filters
function resetAllFilters() {
  // Uncheck all checkboxes
  document.querySelectorAll(".dropdown-content .checkbox").forEach((checkbox) => {
    checkbox.checked = false;
  });

  // Clear all search inputs
  document.querySelectorAll(".dropdown-content .search").forEach((input) => {
    input.value = "";
  });

  // Show all labels again
  document.querySelectorAll(".dropdown-content label").forEach((label) => {
    label.style.display = "";
  });

  // Reset "Xem thêm" links
  initializeMoreLinks();

  // Render all products
  currentProducts = allProducts;
  renderProducts(allProducts);
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", loadProducts);
