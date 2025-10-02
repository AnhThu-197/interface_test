// Hàm kiểm tra đăng nhập
function checkLogin() {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) {
    return false;
  }
  return true;
}

// Hàm đăng xuất
function logout() {
  localStorage.removeItem("user");
  window.location.href = "../htmls/Login.html";
}

// Hàm lấy thông tin người dùng hiện tại
function getCurrentUser() {
  return JSON.parse(localStorage.getItem("user"));
}

// Hàm kiểm tra vai trò người dùng
function getUserRole() {
  const user = getCurrentUser();
  if (!user) return null;
  return user.role || "user"; // Default to "user" if role is not specified
}

// Hàm kiểm tra người dùng có phải admin không
function isAdmin() {
  return getUserRole() === "admin";
}

// Hàm kiểm tra người dùng có phải nhân viên không
function isStaff() {
  return getUserRole() === "staff";
}

// Hàm kiểm tra và chuyển hướng nếu chưa đăng nhập
function requireLogin() {
  if (!checkLogin()) {
    window.location.href = "../htmls/Login.html";
  }
}

// Hàm yêu cầu quyền admin
function requireAdmin() {
  if (!isAdmin()) {
    window.location.href = "../htmls/Login.html";
    return false;
  }
  return true;
}

// Hàm yêu cầu quyền nhân viên hoặc cao hơn
function requireStaff() {
  const role = getUserRole();
  if (role !== "staff" && role !== "admin") {
    window.location.href = "../htmls/Login.html";
    return false;
  }
  return true;
}

// Hàm lấy đường dẫn trang cá nhân theo vai trò
function getProfileUrl() {
  const role = getUserRole();
  
  switch(role) {
    case "admin":
      return "/htmls/Admin/Dashboard.html";
    case "staff":
      return "/htmls/NhanVien/Dashboard.html";
    default:
      return "/htmls/ThongTinCaNhan.html";
  }
}

const Auth = {
  checkLogin,
  logout,
  getCurrentUser,
  requireLogin,
  getUserRole,
  isAdmin,
  isStaff,
  requireAdmin,
  requireStaff,
  getProfileUrl
};
