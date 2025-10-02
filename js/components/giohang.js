function convertPriceToNumber(priceString) {
  return parseInt(priceString.replace(/[^\d]/g, ""));
}

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

// Hàm chuyển đổi giá từ chuỗi sang số
function parsePrice(priceStr) {
  if (typeof priceStr === "number") return priceStr;
  return parseInt(priceStr.replace(/[^\d]/g, ""));
}

// Hàm chuẩn hóa đường dẫn ảnh
function normalizeImagePath(imagePath) {
  if (!imagePath) return "";

  // Nếu đường dẫn đã bắt đầu bằng http, giữ nguyên
  if (imagePath.startsWith("http")) {
    return imagePath;
  }

  // Nếu đường dẫn bắt đầu bằng dấu /, bỏ dấu / đầu tiên và thêm ../ vào đầu
  if (imagePath.startsWith("/")) {
    return `..${imagePath}`;
  }

  // Nếu đường dẫn đã bắt đầu bằng ../
  if (imagePath.startsWith("../")) {
    // Trang giỏ hàng ở thư mục htmls/, nên chỉ cần giữ nguyên đường dẫn
    return imagePath;
  }

  // Trường hợp còn lại, thêm tiền tố ../
  return `../${imagePath}`;
}

// Hàm tạo HTML cho một sản phẩm trong giỏ hàng
function createCartItemHTML(products) {
  // Chuẩn hóa đường dẫn ảnh
  const imagePath = normalizeImagePath(products.image);

  return `
        <div class="cart-item" data-id="${products.id}">
            <div class="item-image">
                <img src="${imagePath}" alt="${products.name}">
            </div>
            <div class="item-info">
                <div class="item-name">${products.name}</div>
                <div class="item-price">
                    <span class="current-price">${formatPrice(products.price)}</span>
                </div>
                <div class="item-actions">
                    <div class="quantity-controls">
                        <button class="quantity-btn minus">-</button>
                        <input type="text" value="${products.quantity}" class="quantity-input">
                        <button class="quantity-btn plus">+</button>
                    </div>
                    <button class="remove-btn">
                        <i class="fas fa-trash"></i>
                        Xóa
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Hàm cập nhật tổng giá tiền
function updateTotalPrice() {
  const cart = getCart();
  let totalPrice = 0;
  cart.forEach((item) => {
    // Đảm bảo giá là số
    const price =
      typeof item.price === "string" ? parseInt(item.price.replace(/[^\d]/g, "")) : item.price;
    totalPrice += price * item.quantity;
  });

  // Cập nhật tổng tiền hàng
  document.querySelector(".total-amount").textContent = formatPrice(totalPrice);
  // Cập nhật tổng thanh toán
  document.querySelector(".final-amount").textContent = formatPrice(totalPrice);
}

// Hàm xóa toàn bộ giỏ hàng
function clearCart() {
  localStorage.removeItem("cart");
  renderCart();
}

// Hàm lưu giỏ hàng vào localStorage
function saveCart(cart) {
  if (!Array.isArray(cart)) {
    console.error("Invalid cart data");
    return;
  }
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Hàm lấy giỏ hàng từ localStorage
function getCart() {
  try {
    const cart = localStorage.getItem("cart");
    return cart ? JSON.parse(cart) : [];
  } catch (error) {
    console.error("Error reading cart from localStorage:", error);
    return [];
  }
}

// Hàm cập nhật số lượng sản phẩm trong giỏ hàng
function updateCartQuantity(productId, newQuantity) {
  const cart = getCart();
  const product = cart.find((item) => item.id == productId);
  if (product) {
    product.quantity = newQuantity;
    saveCart(cart);
    updateTotalPrice();
  }
}

// Hàm xóa sản phẩm khỏi giỏ hàng
function removeFromCart(productId) {
  const cart = getCart();
  const updatedCart = cart.filter((item) => item.id != productId);
  saveCart(updatedCart);
  updateTotalPrice();
  return updatedCart;
}

// Hàm render giỏ hàng
function renderCart() {
  const cart = getCart();
  const cartItemsContainer = document.querySelector(".cart-items");

  if (!cart || cart.length === 0) {
    cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <p>Bạn chưa có sản phẩm nào trong giỏ hàng</p>
            </div>
        `;
    document.querySelector(".total-amount").textContent = formatPrice(0);
    document.querySelector(".final-amount").textContent = formatPrice(0);
    return;
  }

  cartItemsContainer.innerHTML = cart
    .map((product) => {
      // Đảm bảo giá là số
      const price =
        typeof product.price === "string"
          ? parseInt(product.price.replace(/[^\d]/g, ""))
          : product.price;

      // Chuẩn hóa đường dẫn ảnh
      const imagePath = normalizeImagePath(product.image);

      return `
            <div class="cart-item" data-id="${product.id}">
                <div class="item-image">
                    <img src="${imagePath}" alt="${product.name}">
                </div>
                <div class="item-info">
                    <div class="item-name">${product.name}</div>
                    <div class="item-price">
                        <span class="current-price">${formatPrice(price)}</span>
                    </div>
                    <div class="item-actions">
                        <div class="quantity-controls">
                            <button class="quantity-btn minus">-</button>
                            <input type="text" value="${product.quantity}" class="quantity-input">
                            <button class="quantity-btn plus">+</button>
                        </div>
                        <button class="remove-btn">
                            <i class="fas fa-trash"></i>
                            Xóa
                        </button>
                    </div>
                </div>
            </div>
        `;
    })
    .join("");

  // Thêm event listeners cho các nút trong giỏ hàng
  addCartEventListeners();
  // Cập nhật tổng tiền
  updateTotalPrice();
}

// Hàm thêm event listeners cho các nút trong giỏ hàng
function addCartEventListeners() {
  const cartItems = document.querySelectorAll(".cart-item");

  cartItems.forEach((item) => {
    const minusBtn = item.querySelector(".minus");
    const plusBtn = item.querySelector(".plus");
    const quantityInput = item.querySelector(".quantity-input");
    const removeBtn = item.querySelector(".remove-btn");
    const productId = item.dataset.id;

    // Xử lý nút giảm số lượng
    minusBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      let quantity = parseInt(quantityInput.value);
      if (quantity > 1) {
        quantity--;
        quantityInput.value = quantity;
        updateCartQuantity(productId, quantity);
      }
    });

    // Xử lý nút tăng số lượng
    plusBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      let quantity = parseInt(quantityInput.value);
      quantity++;
      quantityInput.value = quantity;
      updateCartQuantity(productId, quantity);
    });

    // Xử lý khi nhập số lượng trực tiếp
    quantityInput.addEventListener("change", (e) => {
      e.stopPropagation();
      let quantity = parseInt(quantityInput.value);
      if (isNaN(quantity) || quantity < 1) {
        quantity = 1;
      }
      quantityInput.value = quantity;
      updateCartQuantity(productId, quantity);
    });

    // Xử lý nút xóa sản phẩm
    removeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      removeFromCart(productId);
      item.remove();

      // Kiểm tra nếu giỏ hàng trống
      const remainingItems = document.querySelectorAll(".cart-item");
      if (remainingItems.length === 0) {
        renderCart();
      }
    });
  });
}

// Kiểm tra đăng nhập khi truy cập trang giỏ hàng
document.addEventListener("DOMContentLoaded", function () {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) {
    if (confirm("Bạn cần đăng nhập để xem giỏ hàng. Bạn có muốn đăng nhập ngay bây giờ?")) {
      window.location.href = "../htmls/Login.html";
    } else {
      window.location.href = "../trangchu.html";
    }
    return;
  }
  renderCart();
});

// Xử lý nút Tiếp tục
document.querySelector(".checkout-btn").addEventListener("click", function () {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (cart.length > 0) {
    window.location.href = "ThanhToan.html";
  } else {
    alert("Giỏ hàng của bạn đang trống! Vui lòng thêm sản phẩm vào giỏ hàng.");
  }
});