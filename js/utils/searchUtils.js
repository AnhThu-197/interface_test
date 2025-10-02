// Create search dropdown
function createSearchDropdown() {
  // Nếu đã có dropdown thì không tạo lại
  if (document.getElementById("search-box-items")) return;

  const dropdown = document.createElement("div");
  dropdown.className = "search-box-items";
  dropdown.id = "search-box-items";
  dropdown.style.position = "absolute";
  dropdown.style.zIndex = "99999";
  dropdown.style.display = "none";
  dropdown.innerHTML = `
    <ul class="box-items">
      <p id="box-items--title">KẾT QUẢ TÌM KIẾM</p>
      <div id="search-results"></div>
    </ul>
  `;
  document.body.appendChild(dropdown);

  // Ngăn dropdown đóng khi click vào nó
  dropdown.addEventListener("click", function (e) {
    e.stopPropagation();
  });
}

// Position dropdown below search input
function positionDropdown() {
  const input = document.getElementById("search-text");
  const dropdown = document.getElementById("search-box-items");
  if (!input || !dropdown) return;
  const rect = input.getBoundingClientRect();
  dropdown.style.left = rect.left + window.scrollX + "px";
  dropdown.style.top = rect.bottom + window.scrollY + "px";
  dropdown.style.display = "block";
}

// Hide dropdown
function hideDropdown() {
  const dropdown = document.getElementById("search-box-items");
  if (dropdown) dropdown.style.display = "none";
}

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

// Get current page path to determine relative paths
function getRelativePath() {
  // Check if the current page is in a subdirectory
  const path = window.location.pathname;
  if (path.includes("/htmls/") || path.includes("\\htmls\\")) {
    return "../";
  }
  return "";
}

// Xây dựng URL đúng cho trang chi tiết sản phẩm
function buildProductDetailUrl(productId) {
  const currentPath = window.location.pathname;

  if (
    currentPath.endsWith("/trangchu.html") ||
    currentPath.endsWith("/") ||
    currentPath.endsWith("\\") ||
    currentPath.includes("index.html")
  ) {
    // Nếu đang ở trang chủ, đường dẫn sẽ là htmls/ChiTietSanPham.html
    return `htmls/ChiTietSanPham.html?id=${productId}`;
  } else {
    // Nếu đang ở trang con trong thư mục htmls, đường dẫn sẽ là ChiTietSanPham.html
    return `ChiTietSanPham.html?id=${productId}`;
  }
}

// Render search results
function renderSearchResults(keyword) {
  const resultsContainer = document.getElementById("search-results");
  if (!resultsContainer) return;

  if (!keyword.trim()) {
    resultsContainer.innerHTML = `<p class="no-results">Nhập tên sản phẩm để tìm kiếm</p>`;
    return;
  }

  // Get correct path for API calls and links
  const basePath = getRelativePath();

  // Fetch products and search
  fetch(`${basePath}data/products.json`)
    .then((res) => res.json())
    .then((data) => {
      // Simple search function
      const searchProducts = (keyword) => {
        const searchTerm = keyword.toLowerCase();
        return data.products.filter(
          (product) =>
            product.tenSanPham.toLowerCase().includes(searchTerm) ||
            product.tenThuongHieu.toLowerCase().includes(searchTerm)
        );
      };

      const products = searchProducts(keyword);

      if (products.length === 0) {
        resultsContainer.innerHTML = `<p class="no-results">Không tìm thấy sản phẩm phù hợp</p>`;
        return;
      }

      // Hiển thị tối đa 5 sản phẩm
      const limitedProducts = products.slice(0, 5);

      resultsContainer.innerHTML = limitedProducts
        .map((product) => {
          const productUrl = buildProductDetailUrl(product.id);
          return `
            <a href="${productUrl}" class="search-product-item">
              <div class="search-product-image">
                <img src="${basePath}${product.hinhAnh}" alt="${product.tenSanPham}">
              </div>
              <div class="search-product-info">
                <div class="search-product-brand">${product.tenThuongHieu}</div>
                <div class="search-product-name">${product.tenSanPham}</div>
                <div class="search-product-price">
                  <span class="search-current-price">${formatPrice(product.gia)}</span>
                </div>
              </div>
            </a>
            `;
        })
        .join("");
    })
    .catch((err) => {
      console.error("Lỗi khi tìm kiếm sản phẩm:", err);
      resultsContainer.innerHTML = `<p class="no-results">Đã xảy ra lỗi khi tìm kiếm</p>`;
    });
}

// Initialize search functionality
function initializeSearch() {
  createSearchDropdown();

  const input = document.getElementById("search-text");
  if (!input) return;

  // Chuyển searchBox thành biến global cho hàm này
  const searchBox = document.getElementById("search-box");

  // Ngăn form submit
  if (searchBox && searchBox.tagName === "FORM") {
    searchBox.addEventListener("submit", function (e) {
      e.preventDefault();
    });
  }

  input.addEventListener("focus", function (e) {
    e.stopPropagation();
    renderSearchResults(this.value);
    positionDropdown();
  });

  input.addEventListener("input", function () {
    renderSearchResults(this.value);
    positionDropdown();
  });

  // Sử dụng sự kiện click toàn cục để đóng dropdown
  document.addEventListener("click", function (e) {
    const dropdown = document.getElementById("search-box-items");

    // Chỉ đóng dropdown nếu click không phải vào search box hoặc dropdown
    if (dropdown && searchBox) {
      if (!dropdown.contains(e.target) && !searchBox.contains(e.target)) {
        hideDropdown();
      }
    }
  });

  // Đóng dropdown khi cuộn trang
  window.addEventListener("scroll", hideDropdown);
}

// Automatically initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", initializeSearch);
