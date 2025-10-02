// Hàm để định dạng số tiền
function formatCurrency(amount) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0
  }).format(amount).replace("₫", "") + "đ";
}

// Hàm để định dạng ngày tháng
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN");
}

// Hàm để lấy trạng thái đơn hàng
function getOrderStatus(status) {
  const statusMap = {
    "Đang xác nhận": "Đang xác nhận",
    "Đang giao": "Đang giao",
    "Đã giao": "Đã giao",
    "Đã hủy": "Đã hủy",
  };
  return statusMap[status] || status;
}

// Hàm để lấy icon cho trạng thái
function getStatusIcon(status) {
  const iconMap = {
    "Đang xác nhận": "fa-clock",
    "Đang giao": "fa-truck",
    "Đã giao": "fa-check-circle",
    "Đã hủy": "fa-times-circle",
  };
  return iconMap[status] || "fa-info-circle";
}

// Hàm để tạo HTML cho một sản phẩm
function createProductHTML(product) {
  return `
    <div class="product-item">
      <img src="${product.hinhAnh}" alt="${product.tenSanPham}" class="product-image">
      <div class="product-details">
        <h3 class="product-name">${product.tenSanPham}</h3>
        <div class="product-info">
          <span class="product-price">${formatCurrency(product.donGia)}</span>
          <span class="product-quantity">x${product.soLuongDat}</span>
        </div>
      </div>
    </div>
  `;
}

// Hàm để tạo HTML cho một đơn hàng
function createOrderHTML(order) {
  const productsHTML = order.products.map(createProductHTML).join("");
  const status = getOrderStatus(order.trangThaiDH);
  const statusClass = status.replace(/\s+/g, "-");
  const statusIcon = getStatusIcon(status);

  return `
    <div class="order-item" data-status="${statusClass}">
      <div class="order-header">
        <div class="order-info">
          <span class="order-id">Mã đơn: #${order.maDonHang}</span>
          <span class="order-date">Ngày đặt: ${formatDate(order.ngayTaoHD)}</span>
        </div>
        <div class="order-status ${statusClass}">
          <i class="fas ${statusIcon}"></i>
          ${status}
        </div>
      </div>
      
      <div class="order-products">
        ${productsHTML}
      </div>
      
      <div class="order-footer">
        <div class="total-amount">
          Tổng tiền: <span>${formatCurrency(order.tongTien)}</span>
        </div>
        <div class="order-actions">
          <button class="btn-detail" onclick="showOrderDetail('${order.maDonHang}')">
            <i class="fas fa-eye"></i>
            Chi tiết
          </button>
          ${
            order.trangThaiDH === "Đang xác nhận" || order.trangThaiDH === "Đang giao"
              ? `<button class="btn-cancel" onclick="cancelOrder('${order.maDonHang}')">
              <i class="fas fa-times"></i>
              Hủy đơn
            </button>`
              : ""
          }
        </div>
      </div>
    </div>
  `;
}

// Hàm để hiển thị chi tiết đơn hàng
function showOrderDetail(orderId) {
  // Chuyển hướng đến trang chi tiết đơn hàng
  window.location.href = `ChiTietDonHang.html?id=${orderId}`;
}

// Hàm để hủy đơn hàng
function cancelOrder(orderId) {
  if (confirm("Bạn có chắc chắn muốn hủy đơn hàng này?")) {
    // TODO: Implement cancel order API call
    console.log("Cancelling order:", orderId);
    
    // Giả lập API thành công
    // Trong trường hợp thực tế, đây sẽ là một API call
    setTimeout(() => {
      alert(`Đã hủy đơn hàng #${orderId} thành công`);
      // Tải lại trang để cập nhật trạng thái
      window.location.reload();
    }, 500);
  }
}

// Hàm để cập nhật số lượng đơn hàng trong badge
function updateOrderCountBadges(orders) {
  // Đếm số lượng đơn hàng theo trạng thái
  const counts = {
    all: orders.length,
    "Đang-xác-nhận": 0,
    "Đang-giao": 0,
    "Đã-giao": 0,
    "Đã-hủy": 0,
  };

  // Đếm số lượng đơn hàng cho mỗi trạng thái
  orders.forEach((order) => {
    const status = getOrderStatus(order.trangThaiDH).replace(/\s+/g, "-");
    counts[status] = (counts[status] || 0) + 1;
  });

  // Cập nhật badges
  const tabButtons = document.querySelectorAll(".tab-btn");
  tabButtons.forEach((button) => {
    const status = button.dataset.status;
    const badge = button.querySelector(".tab-badge");
    if (badge) {
      badge.textContent = counts[status] || 0;
    }
  });
}

// Hàm để lọc đơn hàng theo trạng thái
function filterOrders(status) {
  const orderItems = document.querySelectorAll(".order-item");
  const emptyState = document.querySelector(".empty-state");
  let visibleOrders = 0;

  orderItems.forEach((item) => {
    if (status === "all" || item.dataset.status === status) {
      item.style.display = "block";
      visibleOrders++;
    } else {
      item.style.display = "none";
    }
  });

  // Hiển thị trạng thái trống nếu không có đơn hàng nào trong tab
  if (emptyState) {
    if (visibleOrders === 0) {
      emptyState.style.display = "block";
    } else {
      emptyState.style.display = "none";
    }
  }
}

// Hàm để tải danh sách đơn hàng
async function loadOrders() {
  try {
    // TODO: Replace with actual API endpoint
    // Trong môi trường demo, sử dụng dữ liệu mẫu
    // const response = await fetch('/api/orders');
    // const orders = await response.json();

    // Demo data
    const orders = [
      {
        maDonHang: "DH001",
        ngayTaoHD: "2024-01-01",
        trangThaiDH: "Đang giao",
        tongTien: 350000,
        products: [
          {
            maSanPham: "SP01",
            tenSanPham: "Kem Chống Nắng Nâng Tông Da CNP Laboratory",
            hinhAnh: "../images/sp1.1.webp",
            donGia: 350000,
            soLuongDat: 1,
          },
        ],
      },
      {
        maDonHang: "DH002",
        ngayTaoHD: "2024-01-05",
        trangThaiDH: "Đang xác nhận",
        tongTien: 980000,
        products: [
          {
            maSanPham: "SP03",
            tenSanPham: "Nước Thần Keo Ong Cấp Ẩm, Phục Hồi Da CNP Propolis",
            hinhAnh: "../images/sp3.1.webp",
            donGia: 420000,
            soLuongDat: 1,
          },
          {
            maSanPham: "SP02",
            tenSanPham: "Sữa Rửa Mặt Chăm Sóc Da Mụn Cosrx",
            hinhAnh: "../images/sp2.1.webp",
            donGia: 280000,
            soLuongDat: 2,
          },
        ],
      },
      {
        maDonHang: "DH003",
        ngayTaoHD: "2023-12-30",
        trangThaiDH: "Đã giao",
        tongTien: 180000,
        products: [
          {
            maSanPham: "SP04",
            tenSanPham: "Xịt Khoáng Cấp Ẩm, Làm Dịu Da Evian Brumisateur",
            hinhAnh: "../images/sp4.1.webp",
            donGia: 180000,
            soLuongDat: 1,
          },
        ],
      },
    ];

    // Cập nhật nội dung
    const orderList = document.querySelector(".order-list");

    // Nếu có dữ liệu API, bỏ comment dòng dưới
    // orderList.innerHTML = orders.map(createOrderHTML).join('') + orderList.querySelector('.empty-state').outerHTML;

    // Cập nhật badges
    updateOrderCountBadges(orders);

    // Lọc theo tab active
    const activeTab = document.querySelector(".tab-btn.active");
    if (activeTab) {
      filterOrders(activeTab.dataset.status);
    }
  } catch (error) {
    console.error("Error loading orders:", error);
    alert("Có lỗi xảy ra khi tải danh sách đơn hàng");
  }
}

// Các event listeners
document.addEventListener("DOMContentLoaded", () => {
  // Khởi tạo tab active
  const tabButtons = document.querySelectorAll(".tab-btn");
  
  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // Cập nhật trạng thái active
      tabButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");
      
      // Lọc đơn hàng theo tab
      filterOrders(button.dataset.status);
    });
  });
  
  // Tải danh sách đơn hàng
  loadOrders();
});
