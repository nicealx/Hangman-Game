document.addEventListener("DOMContentLoaded", () => {
  /* Slider */
  const slider = document.querySelector(".slider");
  const sliderItemsWrapper = slider.querySelector(".slider__items");
  const sliderNav = slider.querySelector(".slider__nav");
  const sliderBulletsList = slider.querySelectorAll(".slider__bullet");

  const delay = 500;
  const delayInterval = 5000;

  let sliderWidth = sliderItemsWrapper.scrollWidth;
  let slideWidth = sliderItemsWrapper.getBoundingClientRect().width;
  let currentSlide = 0;
  let sliderIndex = 0;
  let stepBullet = 0;
  let gap = parseFloat(getComputedStyle(sliderItemsWrapper).gap);
  let lastWindowWidth = window.innerWidth;
  let sliderInterval;
  let bulletsProgressInterval;

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
      stepBullet = 0;
      this.disabled = true;
      setTimeout(() => {
        this.disabled = false;
      }, delay);
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
      stepBullet = 0;
      this.disabled = true;
      setTimeout(() => {
        this.disabled = false;
      }, delay);
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
        nextSlide();
      }, delayInterval);
      bulletsProgressInterval = setInterval(() => {
        bulletsProgress();
      }, delayInterval / 10);
    }

    function clearSliderInterval() {
      clearInterval(sliderInterval);
      clearInterval(bulletsProgressInterval);
    }

    sliderItemsWrapper.addEventListener("mouseover", () => {
      clearSliderInterval();
    });
    sliderItemsWrapper.addEventListener("mouseout", () => {
      startSliderInterval();
    });

    let x1 = null;
    let y1 = null;
    let x2 = null;
    let y2 = null;
    let xDiff = null;
    let yDiff = null;

    sliderItemsWrapper.addEventListener("touchstart", (e) => {
      if (e.target.closest(".slider__item")) {
        clearSliderInterval();
        const touch = e.touches[0];
        x1 = touch.clientX;
        y1 = touch.clientY;
      }
    });
    sliderItemsWrapper.addEventListener("touchend", () => {
      startSliderInterval();
      if (xDiff > 100) {
        prevSlide();
      } else if (xDiff < -100) {
        nextSlide();
      }
    });

    sliderItemsWrapper.addEventListener("touchmove", (e) => {
      if (!x1 || !y1) return;
      x2 = e.touches[0].clientX;
      y2 = e.touches[0].clientY;
      xDiff = x2 - x1;
      yDiff = y2 - y1;
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth !== lastWindowWidth) {
        gap = parseFloat(getComputedStyle(sliderItemsWrapper).gap);
        sliderWidth = sliderItemsWrapper.scrollWidth;
        slideWidth = sliderItemsWrapper.getBoundingClientRect().width;
        sliderIndex = 0;
        currentSlide = 0;
        stepBullet = 0;
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
    startSliderInterval();
  }

  initSlider();
});
