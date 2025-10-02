// const start = document.querySelector(".start");
// const end = document.querySelector(".end");
// const wrapper = document.querySelector(".Best_seller-wrapper");
// const items = document.querySelectorAll(".Best_seller-item");
// const itemsPerSlide = 4;
// let currentIndex = 0;

// function updateView() {
//     const translateX = -currentIndex * (100 / itemsPerSlide);
//     wrapper.style.transform = `translateX(${translateX}%)`;
// }

// end.addEventListener("click", function() {
//     if (currentIndex < Math.ceil(items.length / itemsPerSlide) - 1) {
//         currentIndex++;
//     } else {
//         currentIndex = 0; // Go back to the first set of items
//     }
//     updateView();
// });

// start.addEventListener("click", function() {
//     if (currentIndex > 0) {
//         currentIndex--;
//     } else {
//         currentIndex = Math.ceil(items.length / itemsPerSlide) - 1; // Go to the last set of items
//     }
//     updateView();
// });

const end_qc = document.querySelector(".end_qc");
const start_qc = document.querySelector(".start_qc");
const QuangCao = document.querySelector(".QuangCao");
const images = document.querySelectorAll(".QuangCao img");
const imagesPerSlide_qc = 4;
let currentIndex_qc = 0;

function updateView_qc() {
    const maxIndex = Math.ceil(images.length / imagesPerSlide_qc) - 1;
    currentIndex_qc = currentIndex_qc > maxIndex ? maxIndex : currentIndex_qc;
    const translateX = -currentIndex_qc * (100 / (maxIndex + 1));
    QuangCao.style.transform = `translateX(${translateX}%)`;
}

start_qc.addEventListener("click", function() {
    const maxIndex = Math.ceil(images.length / imagesPerSlide_qc) - 1;
    if (currentIndex_qc < maxIndex) {
        currentIndex_qc++;
    } else {
        currentIndex_qc = 0; // Quay lại slide đầu tiên
    }
    updateView_qc();
});

end_qc.addEventListener("click", function() {
    if (currentIndex_qc > 0) {
        currentIndex_qc--;
    } else {
        currentIndex_qc = Math.ceil(images.length / imagesPerSlide_qc) - 1; // Chuyển đến slide cuối cùng
    }
    updateView_qc();
});

  // Set the date for midnight of June 16, 2024 (12h đêm của ngày 15/6)
  var countDownDate = new Date("Jun 16, 2024 00:00:00").getTime();

  // Update the countdown every 1 second
  var x = setInterval(function() {
      // Get the current date and time
      var now = new Date().getTime();
      
      // Calculate the remaining time
      var distance = countDownDate - now;
      
      // Calculate days, hours, minutes, and seconds
      var days = Math.floor(distance / (1000 * 60 * 60 * 24));
      var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = Math.floor((distance % (1000 * 60)) / 1000);
      
      // Display the result in the elements with respective ids
      document.getElementById("days").innerHTML = days;
      document.getElementById("hours").innerHTML = hours;
      document.getElementById("minutes").innerHTML = minutes;
      document.getElementById("seconds").innerHTML = seconds;
      
      // If the countdown is over, display a message
      if (distance < 0) {
          clearInterval(x);
          document.getElementById("countdown").innerHTML = "EXPIRED";
      }
  }, 1000);

  function initializeCarousel(carouselId) {
    const carousel = document.querySelector(carouselId);
    const start = carousel.querySelector(".start");
    const end = carousel.querySelector(".end");
    const wrapper = carousel.querySelector(".Best_seller-wrapper");
    const items = carousel.querySelectorAll(".Best_seller-item");
    const itemsPerSlide = 4;
    let currentIndex = 0;

    function updateView() {
        const translateX = -currentIndex * (100 / itemsPerSlide);
        wrapper.style.transform = `translateX(${translateX}%)`;
    }

    end.addEventListener("click", function() {
        if (currentIndex < Math.ceil(items.length / itemsPerSlide) - 1) {
            currentIndex++;
        } else {
            currentIndex = 0; // Go back to the first set of items
        }
        updateView();
    });

    start.addEventListener("click", function() {
        if (currentIndex > 0) {
            currentIndex--;
        } else {
            currentIndex = Math.ceil(items.length / itemsPerSlide) - 1; // Go to the last set of items
        }
        updateView();
    });
}

// Khởi tạo tất cả các carousels
initializeCarousel("#Spdoclap");
initializeCarousel("#SPdoclap2");