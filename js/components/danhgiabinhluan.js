// JavaScript for DanhGiaBinhLuan.html (Review Form)

document.addEventListener('DOMContentLoaded', function() {
  initializeRatingSystem();
  setupPhotoUpload();
  setupFormSubmission();
});

// Initialize the rating system functionality
function initializeRatingSystem() {
  // Main product quality rating
  const mainRatingInputs = document.querySelectorAll('.star-rating input');
  const ratingTextElement = document.getElementById('rating-text');
  const ratingTexts = ['Rất không hài lòng', 'Không hài lòng', 'Bình thường', 'Hài lòng', 'Rất hài lòng'];

  // Update rating text when a star is selected
  mainRatingInputs.forEach((input, index) => {
    input.addEventListener('change', function() {
      const rating = 5 - index; // Reverse index due to flex-direction: row-reverse
      ratingTextElement.textContent = ratingTexts[rating - 1];
    });
  });

  // Set initial state if there's a pre-selected rating
  const preSelectedRating = document.querySelector('.star-rating input:checked');
  if (preSelectedRating) {
    const rating = parseInt(preSelectedRating.value);
    ratingTextElement.textContent = ratingTexts[rating - 1];
  }

  // Fix for specific sub-ratings to ensure they work correctly
  const subRatingGroups = ['price_rating', 'effect_rating', 'packaging_rating'];
  
  subRatingGroups.forEach(groupName => {
    const inputs = document.querySelectorAll(`input[name="${groupName}"]`);
    inputs.forEach(input => {
      input.addEventListener('change', function() {
        // This ensures the stars display correctly when selected
        const currentValue = this.value;
        inputs.forEach(inp => {
          if (inp.value <= currentValue) {
            inp.nextElementSibling.style.color = '#f8ce0b';
          } else {
            inp.nextElementSibling.style.color = '#ddd';
          }
        });
      });
    });
  });
}

// Setup photo upload functionality
function setupPhotoUpload() {
  const fileInput = document.getElementById('review-photos-input');
  const uploadedPhotosContainer = document.getElementById('uploaded-photos');
  const maxPhotos = 5;
  let uploadedPhotosCount = 0;

  fileInput.addEventListener('change', function(e) {
    const files = e.target.files;
    
    // Check if maximum photos reached
    if (uploadedPhotosCount + files.length > maxPhotos) {
      alert(`Bạn chỉ có thể tải lên tối đa ${maxPhotos} hình ảnh.`);
      return;
    }

    // Process and display selected images
    for (let i = 0; i < files.length && uploadedPhotosCount < maxPhotos; i++) {
      const file = files[i];
      
      // Validate file type and size
      if (!file.type.startsWith('image/')) {
        alert('Chỉ chấp nhận file hình ảnh.');
        continue;
      }
      
      if (file.size > 5 * 1024 * 1024) { // 5MB
        alert('Kích thước file không được vượt quá 5MB.');
        continue;
      }

      // Create image thumbnail
      const imgWrapper = document.createElement('div');
      imgWrapper.className = 'uploaded-photo-wrapper';
      
      const img = document.createElement('img');
      img.className = 'uploaded-photo';
      
      const reader = new FileReader();
      reader.onload = function(e) {
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
      
      // Add remove button
      const removeBtn = document.createElement('button');
      removeBtn.className = 'remove-photo-btn';
      removeBtn.innerHTML = '<i class="fas fa-times"></i>';
      removeBtn.addEventListener('click', function() {
        uploadedPhotosContainer.removeChild(imgWrapper);
        uploadedPhotosCount--;
      });
      
      imgWrapper.appendChild(img);
      imgWrapper.appendChild(removeBtn);
      uploadedPhotosContainer.appendChild(imgWrapper);
      
      uploadedPhotosCount++;
    }
  });
}

// Setup form submission
function setupFormSubmission() {
  const form = document.querySelector('.review-form');
  const modal = document.getElementById('review-success-modal');
  const closeModalBtn = document.querySelector('.close-modal-btn');
  
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Check required fields
    const mainRating = document.querySelector('input[name="rating"]:checked');
    const commentText = document.getElementById('review-comment-text').value.trim();
    const termsAgreed = document.querySelector('input[name="terms_agreed"]').checked;
    
    if (!mainRating || !commentText || !termsAgreed) {
      alert('Vui lòng điền đầy đủ các trường bắt buộc.');
      return;
    }
    
    // In a real application, you would send the form data to the server here
    // For demo purposes, we'll just show the success modal
    modal.style.display = 'flex';
  });
  
  // Close modal functionality
  closeModalBtn.addEventListener('click', function() {
    modal.style.display = 'none';
  });
  
  // Close modal when clicking outside
  window.addEventListener('click', function(e) {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });
  
  // Cancel button
  const cancelBtn = document.querySelector('.cancel-btn');
  cancelBtn.addEventListener('click', function() {
    if (confirm('Bạn có chắc muốn hủy đánh giá này? Mọi thông tin đã nhập sẽ bị mất.')) {
      window.history.back();
    }
  });
}

// Additional styling to ensure stars display correctly
function applyAdditionalStyling() {
  // Custom styling to fix any potential layout issues
  const starLabels = document.querySelectorAll('.star-rating label, .sub-rating label');
  
  starLabels.forEach(label => {
    label.style.margin = '0';
    label.style.lineHeight = '1';
    label.style.display = 'flex';
    label.style.alignItems = 'center';
    label.style.justifyContent = 'center';
  });
}

// Run initial setup
applyAdditionalStyling(); 