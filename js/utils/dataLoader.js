document.addEventListener("DOMContentLoaded", async function () {
  console.log("Initializing product data");

  await initializeProducts();

  if (typeof loadHomepage === "function") {
    await loadHomepage();
  }

  setupEventListeners();
});

function setupEventListeners() {
  // View more button for Flash Sale
  const viewMoreBtn = document.querySelector(".view-more-btn");
  if (viewMoreBtn) {
    viewMoreBtn.addEventListener("click", function () {
      const hiddenProducts = document.querySelectorAll(".product-card.hidden");
      hiddenProducts.forEach((product) => {
        product.classList.remove("hidden");
      });
      viewMoreBtn.style.display = "none";
    });
  }

  // Category filter (if on product listing page)
  const categoryFilters = document.querySelectorAll(".dropdown-content .checkbox");
  if (categoryFilters.length > 0) {
    categoryFilters.forEach((filter) => {
      filter.addEventListener("change", function () {
        const categoryId = this.value;
        const productGrid = document.querySelector(".product-grid");

        if (productGrid) {
          const filteredProducts = categoryId
            ? filterProductsByCategory(categoryId)
            : getAllProductsWithDiscount();

          renderProductGrid("product-grid", filteredProducts);
        }
      });
    });
  }
}
