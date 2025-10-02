let appData = null;

function formatPrice(price) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
    .format(price)
    .replace("₫", "đ");
}

// Load homepage data
async function loadHomepage() {
  try {
    const homepageResponse = await fetch("/data/homepage.json");
    if (!homepageResponse.ok) {
      throw new Error("Không tải được dữ liệu trang chủ");
    }

    // Store homepage data
    appData = await homepageResponse.json();
    window.appData = appData;
    checkLoginStatus();
    updateCartBadge();
    renderAllContent();
  } catch (error) {
    console.error("Lỗi khi tải dữ liệu trang chủ:", error);
  }
}

// Render all content sections
function renderAllContent() {
  renderBannerImages();
  renderBestSellers();
  renderFlashSaleProducts();
  renderTrendingProducts();
  renderAdvertisements();
  renderBrandAds();
  renderPremiumBrands();
  renderMagazineArticles();
  setupCarousels();
  setupCountdown();
}

// Render banner images
function renderBannerImages() {
  const container = document.querySelector(".thumnails");
  if (!container) return;

  const fragment = document.createDocumentFragment();

  appData.bannerImages.forEach((image) => {
    const card = document.createElement("div");
    card.className = "card";

    const img = document.createElement("img");
    img.className = "card-img";
    img.src = image.imageUrl;
    img.alt = `Banner ${image.id}`;

    card.appendChild(img);
    fragment.appendChild(card);
  });

  container.innerHTML = "";
  container.appendChild(fragment);
}

// Render best seller products
function renderBestSellers() {
  const container = document.querySelector(".Best_seller-wrapper");
  if (!container) return;

  fetch("data/products.json")
    .then((res) => res.json())
    .then((data) => {
      // Sort by sales and take top 7
      const bestSellerProducts = data.products
        .sort((a, b) => b.soLuongBan - a.soLuongBan)
        .slice(0, 7);

      if (bestSellerProducts.length === 0) {
        container.innerHTML = "<p>No best seller products available</p>";
        return;
      }

      const fragment = document.createDocumentFragment();

      bestSellerProducts.forEach((product) => {
        const item = document.createElement("div");
        item.className = "Best_seller-item";
        item.setAttribute("data-product-id", product.id);

        item.innerHTML = `
          <div class="image-container">
            <img src="${product.hinhAnh}" alt="${product.tenSanPham}">
          </div>
          <h3>${product.tenThuongHieu}</h3>
          <p>${product.tenSanPham}</p>
          <div class="price">
            ${formatPrice(product.gia)}
          </div>
          <button class="add-to-cart-btn" onclick="event.stopPropagation(); addToCart(${
            product.id
          }, 1)">
            Thêm vào giỏ
          </button>
        `;

        item.addEventListener("click", () => {
          window.location.href = `htmls/ChiTietSanPham.html?id=${product.id}`;
        });

        fragment.appendChild(item);
      });

      container.innerHTML = "";
      container.appendChild(fragment);
    })
    .catch((error) => {
      console.error("Error loading best seller products:", error);
      container.innerHTML = "<p>Could not load products</p>";
    });
}

// Helper function for image paths
function getImagePath(imagePath) {
  if (imagePath.startsWith("../") || imagePath.startsWith("/") || imagePath.startsWith("http")) {
    return imagePath;
  }

  if (
    window.location.pathname.includes("trangchu.html") ||
    window.location.pathname.endsWith("/") ||
    window.location.pathname.endsWith("26-NguyenHoangAnhThu-223TKW02-CK (7)")
  ) {
    return imagePath;
  }

  return `../${imagePath}`;
}

// Add to cart functionality
function addToCart(productId, quantity) {
  // Check login status
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) {
    if (
      confirm(
        "Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng. Bạn có muốn đăng nhập ngay bây giờ?"
      )
    ) {
      window.location.href = "htmls/Login.html";
    }
    return;
  }

  // Fetch product and discount data
  Promise.all([
    fetch("/data/products.json").then((res) => res.json()),
    fetch("/data/discounts.json").then((res) => res.json()),
  ])
    .then(([productsData, discountsData]) => {
      const product = productsData.products.find((p) => p.id == productId);
      if (!product) {
        throw new Error("Product not found");
      }

      const now = new Date();

      // Find active discount
      const discount = discountsData.discounts.find(
        (d) =>
          d.maSanPham === product.maSanPham &&
          d.trangThai === "active" &&
          new Date(d.ngayBatDau) <= now &&
          new Date(d.ngayKetThuc) >= now
      );

      // Calculate final price
      const finalPrice = discount
        ? Math.round(product.gia * (1 - discount.phanTramGiam / 100))
        : product.gia;

      // Update cart
      let cart = JSON.parse(localStorage.getItem("cart")) || [];
      const existingProduct = cart.find((item) => item.id == productId);

      if (existingProduct) {
        existingProduct.quantity += quantity;
        showNotification(`Đã cập nhật số lượng sản phẩm ${product.tenSanPham} trong giỏ hàng!`);
      } else {
        cart.push({
          id: product.id,
          name: product.tenSanPham,
          price: finalPrice,
          image: product.hinhAnh,
          quantity: quantity,
          brand: product.tenThuongHieu,
        });
        showNotification(`Đã thêm ${product.tenSanPham} vào giỏ hàng!`);
      }

      localStorage.setItem("cart", JSON.stringify(cart));
      updateCartBadge();
    })
    .catch((error) => {
      console.error("Error adding to cart:", error);
    });
}

// Toggle wishlist status
function toggleWishlist(productId) {
  const wishlistBtn = document.querySelector(
    `.product-card[data-product-id="${productId}"] .wishlist-btn i`
  );
  if (!wishlistBtn) return;

  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  const index = wishlist.indexOf(productId);

  if (index === -1) {
    // Add to wishlist
    wishlist.push(productId);
    wishlistBtn.classList.remove("far");
    wishlistBtn.classList.add("fas");
    wishlistBtn.style.color = "#ff0000";
    showNotification("Đã thêm vào danh sách yêu thích!");
  } else {
    // Remove from wishlist
    wishlist.splice(index, 1);
    wishlistBtn.classList.remove("fas");
    wishlistBtn.classList.add("far");
    wishlistBtn.style.color = "#000000";
    showNotification("Đã xóa khỏi danh sách yêu thích!");
  }

  localStorage.setItem("wishlist", JSON.stringify(wishlist));
}

// Render flash sale products
function renderFlashSaleProducts() {
  const container = document.querySelector(".flash-sale-products");
  if (!container) return;

  // Get product and discount data
  Promise.all([
    fetch("/data/products.json").then((res) => res.json()),
    fetch("/data/discounts.json").then((res) => res.json()),
  ])
    .then(([productsData, discountsData]) => {
      const now = new Date();

      // Filter flash sale products
      const flashSaleProducts = productsData.products.filter((product) => {
        const discount = discountsData.discounts.find(
          (d) =>
            d.maSanPham === product.maSanPham &&
            d.laFlashSale === true &&
            d.trangThai === "active" &&
            new Date(d.ngayBatDau) <= now &&
            new Date(d.ngayKetThuc) >= now
        );

        if (discount) {
          // Add discount info
          product.giaSauGiam = Math.round(product.gia * (1 - discount.phanTramGiam / 100));
          product.phanTramGiam = discount.phanTramGiam;
          return true;
        }
        return false;
      });

      if (flashSaleProducts.length === 0) {
        container.innerHTML = "<p>No flash sale products available</p>";
        return;
      }

      const fragment = document.createDocumentFragment();

      flashSaleProducts.forEach((product) => {
        const productCard = document.createElement("div");
        productCard.className = "product-card";
        productCard.setAttribute("data-product-id", product.id);

        const discount = product.phanTramGiam ? `-${product.phanTramGiam}%` : "";

        productCard.innerHTML = `
          <div class="product-image">
            <img src="${product.hinhAnh}" alt="${product.tenSanPham}">
            ${discount ? `<div class="discount-badge">${discount}</div>` : ""}
          </div>
          <div class="product-info">
            <div class="product-brand">${product.tenThuongHieu}</div>
            <div class="product-name">${product.tenSanPham}</div>
            <div class="product-price">
              ${formatPrice(product.giaSauGiam)}
              ${
                product.gia !== product.giaSauGiam
                  ? `<span class="original-price">${formatPrice(product.gia)}</span>`
                  : ""
              }
            </div>
            <button class="add-to-cart-btn" onclick="event.stopPropagation(); addToCart(${
              product.id
            }, 1)">
              Thêm vào giỏ
            </button>
          </div>
        `;

        productCard.addEventListener("click", () => {
          window.location.href = `htmls/ChiTietSanPham.html?id=${product.id}`;
        });

        fragment.appendChild(productCard);
      });

      container.innerHTML = "";
      container.appendChild(fragment);

      // Calculate items per row
      const firstCard = container.querySelector(".product-card");
      if (firstCard && flashSaleProducts.length > 0) {
        const containerWidth = container.offsetWidth;
        const cardWidth = firstCard.offsetWidth;
        const itemsPerRow = Math.floor(containerWidth / cardWidth);

        // Hide products after first row
        const allCards = container.querySelectorAll(".product-card");
        allCards.forEach((card, index) => {
          if (index >= itemsPerRow) {
            card.classList.add("hidden");
          }
        });

        // Show/hide view more button
        const viewMoreBtn = document.querySelector(".view-more-btn");
        if (viewMoreBtn) {
          viewMoreBtn.style.display = flashSaleProducts.length > itemsPerRow ? "block" : "none";
        }
      }
    })
    .catch((error) => {
      console.error("Error loading flash sale products:", error);
      container.innerHTML = "<p>Could not load flash sale products</p>";
    });
}

// Render trending products

function renderTrendingProducts() {
  const container = document.querySelector("#SPdoclap2 .Best_seller-wrapper");
  if (!container) return;

  Promise.all([
    fetch("/data/products.json").then((res) => res.json()),
    fetch("/data/discounts.json").then((res) => res.json()),
  ])
    .then(([productsData, discountsData]) => {
      const now = new Date();

      // Calculate prices with discounts
      const productsWithPrice = productsData.products.map((product) => {
        const discount = discountsData.discounts.find(
          (d) =>
            d.maSanPham === product.maSanPham &&
            d.trangThai === "active" &&
            new Date(d.ngayBatDau) <= now &&
            new Date(d.ngayKetThuc) >= now
        );

        return {
          ...product,
          giaSauGiam: discount
            ? Math.round(product.gia * (1 - discount.phanTramGiam / 100))
            : product.gia,
          phanTramGiam: discount ? discount.phanTramGiam : 0,
        };
      });

      // Sort by highest price
      const trendingProducts = productsWithPrice
        .sort((a, b) => b.giaSauGiam - a.giaSauGiam)
        .slice(0, 7);

      const fragment = document.createDocumentFragment();

      trendingProducts.forEach((product) => {
        const item = document.createElement("div");
        item.className = "Best_seller-item";
        item.setAttribute("data-product-id", product.id);

        item.innerHTML = `
          <div class="image-container">
            <img src="${product.hinhAnh}" alt="${product.tenSanPham}">
          </div>
          <h3>${product.tenThuongHieu}</h3>
          <p>${product.tenSanPham}</p>
          <div class="price">
            ${formatPrice(product.giaSauGiam)}
            ${product.phanTramGiam > 0 ? `<del>${formatPrice(product.gia)}</del>` : ""}
          </div>
          <button class="add-to-cart-btn" onclick="event.stopPropagation(); addToCart(${
            product.id
          }, 1)">
            Thêm vào giỏ
          </button>
        `;

        item.addEventListener("click", () => {
          window.location.href = `htmls/ChiTietSanPham.html?id=${product.id}`;
        });

        fragment.appendChild(item);
      });

      container.innerHTML = "";
      container.appendChild(fragment);
    })
    .catch((error) => {
      console.error("Error loading trending products:", error);
      container.innerHTML = "<p>Could not load products</p>";
    });
}

// Render advertisements
function renderAdvertisements() {
  renderImageContent(".QuangCao", appData.advertisements);
}

// Render brand ads
function renderBrandAds() {
  renderImageContent(".Brand_qc", appData.brandAds);
}

// Render premium brands
function renderPremiumBrands() {
  renderImageContent(".NhanHangXin", appData.premiumBrands);
}

// Helper function to render image content
function renderImageContent(selector, items) {
  const container = document.querySelector(selector);
  if (!container || !items) return;

  const fragment = document.createDocumentFragment();

  items.forEach((item) => {
    const img = document.createElement("img");
    img.src = item.imageUrl;
    img.alt = item.title || `Item ${item.id}`;
    fragment.appendChild(img);
  });

  container.innerHTML = "";
  container.appendChild(fragment);
}

// Render magazine articles
function renderMagazineArticles() {
  const container = document.querySelector(".MAGAZINE_img");
  if (!container || !appData.magazineArticles) return;

  const fragment = document.createDocumentFragment();

  appData.magazineArticles.forEach((article) => {
    const articleDiv = document.createElement("div");
    articleDiv.className = "MAGAZINE_img_item";
    articleDiv.innerHTML = `
      <img src="${article.imageUrl}" alt="${article.title}">
      <h4>${article.title}</h4>
      <p>${article.content}</p>
    `;
    fragment.appendChild(articleDiv);
  });

  container.innerHTML = "";
  container.appendChild(fragment);
}

// Setup carousels
function setupCarousels() {
  // Get all carousel containers
  const carousels = document.querySelectorAll(".Best_seller, .TheQuangCao");

  carousels.forEach((carousel) => {
    const wrapper = carousel.querySelector(".Best_seller-wrapper, .QuangCao");
    const nextBtn = carousel.querySelector(".nav-btn.next-btn");
    const prevBtn = carousel.querySelector(".nav-btn.prev-btn");

    // Xác định loại carousel và đặt chiều rộng cố định tương ứng
    let itemWidth = 305; // Giá trị mặc định: 280px cho item + 25px gap

    // Kiểm tra media query để điều chỉnh itemWidth dựa theo kích thước màn hình
    if (window.matchMedia("(max-width: 768px)").matches) {
      itemWidth = 265; // 240px cho item + 25px gap cho màn hình <= 768px
    } else if (window.matchMedia("(max-width: 480px)").matches) {
      itemWidth = 175; // 150px cho item + 25px gap cho màn hình <= 480px
    }

    // Nếu là QuangCao, sử dụng kích thước khác
    if (wrapper.classList.contains("QuangCao")) {
      const items = wrapper.querySelectorAll("img");
      if (items.length > 0) {
        itemWidth = 330; // 300px cho QuangCao image + 30px gap
      }
    }

    // Add next button click handler
    nextBtn.addEventListener("click", () => {
      const firstItem = wrapper.firstElementChild;
      wrapper.style.transition = "transform 0.6s ease-in-out";
      wrapper.style.transform = `translateX(-${itemWidth}px)`;

      setTimeout(() => {
        wrapper.style.transition = "none";
        wrapper.appendChild(firstItem);
        wrapper.style.transform = "translateX(0)";
      }, 600);
    });

    // Add previous button click handler
    prevBtn.addEventListener("click", () => {
      const lastItem = wrapper.lastElementChild;
      wrapper.style.transition = "none";
      wrapper.insertBefore(lastItem, wrapper.firstElementChild);
      wrapper.style.transform = `translateX(-${itemWidth}px)`;

      setTimeout(() => {
        wrapper.style.transition = "transform 0.6s ease-in-out";
        wrapper.style.transform = "translateX(0)";
      }, 10);
    });
  });
}

// Call setupCarousels when DOM is loaded
document.addEventListener("DOMContentLoaded", setupCarousels);

// Setup countdown timer
function setupCountdown() {
  // Lấy ngày hiện tại và đặt thời gian hết hạn vào 23:59:59 của ngày hôm nay
  const now = new Date();
  const countDownDate = new Date(now);
  countDownDate.setHours(23, 59, 59, 999);

  // Lấy các phần tử HTML cần cập nhật
  const daysElement = document.getElementById("days");
  const hoursElement = document.getElementById("hours");
  const minutesElement = document.getElementById("minutes");
  const secondsElement = document.getElementById("seconds");
  const timerContainer = document.querySelector(".timer-container");

  // Kiểm tra xem các phần tử có tồn tại không
  if (!timerContainer || !daysElement || !hoursElement || !minutesElement || !secondsElement) {
    console.error("Không tìm thấy các phần tử countdown timer trong DOM");
    return;
  }

  const updateCountdown = () => {
    const currentTime = new Date().getTime();
    const distance = countDownDate - currentTime;

    if (distance < 0) {
      timerContainer.innerHTML =
        "<div class='expired-message'>FLASH SALE HÔM NAY ĐÃ KẾT THÚC</div>";
      return;
    }

    // Calculate time units
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Update UI elements safely
    daysElement.textContent = days.toString().padStart(2, "0");
    hoursElement.textContent = hours.toString().padStart(2, "0");
    minutesElement.textContent = minutes.toString().padStart(2, "0");
    secondsElement.textContent = seconds.toString().padStart(2, "0");
  };

  // Initial update
  updateCountdown();

  // Update every second
  return setInterval(updateCountdown, 1000);
}

// Setup flash sale button events
function setupFlashSaleButtons() {
  document.querySelectorAll(".flash-sale-products .product-card").forEach((card) => {
    // Add to cart button
    const addToCartBtn = card.querySelector(".add-to-cart-btn");
    if (addToCartBtn) {
      const newAddToCartBtn = addToCartBtn.cloneNode(true);
      addToCartBtn.parentNode.replaceChild(newAddToCartBtn, addToCartBtn);

      newAddToCartBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        const productId = card.getAttribute("data-product-id");
        if (productId) {
          addToCart(productId, 1);
        }
      });
    }

    // Wishlist button
    const wishlistBtn = card.querySelector(".wishlist-btn");
    if (wishlistBtn) {
      const newWishlistBtn = wishlistBtn.cloneNode(true);
      wishlistBtn.parentNode.replaceChild(newWishlistBtn, wishlistBtn);

      newWishlistBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        const productId = card.getAttribute("data-product-id");
        if (productId) {
          toggleWishlist(productId);
        }
      });
    }
  });

  // Restore wishlist state
  const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  wishlist.forEach((productId) => {
    const wishlistIcon = document.querySelector(
      `.product-card[data-product-id="${productId}"] .wishlist-btn i`
    );
    if (wishlistIcon) {
      wishlistIcon.classList.remove("far");
      wishlistIcon.classList.add("fas");
      wishlistIcon.style.color = "#ff0000";
    }
  });
}
// Scroll to Magazine section
document.addEventListener("DOMContentLoaded", () => {
  const newsLink = document.querySelector('a[href="#MAGAZINE"]');
  const magazineSection = document.getElementById("MAGAZINE");

  if (newsLink && magazineSection) {
    newsLink.addEventListener("click", (e) => {
      e.preventDefault();
      window.scrollTo({
        top: magazineSection.offsetTop - 200,
        behavior: "smooth",
      });
    });
  }

  loadHomepage();
});

