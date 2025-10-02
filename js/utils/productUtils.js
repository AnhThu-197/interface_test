let products = [];
let discounts = [];

// Function to load JSON data
async function loadData() {
  try {
    // Load products
    const productsResponse = await fetch("/data/products.json");
    const productsData = await productsResponse.json();
    products = productsData.products;

    // Load discounts
    const discountsResponse = await fetch("/data/discounts.json");
    const discountsData = await discountsResponse.json();
    discounts = discountsData.discounts;

    console.log(
      "Data loaded successfully:",
      products.length,
      "products and",
      discounts.length,
      "discounts"
    );
    return true;
  } catch (error) {
    console.error("Error loading data:", error);
    return false;
  }
}

function getProductById(productId) {
  return products.find((p) => p.id === productId);
}

// Get product by product code
function getProductByCode(code) {
  return products.find((p) => p.maSanPham === code);
}

// Get all products
function getAllProducts() {
  return [...products];
}

function getDiscountByProductId(productId) {
  const product = getProductById(productId);
  if (!product) return null;

  const now = new Date();
  return discounts.find(
    (d) =>
      d.maSanPham === product.maSanPham &&
      d.trangThai === "active" &&
      new Date(d.ngayBatDau) <= now &&
      new Date(d.ngayKetThuc) >= now
  );
}

// Calculate discounted price
function getDiscountedPrice(productId) {
  const product = getProductById(productId);
  if (!product) return 0;

  const discount = getDiscountByProductId(productId);
  if (!discount) return product.gia;

  return Math.round(product.gia - (product.gia * discount.phanTramGiam) / 100);
}

// Get product with discount info
function getProductWithDiscount(productId) {
  const product = getProductById(productId);
  if (!product) return null;

  const discount = getDiscountByProductId(productId);

  return {
    ...product,
    giamGia: discount
      ? {
          giaGoc: discount.giaGoc,
          phanTramGiam: discount.phanTramGiam,
          laFlashSale: discount.laFlashSale,
        }
      : null,
    giaSauGiam: getDiscountedPrice(productId),
  };
}

// Get all products with discount info
function getAllProductsWithDiscount() {
  return products.map((product) => getProductWithDiscount(product.id));
}

function getFlashSaleProducts() {
  return getAllProductsWithDiscount()
    .filter((product) => product.giamGia && product.giamGia.laFlashSale)
    .sort((a, b) => b.giamGia.phanTramGiam - a.giamGia.phanTramGiam);
}

// Get Best Seller products
function getBestSellerProducts(limit = 10) {
  return getAllProductsWithDiscount()
    .sort((a, b) => b.soLuongBan - a.soLuongBan)
    .slice(0, limit);
}

// Search products by keyword
function searchProducts(keyword) {
  if (!keyword) return [];

  const searchTerm = keyword.toLowerCase();
  return getAllProductsWithDiscount().filter(
    (product) =>
      product.tenSanPham.toLowerCase().includes(searchTerm) ||
      product.tenThuongHieu.toLowerCase().includes(searchTerm)
  );
}

// Filter products by category
function filterProductsByCategory(categoryId) {
  if (!categoryId) return getAllProductsWithDiscount();

  return getAllProductsWithDiscount().filter((product) => product.maDanhMuc === categoryId);
}

// Filter products by brand
function filterProductsByBrand(brandId) {
  if (!brandId) return getAllProductsWithDiscount();

  return getAllProductsWithDiscount().filter((product) => product.maThuongHieu === brandId);
}

// Filter products by price range
function filterProductsByPriceRange(minPrice, maxPrice) {
  return getAllProductsWithDiscount().filter((product) => {
    const price = product.giaSauGiam || product.gia;
    return price >= (minPrice || 0) && (maxPrice === 0 || price <= maxPrice || !maxPrice);
  });
}

// Utility functions

// Format price for display
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

// Render Flash Sale products to HTML
function renderFlashSaleProducts(containerId, limit = 8) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const flashSaleProducts = getFlashSaleProducts().slice(0, limit);

  container.innerHTML = flashSaleProducts
    .map(
      (product) => `
    <div class="product-card" data-product-id="${product.id}">
      <div class="product-image">
        <img src="${product.hinhAnh}" alt="${product.tenSanPham}">
      </div>
      <div class="product-info">
        <div class="product-brand">${product.tenThuongHieu}</div>
        <div class="product-name">${product.tenSanPham}</div>
        <div class="product-price">
          <span class="current-price">${formatPrice(product.giaSauGiam)}</span>
          ${
            product.giamGia
              ? `<span class="original-price">${formatPrice(product.giamGia.giaGoc)}</span>`
              : ""
          }
        </div>
        ${
          product.giamGia
            ? `<div class="discount-badge">-${product.giamGia.phanTramGiam}%</div>`
            : ""
        }
      </div>
      <button class="add-to-cart-btn" onclick="addToCart(${product.id}, 1)">Thêm vào giỏ</button>
    </div>
  `
    )
    .join("");
}

// Render Best Seller products to HTML
function renderBestSellerProducts(containerId, limit = 7) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const bestSellerProducts = getBestSellerProducts(limit);

  container.innerHTML = bestSellerProducts
    .map(
      (product) => `
    <div class="Best_seller-item" data-product-id="${product.id}">
      <div class="image-container">
        <img src="${product.hinhAnh}" alt="${product.tenSanPham}">
      </div>
      <h3>${product.tenThuongHieu}</h3>
      <p>${product.tenSanPham}</p>
      <div class="price">
        ${formatPrice(product.giaSauGiam)}
        ${product.giamGia ? `<del>${formatPrice(product.giamGia.giaGoc)}</del>` : ""}
      </div>
      <button class="add-to-cart-btn" onclick="addToCart(${product.id}, 1)">Thêm vào giỏ</button>
    </div>
  `
    )
    .join("");
}

// Render product grid for category pages
function renderProductGrid(containerId, products) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = products
    .map(
      (product) => `
    <div class="product-item" data-product-id="${product.id}" onclick="navigateToProduct(${
        product.id
      })">
      <img src="${product.hinhAnh}" alt="${product.tenSanPham}">
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
      <button class="add-to-cart-btn" onclick="event.stopPropagation(); addToCart(${
        product.id
      }, 1)">
        Thêm vào giỏ
      </button>
    </div>
  `
    )
    .join("");
}

// Initialize product data
async function initializeProducts() {
  const loaded = await loadData();
  if (!loaded) {
    console.error("Failed to load product data");
    return false;
  }

  console.log("Product data initialized successfully");
  return true;
}
