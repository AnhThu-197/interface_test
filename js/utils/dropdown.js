// Dùng cho dropdown trên trang hàng khi chọn lọc
function toggleDropdown(dropdownId) {
    const dropdownContent = document.getElementById(dropdownId);
    const dropdownHeader = dropdownContent.closest(".dropdown").querySelector(".dropdown-header");
  
    // Toggle dropdown hiện tại
    dropdownContent.classList.toggle("active");
    dropdownHeader.classList.toggle("active");
  
    // Đóng dropdown khác
    document.querySelectorAll(".dropdown-content").forEach((dropdown) => {
      if (dropdown.id !== dropdownId) {
        dropdown.classList.remove("active");
        dropdown.closest(".dropdown").querySelector(".dropdown-header").classList.remove("active");
      }
    });
  }
  
  // Đóng dropdown khi click ngoài
  document.addEventListener("click", function (event) {
    if (!event.target.closest(".dropdown")) {
      document.querySelectorAll(".dropdown-content").forEach((dropdown) => {
        dropdown.classList.remove("active");
        dropdown.closest(".dropdown").querySelector(".dropdown-header").classList.remove("active");
      });
    }
  });
  
  // Khởi tạo chức năng "Xem thêm"
  document.addEventListener("DOMContentLoaded", function () {
    const moreLinks = document.querySelectorAll(".more-link");
  
    moreLinks.forEach((link) => {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        const dropdown = this.closest(".dropdown-content");
        dropdown.classList.toggle("show-all");
        this.textContent = dropdown.classList.contains("show-all") ? "Thu gọn" : "Xem thêm";
      });
    });
  });