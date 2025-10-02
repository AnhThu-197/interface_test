// update lại giỏ
updateCartBadge();
// Lấy thông tin sản phẩm từ URL
function getProductIdFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("id");
}

// Format price to Vietnamese currency
function formatPrice(price) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
    .format(price)
    .replace("₫", "Đ");
}

// Hàm tải dữ liệu sản phẩm từ JSON
async function loadProducts() {
  try {
    const response = await fetch("/data/products.json");
    const data = await response.json();
    return data.products;
  } catch (error) {
    console.error("Error loading products:", error);
    return [];
  }
}

// Hàm tải dữ liệu giảm giá từ JSON
async function loadDiscounts() {
  try {
    const response = await fetch("/data/discounts.json");
    const data = await response.json();
    return data.discounts;
  } catch (error) {
    console.error("Error loading discounts:", error);
    return [];
  }
}

// Hàm lấy thông tin giảm giá cho sản phẩm
function getProductDiscount(productCode, discounts) {
  if (!discounts || discounts.length === 0) return null;

  const now = new Date();
  return discounts.find(
    (discount) =>
      discount.maSanPham === productCode &&
      discount.trangThai === "active" &&
      new Date(discount.ngayBatDau) <= now &&
      new Date(discount.ngayKetThuc) >= now
  );
}

// Hàm lấy thông tin sản phẩm từ danh sách sản phẩm đã tải
function getProductDetails(productId, products, discounts) {
  if (!products || products.length === 0) return null;

  const product = products.find((p) => p.id == productId);

  if (!product) return null;

  const discount = getProductDiscount(product.maSanPham, discounts);

  let originalPrice = null;
  if (discount) {
    originalPrice = product.gia;
    product.gia = Math.round(product.gia * (1 - discount.phanTramGiam / 100));
  }

  // Tạo thông tin chi tiết sản phẩm
  return {
    id: product.id,
    name: product.tenSanPham,
    brand: product.tenThuongHieu,
    price: product.gia,
    originalPrice: originalPrice,
    description: product.moTa,
    ingredients: `• Chất liệu của ${product.tenSanPham}`,
    usage: ``,
    origin: product.soLuongBan || "Chưa cập nhật",
    sku: product.soLuongTon || "Chưa cập nhật",
    images: [`../${product.hinhAnh}`, `../${product.hinhAnh}`, `../${product.hinhAnh}`],
  };
}

// Hàm render thông tin sản phẩm
function renderProductDetails(product) {
  console.log("product", product);

  // Cập nhật tiêu đề trang
  document.title = product.name;

  // Cập nhật breadcrumb
  document.querySelector(".product-name").textContent = product.name;

  // Cập nhật gallery
  const mainImage = document.getElementById("main-product-image");
  mainImage.src = product.images[0];
  mainImage.alt = product.name;

  const thumbnailList = document.querySelector(".thumbnail-list");
  thumbnailList.innerHTML = product.images
    .map(
      (image) => `
        <img src="${image}" alt="${product.name}" onclick="updateMainImage('${image}')">
    `
    )
    .join("");

  // Cập nhật thông tin sản phẩm
  document.querySelector(".product-brand").textContent = product.brand;
  document.querySelector(".product-title").textContent = product.name;

  // Cập nhật giá
  const formattedPrice = formatPrice(product.price);
  const formattedOriginalPrice = product.originalPrice ? formatPrice(product.originalPrice) : "";

  const priceElement = document.querySelector(".product-price");

  if (product.originalPrice && product.originalPrice > product.price) {
    const discount = Math.round((1 - product.price / product.originalPrice) * 100);
    priceElement.innerHTML = `
            <span class="current-price">${formattedPrice}</span>
            <span class="original-price">${formattedOriginalPrice}</span>
            <span class="discount-badge">-${discount}%</span>
        `;
  } else {
    priceElement.innerHTML = `<span class="current-price">${formattedPrice}</span>`;
  }

  document.querySelector(".origin").textContent = product.origin;
  document.querySelector(".sku").textContent = product.sku;

  // Cập nhật nội dung tabs
  document.getElementById("description").innerHTML = product.description;
  document.getElementById("ingredients").innerHTML = product.ingredients;
  document.getElementById("usage").innerHTML = product.usage;

  // Render sản phẩm liên quan
  renderRelatedProducts(product.id);

  updateCartBadge();
}

// Hàm cập nhật ảnh chính
function updateMainImage(imageSrc) {
  const mainImage = document.getElementById("main-product-image");
  mainImage.src = imageSrc;
}

// Xử lý chuyển tab
document.addEventListener("DOMContentLoaded", async function () {
  // Tải dữ liệu sản phẩm và giảm giá
  const products = await loadProducts();
  const discounts = await loadDiscounts();

  const tabButtons = document.querySelectorAll(".tab-btn");
  const tabPanes = document.querySelectorAll(".tab-pane");

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // Remove active class from all buttons and panes
      tabButtons.forEach((btn) => btn.classList.remove("active"));
      tabPanes.forEach((pane) => pane.classList.remove("active"));

      // Add active class to clicked button and corresponding pane
      button.classList.add("active");
      const tabId = button.dataset.tab;
      document.getElementById(tabId).classList.add("active");
    });
  });

  // Set up "View more reviews" button
  const viewMoreReviewsBtn = document.getElementById("viewMoreReviewsBtn");
  if (viewMoreReviewsBtn) {
    const productId = getProductIdFromUrl();
    viewMoreReviewsBtn.href = `XemDanhGia.html?id=${productId}`;
  }

  // Xử lý số lượng
  const minusBtn = document.querySelector(".minus");
  const plusBtn = document.querySelector(".plus");
  const quantityInput = document.querySelector(".quantity-input");

  minusBtn.addEventListener("click", () => {
    let quantity = parseInt(quantityInput.value);
    if (quantity > 1) {
      quantityInput.value = quantity - 1;
    }
  });

  plusBtn.addEventListener("click", () => {
    let quantity = parseInt(quantityInput.value);
    quantityInput.value = quantity + 1;
  });

  quantityInput.addEventListener("change", () => {
    let quantity = parseInt(quantityInput.value);
    if (isNaN(quantity) || quantity < 1) {
      quantityInput.value = 1;
    }
  });

  // Xử lý thêm vào giỏ hàng và mua ngay
  const addToCartBtn = document.querySelector(".add-to-cart-btn");
  const buyNowBtn = document.querySelector(".buy-now-btn");

  addToCartBtn.addEventListener("click", () => {
    // Kiểm tra đăng nhập
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      if (
        confirm(
          "Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng. Bạn có muốn đăng nhập ngay bây giờ?"
        )
      ) {
        window.location.href = "../DangNhap/dangnhap.html";
      }
      return;
    }

    const productId = getProductIdFromUrl();
    const product = getProductDetails(productId, products, discounts);
    const quantity = parseInt(quantityInput.value);

    addToCart(product, quantity);

    updateCartBadge();
    showNotification(`Đã thêm ${product.name} vào giỏ hàng!`);
  });

  buyNowBtn.addEventListener("click", () => {
    // Kiểm tra đăng nhập
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      if (confirm("Bạn cần đăng nhập để mua hàng. Bạn có muốn đăng nhập ngay bây giờ?")) {
        window.location.href = "../DangNhap/dangnhap.html";
      }
      return;
    }

    const productId = getProductIdFromUrl();
    const product = getProductDetails(productId, products, discounts);
    const quantity = parseInt(quantityInput.value);

    // Thêm vào giỏ hàng
    addToCart(product, quantity);

    // Chuyển đến trang giỏ hàng
    window.location.href = "/htmls/GioHang.html";
  });

  // Load thông tin sản phẩm
  const productId = getProductIdFromUrl();
  if (productId) {
    const product = getProductDetails(productId, products, discounts);
    if (product) {
      renderProductDetails(product);
    } else {
      console.error("Không tìm thấy sản phẩm với ID:", productId);
    }
  }
});

// Các hàm xử lý giỏ hàng
function getCart() {
  const cart = localStorage.getItem("cart");
  return cart ? JSON.parse(cart) : [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function addToCart(product, quantity) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const existingProduct = cart.find((item) => item.id === product.id);

  if (existingProduct) {
    existingProduct.quantity += quantity;
    showNotification(`Đã cập nhật số lượng sản phẩm ${product.name} trong giỏ hàng!`);
  } else {
    const image = product.images && product.images.length > 0 ? product.images[0] : product.image;
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: image,
      quantity: quantity,
      brand: product.brand,
    });
    showNotification(`Đã thêm ${product.name} vào giỏ hàng!`);
    updateCartBadge();
  }

  localStorage.setItem("cart", JSON.stringify(cart));
}

// Hàm render sản phẩm liên quan
async function renderRelatedProducts(currentProductId) {
  try {
    // Tải dữ liệu sản phẩm và giảm giá
    const products = await loadProducts();
    const discounts = await loadDiscounts();

    // Lọc ra 4 sản phẩm liên quan (trừ sản phẩm hiện tại)
    const relatedProducts = products
      .filter((product) => product.id != currentProductId)
      .slice(0, 4)
      .map((product) => {
        const discount = getProductDiscount(product.maSanPham, discounts);
        let price = product.gia;
        if (discount) {
          price = Math.round(price * (1 - discount.phanTramGiam / 100));
        }
        return {
          id: product.id,
          brand: product.tenThuongHieu,
          name: product.tenSanPham,
          price: price,
          image: `../${product.hinhAnh}`,
        };
      });

    // Render sản phẩm liên quan
    const productGrid = document.querySelector(".product-grid");
    productGrid.innerHTML = relatedProducts
      .map(
        (product) => `
          <div class="product-item" data-product-id="${product.id}" onclick="navigateToProduct('${
          product.id
        }')">
              <img src="${product.image}" alt="${product.name}">
              <div class="brand">${product.brand}</div>
              <div class="name">${product.name}</div>
              <div class="price">${formatPrice(product.price)}</div>
              <button class="add-to-cart-btn" onclick="event.stopPropagation(); addToCartFromRelated('${
                product.id
              }')">
                  Thêm vào giỏ
              </button>
          </div>
      `
      )
      .join("");
  } catch (error) {
    console.error("Error rendering related products:", error);
  }
}

// Thêm sản phẩm liên quan vào giỏ hàng
async function addToCartFromRelated(productId) {
  try {
    const products = await loadProducts();
    const discounts = await loadDiscounts();
    const product = getProductDetails(productId, products, discounts);
    if (product) {
      addToCart(product, 1);
      showNotification(`Đã thêm ${product.name} vào giỏ hàng!`);
      updateCartBadge();
    }
  } catch (error) {
    console.error("Error adding product to cart:", error);
  }
}

// Hàm chuyển trang khi click vào sản phẩm
function navigateToProduct(productId) {
  window.location.href = `../htmls/ChiTietSanPham.html?id=${productId}`;
}
// render navbar
checkLoginStatus();
