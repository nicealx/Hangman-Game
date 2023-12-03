document.addEventListener("DOMContentLoaded", function () {
  const body = document.querySelector("body");
  const headerMenu = document.querySelector(".header__menu");
  const headerMenuBurger = document.querySelector(".header__menu-burger");

  headerMenuBurger.addEventListener("click", function () {
    this.classList.toggle("burger--open");
    headerMenu.classList.toggle("header__menu--open");
    body.classList.toggle("no-scroll");
  });
});
