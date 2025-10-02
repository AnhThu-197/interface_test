// Update cart badge
updateCartBadge();

// Get product ID from URL
function getProductIdFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("id");
}

// Mock review data for demonstration
const mockReviews = [
  {
    id: 1,
    userName: "Hồng Hạnh",
    userAvatar: "../images/avt1.webp",
    rating: 5,
    date: "22/05/2023",
    content: "Sản phẩm rất tốt, chất lượng vượt quá mong đợi. Đóng gói cẩn thận, giao hàng nhanh. Mình rất hài lòng và chắc chắn sẽ mua lại.",
    images: ["../images/fb1.webp", "../images/fb2.webp"],
    helpfulCount: 12
  },
  {
    id: 2,
    userName: "Minh Dũng",
    userAvatar: "../images/avt2.webp",
    rating: 4,
    date: "15/05/2023",
    content: "Sản phẩm khá tốt, đúng như mô tả. Tuy nhiên phần đóng gói có thể cải thiện thêm.",
    images: ["../images/fb3.webp", "../images/fb4.webp"],
    helpfulCount: 5
  },
  {
    id: 3,
    userName: "Hoàng Phúc",
    userAvatar: "../images/avt3.webp",
    rating: 3,
    date: "08/05/2023",
    content: "Sản phẩm ổn, phù hợp với giá tiền. Tuy nhiên thời gian giao hàng hơi lâu.",
    images: ["../images/fb5.webp", "../images/fb6.webp"],
    helpfulCount: 3
  },
  {
    id: 4,
    userName: "Phạm Thị Dung",
    userAvatar: "../images/avt4.webp",
    rating: 5,
    date: "01/05/2023",
    content: "Sản phẩm tuyệt vời, đúng như mô tả. Sẽ tiếp tục ủng hộ shop!",
    images: [],
    helpfulCount: 8
  },
  {
    id: 5,
    userName: "Võ Văn Việt",
    userAvatar: "../images/avt5.webp",
    rating: 2,
    date: "28/04/2023",
    content: "Sản phẩm không như kỳ vọng. Chất lượng không tương xứng với giá tiền.",
    images: ["../images/fb7.webp"],
    helpfulCount: 1
  }
];

// Load product data
async function loadProductDetails() {
  try {
    const productId = getProductIdFromUrl();
    if (!productId) {
      console.error("No product ID found in URL");
      return;
    }

    const products = await loadProducts();
    const discounts = await loadDiscounts();
    
    const product = getProductDetails(productId, products, discounts);
    
    if (product) {
      updateProductInfo(product);
    } else {
      console.error("Product not found");
    }
  } catch (error) {
    console.error("Error loading product details:", error);
  }
}

// Hàm tải dữ liệu sản phẩm từ JSON
async function loadProducts() {
  try {
    const response = await fetch("/data/products.json");
    const data = await response.json();
    return data.products;
  } catch (error) {
    console.error("Error loading products:", error);
    return [];
  }
}

// Hàm tải dữ liệu giảm giá từ JSON
async function loadDiscounts() {
  try {
    const response = await fetch("/data/discounts.json");
    const data = await response.json();
    return data.discounts;
  } catch (error) {
    console.error("Error loading discounts:", error);
    return [];
  }
}

// Hàm lấy thông tin giảm giá cho sản phẩm
function getProductDiscount(productCode, discounts) {
  if (!discounts || discounts.length === 0) return null;

  const now = new Date();
  return discounts.find(
    (discount) =>
      discount.maSanPham === productCode &&
      discount.trangThai === "active" &&
      new Date(discount.ngayBatDau) <= now &&
      new Date(discount.ngayKetThuc) >= now
  );
}

// Hàm lấy thông tin sản phẩm từ danh sách sản phẩm đã tải
function getProductDetails(productId, products, discounts) {
  if (!products || products.length === 0) return null;

  const product = products.find((p) => p.id == productId);

  if (!product) return null;

  const discount = getProductDiscount(product.maSanPham, discounts);

  let originalPrice = null;
  if (discount) {
    originalPrice = product.gia;
    product.gia = Math.round(product.gia * (1 - discount.phanTramGiam / 100));
  }

  // Tạo thông tin chi tiết sản phẩm
  return {
    id: product.id,
    name: product.tenSanPham,
    brand: product.tenThuongHieu,
    price: product.gia,
    originalPrice: originalPrice,
    image: `../${product.hinhAnh}`,
    rating: 4.5, // Mock rating
    reviewCount: mockReviews.length
  };
}

function updateProductInfo(product) {
  // Update product information in the page
  document.getElementById("product-name").textContent = product.name;
  document.getElementById("product-image").src = product.image;
  document.getElementById("rating-value").textContent = `${product.rating}/5`;
  document.getElementById("review-count").textContent = `(${product.reviewCount} đánh giá)`;
  
  // Update page title
  document.title = `Đánh giá - ${product.name}`;
}

function renderReviews(reviews, filter = "all") {
  const reviewsList = document.getElementById("reviews-list");
  reviewsList.innerHTML = "";

  // Apply filter
  let filteredReviews = reviews;
  if (filter !== "all") {
    if (filter === "has-images") {
      filteredReviews = reviews.filter(review => review.images && review.images.length > 0);
    } else {
      const starRating = parseInt(filter);
      filteredReviews = reviews.filter(review => review.rating === starRating);
    }
  }

  if (filteredReviews.length === 0) {
    reviewsList.innerHTML = '<div class="no-reviews">Không có đánh giá nào phù hợp với bộ lọc</div>';
    return;
  }

  filteredReviews.forEach(review => {
    const reviewItem = document.createElement("div");
    reviewItem.className = "review-item";

    // Create stars HTML
    let starsHtml = "";
    for (let i = 1; i <= 5; i++) {
      if (i <= review.rating) {
        starsHtml += '<i class="fas fa-star"></i>';
      } else {
        starsHtml += '<i class="far fa-star"></i>';
      }
    }

    // Create images HTML
    let imagesHtml = "";
    if (review.images && review.images.length > 0) {
      imagesHtml = '<div class="review-images">';
      review.images.forEach(image => {
        imagesHtml += `<img src="${image}" alt="Review image" />`;
      });
      imagesHtml += '</div>';
    }

    reviewItem.innerHTML = `
      <div class="reviewer-info">
        <img src="${review.userAvatar}" alt="Avatar" class="reviewer-avatar" />
        <div class="reviewer-details">
          <h4 class="reviewer-name">${review.userName}</h4>
          <div class="reviewer-rating">
            ${starsHtml}
          </div>
          <span class="review-date">${review.date}</span>
        </div>
      </div>
      <div class="review-content">
        <p>${review.content}</p>
        ${imagesHtml}
      </div>
    `;

    reviewsList.appendChild(reviewItem);
  });

  // Add event listeners for helpful buttons
  document.querySelectorAll('.helpful-btn').forEach(button => {
    button.addEventListener('click', function() {
      const reviewId = this.getAttribute('data-review-id');
      const reviewIndex = reviews.findIndex(r => r.id == reviewId);
      
      if (reviewIndex !== -1) {
        reviews[reviewIndex].helpfulCount++;
        this.innerHTML = `<i class="far fa-thumbs-up"></i> Hữu ích (${reviews[reviewIndex].helpfulCount})`;
      }
    });
  });
}

// Handle filter buttons
function setupFilterButtons() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  
  filterButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Remove active class from all buttons
      filterButtons.forEach(btn => btn.classList.remove('active'));
      
      // Add active class to clicked button
      this.classList.add('active');
      
      // Get filter value
      let filter;
      if (this.textContent === 'Tất cả') {
        filter = 'all';
      } else if (this.textContent === 'Có hình ảnh') {
        filter = 'has-images';
      } else {
        // Extract star rating (e.g. "5 Sao" -> 5)
        filter = parseInt(this.textContent);
      }
      
      // Apply filter
      renderReviews(mockReviews, filter);
    });
  });
}

// Handle sort options
function setupSortOptions() {
  const sortSelect = document.getElementById('sort-reviews');
  
  sortSelect.addEventListener('change', function() {
    const sortValue = this.value;
    let sortedReviews = [...mockReviews];
    
    switch (sortValue) {
      case 'newest':
        // Sort by date (newest first) - assuming date format DD/MM/YYYY
        sortedReviews.sort((a, b) => {
          const dateA = a.date.split('/').reverse().join('');
          const dateB = b.date.split('/').reverse().join('');
          return dateB.localeCompare(dateA);
        });
        break;
      case 'oldest':
        // Sort by date (oldest first)
        sortedReviews.sort((a, b) => {
          const dateA = a.date.split('/').reverse().join('');
          const dateB = b.date.split('/').reverse().join('');
          return dateA.localeCompare(dateB);
        });
        break;
      case 'highest':
        // Sort by rating (highest first)
        sortedReviews.sort((a, b) => b.rating - a.rating);
        break;
      case 'lowest':
        // Sort by rating (lowest first)
        sortedReviews.sort((a, b) => a.rating - b.rating);
        break;
    }
    
    // Get current active filter
    const activeFilter = document.querySelector('.filter-btn.active');
    let filter = 'all';
    
    if (activeFilter.textContent === 'Có hình ảnh') {
      filter = 'has-images';
    } else if (activeFilter.textContent !== 'Tất cả') {
      filter = parseInt(activeFilter.textContent);
    }
    
    renderReviews(sortedReviews, filter);
  });
}

// Setup pagination
function setupPagination() {
  const pageButtons = document.querySelectorAll('.page-btn');
  const prevBtn = document.querySelector('.prev-btn');
  const nextBtn = document.querySelector('.next-btn');
  
  pageButtons.forEach(button => {
    if (!button.classList.contains('prev-btn') && !button.classList.contains('next-btn')) {
      button.addEventListener('click', function() {
        // Remove active class from all buttons
        pageButtons.forEach(btn => {
          if (!btn.classList.contains('prev-btn') && !btn.classList.contains('next-btn')) {
            btn.classList.remove('active');
          }
        });
        
        // Add active class to clicked button
        this.classList.add('active');
        
        // In a real application, we would load the appropriate page of reviews here
        // For this demo, we're just displaying the same reviews
      });
    }
  });
  
  // Prev and Next buttons
  prevBtn.addEventListener('click', function() {
    const activePage = document.querySelector('.page-btn.active:not(.prev-btn):not(.next-btn)');
    const pageNumber = parseInt(activePage.textContent);
    
    if (pageNumber > 1) {
      const prevPage = document.querySelector(`.page-btn:not(.prev-btn):not(.next-btn):nth-of-type(${pageNumber})`);
      if (prevPage) {
        activePage.classList.remove('active');
        prevPage.classList.add('active');
        // Load previous page of reviews
      }
    }
  });
  
  nextBtn.addEventListener('click', function() {
    const activePage = document.querySelector('.page-btn.active:not(.prev-btn):not(.next-btn)');
    const pageNumber = parseInt(activePage.textContent);
    
    if (pageNumber < 10) { // Assuming max page is 10 as in the HTML
      const nextPage = document.querySelector(`.page-btn:not(.prev-btn):not(.next-btn):nth-of-type(${pageNumber + 2})`);
      if (nextPage) {
        activePage.classList.remove('active');
        nextPage.classList.add('active');
        // Load next page of reviews
      }
    }
  });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  loadProductDetails();
  renderReviews(mockReviews);
  setupFilterButtons();
  setupSortOptions();
  setupPagination();
  
  // Handle write review button
  const writeReviewBtn = document.querySelector('.write-review-btn');
  writeReviewBtn.addEventListener('click', function() {
    // Check if user is logged in
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      if (confirm('Bạn cần đăng nhập để viết đánh giá. Bạn có muốn đăng nhập ngay bây giờ?')) {
        window.location.href = 'Login.html';
      }
      return;
    }
    
    alert('Tính năng đang được phát triển');
  });
}); 