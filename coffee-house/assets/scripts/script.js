document.addEventListener("DOMContentLoaded", function () {
  const body = document.querySelector("body");
  const headerMenu = document.querySelector(".header__menu");
  const headerMenuBurger = document.querySelector(".header__menu-burger");
  const mobileWidth = 768;

  /* Burger Menu */

  function toggleBurgerMenu() {
    headerMenuBurger.classList.toggle("burger--open");
    headerMenu.classList.toggle("header__menu--open");
    body.classList.toggle("no-scroll");
  }

  headerMenuBurger.addEventListener("click", function () {
    toggleBurgerMenu();
  });

  headerMenu.addEventListener("click", (e) => {
    if (e.target.classList.contains("header__menu-link")) {
      toggleBurgerMenu();
    }
  });

  window.addEventListener("resize", function () {
    if (window.innerWidth >= mobileWidth) {
      body.classList.remove("no-scroll");
      headerMenuBurger.classList.remove("burger--open");
      headerMenu.classList.remove("header__menu--open");
    }
  });
});
