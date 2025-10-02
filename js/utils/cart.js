// Kiểm tra đăng nhập
function checkLogin() {
  return !!localStorage.getItem("user");
}

// Kiểm tra đăng nhập và hiển thị giao diện theo trạng thái
function checkLoginStatus() {
  const loginElement = document.getElementById("login");
  if (!loginElement) return;

  // Add global styles - only once
  if (!document.getElementById("auth-styles")) {
    addAuthStyles();
  }

  const userString = localStorage.getItem("user");
  if (!userString) {
    renderLoggedOutUI(loginElement);
    return;
  }

  try {
    const user = JSON.parse(userString);
    const displayName = user.taiKhoan || user.name || user.tenKhachHang || "Người dùng";
    renderLoggedInUI(loginElement, displayName, user.email || "Thành viên");
    setupDropdownEvents(loginElement);
  } catch (error) {
    console.error("Error processing user data:", error);
  }
}

// Render UI for logged out user
function renderLoggedOutUI(element) {
  element.innerHTML = `
    <div class="auth-section" style="margin-left: -15px;">
      <a href="/htmls/Login.html" class="auth-link">
        <img width="28" height="28" src="https://img.icons8.com/parakeet-line/48/user-male-circle.png" alt="user-male-circle"/>
        <span>Đăng nhập</span>
      </a>
      <a href="/htmls/GioHang.html" class="cart-link">
        <img class="cart-icon" width="24" height="24" src="https://img.icons8.com/ios/50/shopping-bag--v1.png" alt="shopping-bag--v1"/>
      </a>
    </div>
  `;
}

// Render UI for logged in user
function renderLoggedInUI(element, displayName, email) {
  // Get the profile URL based on user role
  const user = JSON.parse(localStorage.getItem("user"));
  const role = user && user.role ? user.role : "user";
  
  let profileUrl = "../htmls/ThongTinCaNhan.html";
  if (role === "staff") {
    profileUrl = "/htmls/NhanVien/Dashboard.html";
  } else if (role === "admin") {
    profileUrl = "/htmls/Admin/Dashboard.html";
  }

  element.innerHTML = `
    <div class="auth-section">
      <div class="user-dropdown">
        <div class="user-info">
          <img width="28" height="28" src="https://img.icons8.com/parakeet-line/48/user-male-circle.png" alt="user-male-circle"/>
          <p>${displayName}</p>
          <i class="fa-solid fa-chevron-down dropdown-icon"></i>
        </div>
        <div class="user-dropdown-content">
          <div class="dropdown-header">
            <a href="${profileUrl}">
              <img width="24" height="24" src="https://img.icons8.com/parakeet-line/48/user-male-circle.png" alt="user-male-circle"/>
              <div>
                <p class="dropdown-username">${displayName}</p>
                <p class="dropdown-email">${email}</p>
              </div>
            </a>
          </div>
          <div class="dropdown-divider"></div>
          <a href="../htmls/DonHang.html"><i class="fa-solid fa-box"></i> Đơn hàng của tôi</a>
          ${role === "admin" ? `<a href="/htmls/Admin/Dashboard.html"><i class="fa-solid fa-gauge"></i> Quản trị</a>` : ''}
          ${role === "staff" ? `<a href="/htmls/NhanVien/Dashboard.html"><i class="fa-solid fa-gauge"></i> Quản lý</a>` : ''}
          <a href="#" id="logout-btn"><i class="fa-solid fa-right-from-bracket"></i> Đăng xuất</a>
        </div>
      </div>
      <a href="../htmls/GioHang.html" class="cart-link">
        <img class="cart-icon" width="24" height="24" src="https://img.icons8.com/ios/50/shopping-bag--v1.png" alt="shopping-bag--v1"/>
        <span class="cart-badge">0</span>
      </a>
    </div>
  `;
}

// Setup dropdown events
function setupDropdownEvents(element) {
  const userInfo = element.querySelector(".user-info");
  const logoutBtn = element.querySelector("#logout-btn");

  if (userInfo) {
    userInfo.addEventListener("click", (e) => {
      e.stopPropagation();
      const dropdownContent = element.querySelector(".user-dropdown-content");
      userInfo.classList.toggle("active");
      dropdownContent.classList.toggle("show");
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem("user");
      window.location.reload();
    });
  }

  // Close dropdown when clicking outside
  if (!window._dropdownListenerAdded) {
    document.addEventListener("click", () => {
      const userInfo = document.querySelector(".user-info");
      const dropdowns = document.querySelectorAll(".user-dropdown-content");
      if (userInfo) userInfo.classList.remove("active");
      dropdowns.forEach((dropdown) => {
        dropdown.classList.remove("show");
      });
    });
    window._dropdownListenerAdded = true;
  }
}

// Add shared styles for auth section
function addAuthStyles() {
  const style = document.createElement("style");
  style.id = "auth-styles";
  style.textContent = `
    .auth-section {
      display: flex;
      align-items: center;
      gap: 24px;
    }
    .auth-link, .cart-link {
      position: relative;
      display: flex;
      align-items: center;
      text-decoration: none;
      color: inherit;
    }
    .auth-link {
      gap: 8px;
    }
    .auth-link img {
      width: 28px;
      height: 28px;
      object-fit: contain;
    }
    .cart-link img {
      width: 24px;
      height: 24px;
      object-fit: contain;
    }
    .auth-link span {
      font-weight: 600;
      font-size: 14px;
    }
    .user-dropdown {
      position: relative;
    }
    .user-info {
      display: flex;
      align-items: center;
      padding: 6px 12px;
      border-radius: 30px;
      cursor: pointer;
      background-color: #f8f8f8;
      transition: all 0.3s ease;
      border: 1px solid transparent;
      gap: 20px;
    }
    .user-info:hover {
      background-color: #f0f0f0;
      border-color: #e5e5e5;
    }
    .user-info img {
      width: 28px;
      height: 28px;
      object-fit: contain;
    }
    .user-info p {
      margin: 0;
      font-size: 14px;
      font-weight: 500;
    }
    .dropdown-icon {
      font-size: 12px;
      margin-left: 6px;
      color: #888;
      transition: transform 0.3s ease;
    }
    .user-dropdown-content {
      display: none;
      position: absolute;
      right: 0;
      top: calc(100% + 8px);
      background-color: white;
      min-width: 240px;
      box-shadow: 0 5px 25px rgba(0,0,0,0.08);
      z-index: 9999;
      border-radius: 10px;
      border: 1px solid #eee;
      overflow: hidden;
    }
    .dropdown-header {
      display: flex;
      align-items: center;
      padding: 16px;
      background-color: #f9f9f9;
    }
    .dropdown-header a {
      display: flex;
      align-items: center;
      width: 100%;
      padding: 0 !important;
    }
    .dropdown-header img {
      width: 35px;
      height: 35px;
      border-radius: 50%;
      margin-right: 25px;
      object-fit: contain;
      flex: 0 0 auto;
    }
    .dropdown-header div {
      flex: 1;
      min-width: 0;
    }
    .dropdown-username {
      font-weight: 600;
      font-size: 14px;
    }
    .dropdown-email {
      font-size: 12px;
      color: #666;
    }
    .dropdown-divider {
      height: 1px;
      background-color: #eee;
      margin: 0;
    }
    .user-dropdown-content a {
      color: #333;
      padding: 14px 16px !important;
      text-decoration: none;
      display: flex;
      align-items: center;
      gap: 10px;
      transition: background-color 0.2s;
      box-sizing: border-box;
      width: 100%;
    }
    .user-dropdown-content a:hover {
      background-color: #f5f5f5;
    }
    .user-dropdown-content a i {
      width: 16px;
      font-size: 14px;
      text-align: center;
      color: #555;
    }
    .user-info.active .dropdown-icon {
      transform: rotate(180deg);
    }
    .user-dropdown-content.show {
      display: block;
      animation: fadeInDown 0.3s ease;
    }
    @keyframes fadeInDown {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    .cart-badge {
      position: absolute;
      top: -8px;
      right: -8px;
      background-color: #000000c7;
      color: white;
      border-radius: 50%;
      padding: 3px 6px;
      font-size: 11px;
      min-width: 16px;
      height: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      line-height: 1;
    }
    .cart-icon {
      cursor: pointer;
    }
  `;
  document.head.appendChild(style);
}

// Hàm cập nhật số lượng sản phẩm trong giỏ hàng
function updateCartBadge() {
  const cartBadge = document.querySelector(".cart-badge");
  if (!cartBadge) return;

  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
  cartBadge.textContent = totalItems;
}

// Hàm thêm vào giỏ hàng và cập nhật badge
function addToCartAndUpdate(product, quantity) {
  if (!isLocalStorageSupported()) return;

  // Kiểm tra đăng nhập khi thêm vào giỏ hàng
  if (!checkLogin()) {
    if (
      confirm(
        "Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng. Bạn có muốn đăng nhập ngay bây giờ?"
      )
    ) {
      window.location.href = "../htmls/Login.html";
    }
    return;
  }

  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const existingProduct = cart.find((item) => item.id == product.id);

  if (existingProduct) {
    existingProduct.quantity = (existingProduct.quantity || 0) + quantity;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.imageUrl || product.image,
      quantity: quantity,
      brand: product.brand,
    });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartBadge();
}

// Cập nhật badge khi có sự kiện storage thay đổi
window.addEventListener("storage", function (e) {
  if (e.key === "cart" || e.key === "user") {
    updateCartBadge();
    checkLoginStatus();
  }
});

// Cập nhật badge và trạng thái đăng nhập khi trang load
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", function () {
    updateCartBadge();
    checkLoginStatus();
  });
} else {
  updateCartBadge();
  checkLoginStatus();
}
