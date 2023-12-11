document.addEventListener("DOMContentLoaded", () => {
  /* Slider */
  const slider = document.querySelector(".slider");
  const sliderItemsWrapper = slider.querySelector(".slider__items");
  const sliderNav = slider.querySelector(".slider__nav");
  const sliderBulletsList = slider.querySelectorAll(".slider__bullet");

  const delayInterval = 500;
  const lengthSwipe = 100;

  let sliderWidth = sliderItemsWrapper.scrollWidth;
  let slideWidth = sliderItemsWrapper.getBoundingClientRect().width;
  let currentSlide = 0;
  let sliderIndex = 0;
  let stepBullet = 0;
  let counter = 0;
  let gap = parseFloat(getComputedStyle(sliderItemsWrapper).gap);
  let lastWindowWidth = window.innerWidth;
  let sliderInterval;
  let bulletsProgressInterval;
  let touchX = null;
  let moveX = null;
  let swipeX = null;

  function initSlider() {
    function initSliderNav(nav) {
      const prev = nav.children[0];
      const next = nav.children[1];

      prev.addEventListener("click", () => {
        clearSliderInterval();
        startSliderInterval();
        prevSlide();
      });
      next.addEventListener("click", () => {
        clearSliderInterval();
        startSliderInterval();
        nextSlide();
      });
    }

    function prevSlide() {
      counter = 0;
      stepBullet = 0;
      if (currentSlide < 0 && currentSlide !== 0) {
        currentSlide += slideWidth + gap;
      } else {
        currentSlide = -sliderWidth + slideWidth;
      }

      if (sliderIndex === 0) {
        sliderIndex = 2;
      } else {
        sliderIndex--;
      }

      sliderItemsWrapper.style.transform = `translateX(${currentSlide}px)`;
    }

    function nextSlide() {
      counter = 0;
      stepBullet = 0;
      if (currentSlide > -sliderWidth + slideWidth) {
        currentSlide -= slideWidth + gap;
      } else {
        currentSlide = 0;
      }

      if (sliderIndex >= 2) {
        sliderIndex = 0;
      } else {
        sliderIndex++;
      }

      sliderItemsWrapper.style.transform = `translateX(${currentSlide}px)`;
    }

    function bulletsProgress() {
      sliderBulletsList.forEach((e) => {
        e.children[0].style.width = "0%";
      });
      sliderBulletsList[
        sliderIndex
      ].children[0].style.width = `${(stepBullet += 10)}%`;
    }

    function startSliderInterval() {
      sliderInterval = setInterval(() => {
        counter += 10;
        if (counter >= 100) {
          nextSlide();
        }
      }, delayInterval);
      bulletsProgressInterval = setInterval(() => {
        bulletsProgress();
      }, delayInterval);
    }

    function clearSliderInterval() {
      clearInterval(sliderInterval);
      clearInterval(bulletsProgressInterval);
    }

    function sliderListener(event) {
      event.addEventListener("mouseover", () => {
        clearSliderInterval();
      });
      event.addEventListener("mouseout", () => {
        startSliderInterval();
      });

      event.addEventListener("touchstart", (e) => {
        if (e.target.closest(".slider__item")) {
          clearSliderInterval();
          touchX = e.touches[0].clientX;
        }
      });
      event.addEventListener("touchend", () => {
        startSliderInterval();
        if (swipeX > lengthSwipe) {
          prevSlide();
        } else if (swipeX < -lengthSwipe) {
          nextSlide();
        }
      });

      event.addEventListener("touchmove", (e) => {
        if (!touchX) return;
        moveX = e.touches[0].clientX;
        swipeX = moveX - touchX;
      });
    }

    window.addEventListener("resize", function () {
      if (window.innerWidth !== lastWindowWidth) {
        gap = parseFloat(getComputedStyle(sliderItemsWrapper).gap);
        sliderWidth = sliderItemsWrapper.scrollWidth;
        slideWidth = sliderItemsWrapper.getBoundingClientRect().width;
        sliderIndex = 0;
        currentSlide = 0;
        stepBullet = 0;
        counter = 0;
        sliderItemsWrapper.style.transform = `translateX(0px)`;
        sliderBulletsList.forEach((e) => {
          e.children[0].style.width = "0%";
        });
        clearSliderInterval();
        startSliderInterval();
      }
      lastWindowWidth = window.innerWidth;
    });

    initSliderNav(sliderNav);
    sliderListener(sliderItemsWrapper);
    startSliderInterval();
  }

  initSlider();
});
