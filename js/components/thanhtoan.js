// Hàm format giá tiền
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

// Hàm chuẩn hóa đường dẫn ảnh
function normalizeImagePath(imagePath) {
  if (!imagePath) return "";

  // Nếu đường dẫn đã bắt đầu bằng http hoặc dấu /, giữ nguyên
  if (imagePath.startsWith("http") || imagePath.startsWith("/")) {
    return imagePath;
  }

  // Nếu đường dẫn đã bắt đầu bằng ../
  if (imagePath.startsWith("../")) {
    // Vì trang thanh toán ở thư mục htmls/, cần đi lên thêm một cấp
    return imagePath.replace("../", "../../");
  }

  // Trường hợp còn lại, thêm tiền tố ../../
  return `../../${imagePath}`;
}

// Hàm render sản phẩm trong giỏ hàng
function renderCartItems() {
  const cartContainer = document.querySelector(".cart-items");
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  let total = 0;

  if (cart.length === 0) {
    cartContainer.innerHTML = `
      <div class="empty-cart">
        <p>Bạn chưa có sản phẩm nào trong giỏ hàng</p>
        <a href="../trangchu.html" class="continue-shopping">Tiếp tục mua sắm</a>
      </div>
    `;
    updateOrderSummary(0);
    return;
  }

  const cartHTML = cart
    .map((item) => {
      total += item.price * item.quantity;
      // Chuẩn hóa đường dẫn ảnh
      const imagePath = normalizeImagePath(item.image);
      return `
      <div class="cart-item">
        <div class="item-image">
          <img src="${imagePath}" alt="${item.name}">
        </div>
        <div class="item-info">
          <div class="item-name">${item.name}</div>
          <div class="item-expiry">>12 tháng</div>
          <div class="item-actions">
            <div class="quantity-controls">
              <input type="text" value="${item.quantity}" class="quantity-input" />
            </div>
            <div class="item-price">${formatPrice(item.price)}</div>
          </div>
        </div>
      </div>
    `;
    })
    .join("");

  cartContainer.innerHTML = cartHTML;
  updateOrderSummary(total);
}

// Cập nhật tổng tiền
function updateOrderSummary(subtotal) {
  const subtotalElement = document.querySelector(".subtotal .amount");
  const totalElement = document.querySelector(".total .amount");

  subtotalElement.textContent = formatPrice(subtotal);
  totalElement.textContent = formatPrice(subtotal); // Có thể thêm phí vận chuyển và giảm giá sau
}

// Xử lý áp dụng mã giảm giá
document.querySelector(".voucher button").addEventListener("click", function () {
  const voucherInput = document.querySelector(".voucher input");
  const voucherCode = voucherInput.value.trim();

  if (voucherCode === "ANHTHU") {
    const subtotal = parseInt(
      document.querySelector(".subtotal .amount").textContent.replace(/\D/g, "")
    );
    const discount = 100000;
    const total = Math.max(0, subtotal - discount);

    document.querySelector(".total .amount").textContent = formatPrice(total);
    alert("Đã áp dụng mã giảm giá thành công!");
  } else {
    alert("Mã giảm giá không hợp lệ!");
  }
});

// Xử lý đặt hàng
document.querySelector(".place-order-btn").addEventListener("click", function (e) {
  e.preventDefault();

  const form = document.getElementById("shipping-form");
  if (form.checkValidity()) {
    // Lưu thông tin đơn hàng
    const orderInfo = {
      shipping: {
        name: form.querySelector('input[type="text"]').value,
        email: form.querySelector('input[type="email"]').value,
        phone: form.querySelector('input[type="tel"]').value,
        address: form.querySelector('input[placeholder="Địa chỉ"]').value,
        note: form.querySelector("textarea").value,
      },
      items: JSON.parse(localStorage.getItem("cart")) || [],
      total: parseInt(document.querySelector(".total .amount").textContent.replace(/\D/g, "")),
      paymentMethod: document.querySelector('input[name="payment"]:checked').value,
    };

    // Lưu đơn hàng vào localStorage
    const orders = JSON.parse(localStorage.getItem("orders")) || [];
    orders.push(orderInfo);
    localStorage.setItem("orders", JSON.stringify(orders));

    // Xóa giỏ hàng
    localStorage.removeItem("cart");

    // Chuyển đến trang cảm ơn
    alert("Đặt hàng thành công! Cảm ơn bạn đã mua hàng.");
    window.location.href = "../trangchu.html";
  } else {
    alert("Vui lòng điền đầy đủ thông tin giao hàng!");
  }
});

// Khởi tạo khi trang load
document.addEventListener("DOMContentLoaded", function () {
  renderCartItems();
  addCartQuantityControls();

  const provinceSelect = document.getElementById("province");
  const districtSelect = document.getElementById("district");
  const wardSelect = document.getElementById("ward");

  // Sample data for districts and wards
  const locationData = {
    hanoi: {
      hoankiem: ["Phạm Đình Tường", "Tràng Tiền", "Hàng Bài", "Phúc Xá", "Trúc Bạch"],
      badinh: ["Liễu Giai", "Nguyễn Trung Trực", "Điện Biên", "Đội Cấn", "Vĩnh Phúc"],
      dongda: ["Ô Chợ Dừa", "Khâm Thiên", "Thổ Quan", "Văn Miếu", "Láng Hạ"],
      haibatrung: ["Bạch Đằng", "Bách Khoa", "Bạch Mai", "Minh Khai", "Quỳnh Mai"],
      tayho: ["Quảng An", "Tứ Liên", "Nhật Tân", "Phú Thượng", "Yên Phụ"],
    },
    hcm: {
      quan1: ["Bến Nghé", "Bến Thành", "Cầu Ông Lãnh", "Cô Giang", "Đa Kao"],
      quan3: ["Phường 1", "Phường 2", "Phường 3", "Phường 4", "Phường 5"],
      quan5: ["Phường 1", "Phường 2", "Phường 3", "Phường 4", "Phường 5"],
      quan7: ["Tân Phong", "Tân Phú", "Tân Quy", "Tân Thuận Đông", "Tân Thuận Tây"],
      quan10: ["Phường 1", "Phường 2", "Phường 3", "Phường 4", "Phường 5"],
    },
    danang: {
      haichau: ["Bình Hiên", "Bình Thuận", "Hải Châu 1", "Hải Châu 2", "Nam Dương"],
      thanhkhe: ["An Khê", "Chính Gián", "Hòa Khê", "Tam Thuận", "Thạc Gián"],
      sontra: ["An Hải Bắc", "An Hải Đông", "An Hải Tây", "Mân Thái", "Nại Hiên Đông"],
      nguhanhson: ["Hòa Hải", "Hòa Quý", "Khuê Mỹ", "Mỹ An"],
      lienchieu: ["Hòa Hiệp Bắc", "Hòa Hiệp Nam", "Hòa Khánh Bắc", "Hòa Khánh Nam", "Hòa Minh"],
    },
  };

  // Cập nhật quận/huyện khi tỉnh/thành phố thay đổi
  provinceSelect.addEventListener("change", function () {
    const selectedProvince = this.value;
    districtSelect.innerHTML = '<option value="">Chọn quận/huyện</option>';
    wardSelect.innerHTML = '<option value="">Chọn phường/xã</option>';

    if (selectedProvince && locationData[selectedProvince]) {
      Object.keys(locationData[selectedProvince]).forEach((district) => {
        const option = document.createElement("option");
        option.value = district;
        // Chuyển đổi tên quận/huyện sang tiếng Việt
        let districtName = district;
        if (district === "hoankiem") districtName = "Hoàn Kiếm";
        else if (district === "badinh") districtName = "Ba Đình";
        else if (district === "dongda") districtName = "Đống Đa";
        else if (district === "haibatrung") districtName = "Hai Bà Trưng";
        else if (district === "tayho") districtName = "Tây Hồ";
        else if (district === "quan1") districtName = "Quận 1";
        else if (district === "quan3") districtName = "Quận 3";
        else if (district === "quan5") districtName = "Quận 5";
        else if (district === "quan7") districtName = "Quận 7";
        else if (district === "quan10") districtName = "Quận 10";
        else if (district === "haichau") districtName = "Hải Châu";
        else if (district === "thanhkhe") districtName = "Thanh Khê";
        else if (district === "sontra") districtName = "Sơn Trà";
        else if (district === "nguhanhson") districtName = "Ngũ Hành Sơn";
        else if (district === "lienchieu") districtName = "Liên Chiểu";

        option.textContent = districtName;
        districtSelect.appendChild(option);
      });
    }
  });

  // Cập nhật phường/xã khi quận/huyện thay đổi
  districtSelect.addEventListener("change", function () {
    const selectedProvince = provinceSelect.value;
    const selectedDistrict = this.value;
    wardSelect.innerHTML = '<option value="">Chọn phường/xã</option>';

    if (selectedProvince && selectedDistrict && locationData[selectedProvince][selectedDistrict]) {
      locationData[selectedProvince][selectedDistrict].forEach((ward) => {
        const option = document.createElement("option");
        option.value = ward.toLowerCase().replace(/\s+/g, "");
        option.textContent = ward;
        wardSelect.appendChild(option);
      });
    }
  });
});

// Hàm thêm event listeners cho các nút tăng giảm số lượng
function addCartQuantityControls() {
  const cartItems = document.querySelectorAll(".cart-item");

  cartItems.forEach((item) => {
    const minusBtn = item.querySelector(".minus");
    const plusBtn = item.querySelector(".plus");
    const quantityInput = item.querySelector(".quantity-input");
    const itemPrice = item.querySelector(".item-price");

    // Nút giảm số lượng
    minusBtn.addEventListener("click", function () {
      let quantity = parseInt(quantityInput.value);
      if (quantity > 1) {
        quantity--;
        updateCartItem(item, quantity);
      }
    });

    // Nút tăng số lượng
    plusBtn.addEventListener("click", function () {
      let quantity = parseInt(quantityInput.value);
      quantity++;
      updateCartItem(item, quantity);
    });

    // Thay đổi số lượng trực tiếp
    quantityInput.addEventListener("change", function () {
      let quantity = parseInt(this.value);
      if (isNaN(quantity) || quantity < 1) {
        quantity = 1;
      }
      updateCartItem(item, quantity);
    });
  });
}

// Hàm cập nhật số lượng sản phẩm trong giỏ hàng
function updateCartItem(item, newQuantity) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const productId = item.querySelector(".item-sku").textContent.replace("SKU:", "");
  const quantityInput = item.querySelector(".quantity-input");

  // Cập nhật số lượng trong giao diện
  quantityInput.value = newQuantity;

  // Cập nhật số lượng trong localStorage
  const updatedCart = cart.map((cartItem) => {
    if (cartItem.id == productId) {
      cartItem.quantity = newQuantity;
    }
    return cartItem;
  });

  localStorage.setItem("cart", JSON.stringify(updatedCart));

  // Cập nhật lại tổng tiền
  let total = 0;
  updatedCart.forEach((item) => {
    total += item.price * item.quantity;
  });

  updateOrderSummary(total);
}
