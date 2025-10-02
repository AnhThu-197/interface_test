function showNotification(message) {
  const oldNotification = document.querySelector(".cart-notification");
  if (oldNotification) {
    oldNotification.remove();
  }

  const notification = document.createElement("div");
  notification.className = "cart-notification";
  notification.style.position = "fixed";
  notification.style.top = "20px";
  notification.style.right = "20px";
  notification.style.backgroundColor = "#4caf50";
  notification.style.color = "white";
  notification.style.padding = "15px 25px";
  notification.style.borderRadius = "8px";
  notification.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.15)";
  notification.style.zIndex = "9999";
  notification.style.display = "flex";
  notification.style.alignItems = "center";
  notification.style.gap = "10px";
  notification.style.maxWidth = "400px";
  notification.innerHTML = `
    <div class="notification-content" style="display: flex; align-items: center; gap: 10px;">
      <i class="fas fa-check-circle" style="font-size: 20px;"></i>
      <span>${message}</span>
    </div>
  `;

  document.body.appendChild(notification);
  notification.style.animation = "slideIn 0.3s ease-out";

  setTimeout(() => {
    notification.style.animation = "slideOut 0.3s ease-out";
    setTimeout(() => notification.remove(), 200);
  }, 2000);
}
function checkLogin() {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) {
    return false;
  }
  return true;
}
