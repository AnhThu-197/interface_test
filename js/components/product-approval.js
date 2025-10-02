// Product Approval Component
document.addEventListener('DOMContentLoaded', function() {
  // Initialize components
  initializeFilters();
  initializeTable();
  initializeModal();
  initializePagination();
});

// Filter functionality
function initializeFilters() {
  const dateFilter = document.querySelector('.apply-filter');
  const statusFilter = document.getElementById('status-filter');
  const employeeFilter = document.getElementById('employee-filter');
  const searchInput = document.getElementById('search-product');
  const searchBtn = document.querySelector('.search-btn');

  // Apply date filter
  dateFilter?.addEventListener('click', function() {
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;
    filterProducts({ startDate, endDate });
  });

  // Apply status filter
  statusFilter?.addEventListener('change', function() {
    filterProducts({ status: this.value });
  });

  // Apply employee filter
  employeeFilter?.addEventListener('change', function() {
    filterProducts({ employee: this.value });
  });

  // Apply search
  searchBtn?.addEventListener('click', function() {
    const searchTerm = searchInput.value.trim();
    filterProducts({ search: searchTerm });
  });

  // Search on enter key
  searchInput?.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      const searchTerm = this.value.trim();
      filterProducts({ search: searchTerm });
    }
  });
}

// Table functionality
function initializeTable() {
  const selectAll = document.getElementById('select-all');
  const productCheckboxes = document.querySelectorAll('.product-checkbox');
  const actionButtons = document.querySelectorAll('.action-btn');

  // Select all products
  selectAll?.addEventListener('change', function() {
    productCheckboxes.forEach(checkbox => {
      checkbox.checked = this.checked;
    });
  });

  // Handle action buttons
  actionButtons.forEach(button => {
    button.addEventListener('click', function() {
      const action = this.classList[1].split('-')[0]; // view, approve, reject, edit, restore
      const productId = this.closest('tr').querySelector('td:nth-child(2)').textContent;
      
      switch(action) {
        case 'view':
          showProductDetails(productId);
          break;
        case 'approve':
          approveProduct(productId);
          break;
        case 'reject':
          rejectProduct(productId);
          break;
        case 'edit':
          editProduct(productId);
          break;
        case 'restore':
          restoreProduct(productId);
          break;
      }
    });
  });
}

// Modal functionality
function initializeModal() {
  const modal = document.getElementById('productDetailModal');
  const closeBtn = modal?.querySelector('.admin-modal-close');
  const closeModalBtn = modal?.querySelector('.modal-close-btn');
  const thumbnailImages = modal?.querySelectorAll('.thumbnail-images img');
  const mainImage = modal?.querySelector('.main-image img');
  const modalApproveBtn = modal?.querySelector('#modal-approve-btn');
  const modalRejectBtn = modal?.querySelector('#modal-reject-btn');
  const approvalPrice = modal?.querySelector('#approval-price');
  const approvalNote = modal?.querySelector('#approval-note');

  // Close modal
  closeBtn?.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  closeModalBtn?.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  // Close modal when clicking outside
  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });

  // Thumbnail image click
  thumbnailImages?.forEach(thumb => {
    thumb.addEventListener('click', function() {
      mainImage.src = this.src;
      thumbnailImages.forEach(t => t.classList.remove('active'));
      this.classList.add('active');
    });
  });

  // Format price input
  approvalPrice?.addEventListener('input', function(e) {
    let value = e.target.value.replace(/[^\d]/g, '');
    if (value) {
      value = parseInt(value).toLocaleString('vi-VN');
    }
    e.target.value = value;
  });

  // Handle modal approve button
  modalApproveBtn?.addEventListener('click', function() {
    const productId = modal.querySelector('.info-item span').textContent;
    const price = approvalPrice.value.replace(/[^\d]/g, '');
    const note = approvalNote.value.trim();

    if (!price) {
      alert('Vui lòng nhập giá bán đề xuất');
      return;
    }

    if (confirm('Bạn có chắc chắn muốn duyệt sản phẩm này?')) {
      approveProduct(productId, { price, note });
      modal.style.display = 'none';
    }
  });

  // Handle modal reject button
  modalRejectBtn?.addEventListener('click', function() {
    const productId = modal.querySelector('.info-item span').textContent;
    const note = approvalNote.value.trim();

    if (confirm('Bạn có chắc chắn muốn từ chối sản phẩm này?')) {
      rejectProduct(productId, { note });
      modal.style.display = 'none';
    }
  });
}

// Pagination functionality
function initializePagination() {
  const itemsPerPageSelect = document.getElementById('items-per-page-select');
  const paginationButtons = document.querySelectorAll('.pagination-btn');

  // Change items per page
  itemsPerPageSelect?.addEventListener('change', function() {
    const itemsPerPage = parseInt(this.value);
    updatePagination(itemsPerPage);
  });

  // Pagination button click
  paginationButtons.forEach(button => {
    button.addEventListener('click', function() {
      if (this.classList.contains('prev')) {
        changePage('prev');
      } else if (this.classList.contains('next')) {
        changePage('next');
      } else if (this.classList.contains('page')) {
        const page = parseInt(this.textContent);
        changePage(page);
      }
    });
  });
}

// Helper functions
function filterProducts(filters) {
  // TODO: Implement API call to filter products
  console.log('Filtering products with:', filters);
}

function showProductDetails(productId) {
  // TODO: Implement API call to get product details
  console.log('Showing details for product:', productId);
  
  const modal = document.getElementById('productDetailModal');
  if (modal) {
    modal.style.display = 'block';
  }
}

function approveProduct(productId, data = {}) {
  // TODO: Implement API call to approve product
  console.log('Approving product:', productId, data);
  
  // Update UI
  const row = document.querySelector(`tr td:nth-child(2):contains('${productId}')`).closest('tr');
  const statusCell = row.querySelector('td:nth-child(7)');
  statusCell.innerHTML = '<span class="status-badge status-approved">Đã duyệt</span>';
  
  // Update action buttons
  const actionCell = row.querySelector('td:nth-child(8)');
  actionCell.innerHTML = `
    <div class="action-buttons">
      <button class="action-btn view-btn" title="Xem chi tiết"><i class="fas fa-eye"></i></button>
      <button class="action-btn edit-btn" title="Sửa"><i class="fas fa-edit"></i></button>
    </div>
  `;
}

function rejectProduct(productId, data = {}) {
  // TODO: Implement API call to reject product
  console.log('Rejecting product:', productId, data);
  
  // Update UI
  const row = document.querySelector(`tr td:nth-child(2):contains('${productId}')`).closest('tr');
  const statusCell = row.querySelector('td:nth-child(7)');
  statusCell.innerHTML = '<span class="status-badge status-rejected">Đã từ chối</span>';
  
  // Update action buttons
  const actionCell = row.querySelector('td:nth-child(8)');
  actionCell.innerHTML = `
    <div class="action-buttons">
      <button class="action-btn view-btn" title="Xem chi tiết"><i class="fas fa-eye"></i></button>
      <button class="action-btn restore-btn" title="Khôi phục"><i class="fas fa-redo"></i></button>
    </div>
  `;
}

function editProduct(productId) {
  // TODO: Implement edit functionality
  console.log('Editing product:', productId);
}

function restoreProduct(productId) {
  // TODO: Implement API call to restore product
  console.log('Restoring product:', productId);
  
  // Show confirmation dialog
  if (confirm('Bạn có chắc chắn muốn khôi phục sản phẩm này?')) {
    // Update UI
    const row = document.querySelector(`tr td:nth-child(2):contains('${productId}')`).closest('tr');
    const statusCell = row.querySelector('td:nth-child(7)');
    statusCell.innerHTML = '<span class="status-badge status-pending">Chờ duyệt</span>';
    
    // Update action buttons
    const actionCell = row.querySelector('td:nth-child(8)');
    actionCell.innerHTML = `
      <div class="action-buttons">
        <button class="action-btn view-btn" title="Xem chi tiết"><i class="fas fa-eye"></i></button>
        <button class="action-btn approve-btn" title="Duyệt"><i class="fas fa-check"></i></button>
        <button class="action-btn reject-btn" title="Từ chối"><i class="fas fa-times"></i></button>
      </div>
    `;
  }
}

function updatePagination(itemsPerPage) {
  // TODO: Implement pagination update
  console.log('Updating pagination with items per page:', itemsPerPage);
}

function changePage(page) {
  // TODO: Implement page change
  console.log('Changing to page:', page);
}

// Utility function to check if element contains text
Element.prototype.contains = function(text) {
  return this.textContent.includes(text);
}; 