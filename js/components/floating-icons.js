// Floating icons functionality for chat and notifications

document.addEventListener('DOMContentLoaded', function() {
    // Chat icon click handler
    const chatIcon = document.querySelector('.chat-icon');
    if (chatIcon) {
        chatIcon.addEventListener('click', function() {
            // Redirect to chat page or open chat modal
            alert('Tính năng chat sẽ sớm được cập nhật!');
            // Alternatively, you could open a chat modal:
            // openChatModal();
        });
    }

    // Notification icon click handler
    const notificationIcon = document.querySelector('.notification-icon');
    if (notificationIcon) {
        notificationIcon.addEventListener('click', function() {
            // Redirect to notifications page or open notifications dropdown
            alert('Tính năng thông báo sẽ sớm được cập nhật!');
            // Alternatively, you could open a notifications dropdown:
            // toggleNotificationsDropdown();
        });
    }

    // Example function to open chat modal
    function openChatModal() {
        // Code to create and display a chat modal
        console.log('Chat modal opened');
    }

    // Example function to toggle notifications dropdown
    function toggleNotificationsDropdown() {
        // Code to create and toggle a notifications dropdown
        console.log('Notifications dropdown toggled');
    }
}); 