
// Sample user data with roles
const sampleUsers = {
  users: [
    {
      id: 1,
      username: "user1",
      email: "thunguyen@gmail.com",
      password: "123",
      fullName: "Khách hàng",
      phone: "0123456789",
      role: "user" // Regular user role
    },
    {
      id: 2,
      username: "staff1",
      email: "staff@gmail.com",
      password: "123",
      fullName: "Nhân viên",
      phone: "0123456789",
      role: "staff" // Staff role
    },
    {
      id: 3,
      username: "admin1",
      email: "admin@gmail.com",
      password: "123",
      fullName: "Admin",
      phone: "0123456780",
      role: "admin" // Admin role
    },
  ],
};

// DOM Elements
const elements = {
  signUpButton: document.getElementById("signUp"),
  signInButton: document.getElementById("signIn"),
  container: document.getElementById("container"),
  signinForm: document.getElementById("signin-form"),
  signupForm: document.getElementById("signup-form"),
};

// Utility Functions
const showLoadingMessage = (form, message) => {
  const loadingMsg = document.createElement("div");
  loadingMsg.textContent = message;
  loadingMsg.style.color = "black";
  loadingMsg.style.marginTop = "10px";
  form.appendChild(loadingMsg);
  return loadingMsg;
};

const removeLoadingMessage = (form, loadingMsg) => {
  if (loadingMsg && loadingMsg.parentNode === form) {
    form.removeChild(loadingMsg);
  }
};

const validatePhoneNumber = (phoneNumber) => {
  if (phoneNumber.length < 10 || phoneNumber.length > 11) {
    throw new Error("Số điện thoại phải có 10 hoặc 11 chữ số!");
  }
  if (!/^\d+$/.test(phoneNumber)) {
    throw new Error("Số điện thoại chỉ được chứa chữ số!");
  }
  return true;
};

// Authentication Functions
const handleLogin = async (email, password) => {
  const user = sampleUsers.users.find((u) => u.email === email && u.password === password);
  if (!user) {
    throw new Error("Email hoặc mật khẩu không đúng!");
  }
  return user;
};

const handleRegister = async (userData) => {
  const response = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// Event Handlers
const handleSignInSubmit = async (e) => {
  e.preventDefault();
  const form = e.target;
  const email = form.querySelector('input[name="email"]').value;
  const password = form.querySelector('input[name="password"]').value;

  const loadingMsg = showLoadingMessage(form, "Đang xử lý đăng nhập...");

  try {
    const user = await handleLogin(email, password);
    localStorage.setItem("user", JSON.stringify(user));
    alert("Đăng nhập thành công!");
    window.location.href = "/trangchu.html";
  } catch (error) {
    alert(error.message);
  } finally {
    removeLoadingMessage(form, loadingMsg);
  }
};

const handleSignUpSubmit = async (e) => {
  e.preventDefault();
  const form = e.target;
  const userData = {
    taiKhoan: form.querySelector('input[name="name"]').value,
    email: form.querySelector('input[name="email"]').value,
    matKhau: form.querySelector('input[name="password"]').value,
    soDienThoai: form.querySelector('input[name="sdt"]').value,
    role: "user" // By default, new registrations are regular users
  };

  try {
    validatePhoneNumber(userData.soDienThoai);
    const loadingMsg = showLoadingMessage(form, "Đang xử lý đăng ký...");

    const response = await handleRegister(userData);
    removeLoadingMessage(form, loadingMsg);

    if (response.success) {
      alert(response.message);
      elements.container.classList.remove("right-panel-active");
      form.reset();
    } else {
      throw new Error(response.message || "Đăng ký thất bại!");
    }
  } catch (error) {
    alert(error.message);
  }
};

// Initialize Event Listeners
const initializeEventListeners = () => {
  elements.signUpButton.addEventListener("click", () => {
    elements.container.classList.add("right-panel-active");
  });

  elements.signInButton.addEventListener("click", () => {
    elements.container.classList.remove("right-panel-active");
  });

  elements.signinForm.addEventListener("submit", handleSignInSubmit);
  elements.signupForm.addEventListener("submit", handleSignUpSubmit);
};

// Initialize the application
document.addEventListener("DOMContentLoaded", initializeEventListeners);
