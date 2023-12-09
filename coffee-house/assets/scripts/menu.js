document.addEventListener("DOMContentLoaded", function () {
  const body = document.querySelector("body");
  const modal = document.querySelector(".modal");
  const modalWrapper = modal.querySelector(".modal__wrapper");

  const menuList = document.querySelector(".menu__list");
  let menuListItems = null;
  const menuTabs = document.querySelector(".menu__tabs");
  const menuTabsItems = menuTabs.querySelectorAll(".tabs__item");
  const menuBtnLoad = document.querySelector(".menu__btn-load");
  const url =
    "https://raw.githubusercontent.com/rolling-scopes-school/tasks/master/tasks/coffee-house/products.json";

  const currentCategory = "coffee";
  const opacityInterval = 500;
  const mobileWidth = 768;
  const amountView = 4;

  let amountProducts = 4;
  let addivSumm = 0;
  let lastWindowWidth = window.innerWidth;

  /* Menu tabs */
  menuTabs.addEventListener("click", function (e) {
    let tab = e.target.closest("button");
    if (tab !== null && !tab.classList.contains("tabs__item--active")) {
      let current = tab.textContent.toLowerCase();
      menuTabsItems.forEach((el) => el.classList.remove("tabs__item--active"));
      tab.classList.add("tabs__item--active");
      menuList.style.opacity = 0;
      setTimeout(() => {
        menuList.innerHTML = "";
        getProducts(url, current);
        menuList.style.opacity = 1;
      }, opacityInterval);
    }
  });

  /* Get menu list*/
  async function getProducts(url, current) {
    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        generateItemsList(data, current);
      });
  }

  function generateItemsList(data, current) {
    let currentList = [];
    let index = 1;
    for (product of data) {
      if (product.category === current) {
        currentList.push(`<div class="menu__item-top">
            <div class="menu__item-img"><img src="./assets/img/menu/${
              product.category
            }-${index++}.jpg"
                  alt="${product.name}"></div>
          </div>
          <div class="menu__item-bottom">
            <strong class="menu__item-title">${product.name}</strong>
            <p class="menu__item-descr">${product.description}</p>
            <span class="menu__item-price">$<span>${product.price}</span></span>
          </div>`);
      }
    }
    amountProducts = currentList.length;
    renderCategory(currentList, data);
  }

  function generateModalItem(item, index, data) {
    let modalContent = "";
    let currentItem = item.querySelector(".menu__item-title").textContent;
    for (product of data) {
      if (product.name === currentItem) {
        modalContent = `<div class="modal__image-wrapper">
          <img class="modal__image"
              src="./assets/img/menu/${product.category}-${index + 1}.jpg"
              alt="${product.name}">
        </div>
        <div class="modal__content">
          <h3 class="modal__title">${product.name}</h3>
          <div class="modal__info">
            <p class="modal__descr">${product.description}</p>
            <div class="modal__variation">
              <p class="modal__variation-title">Size</p>
              <div class="modal__tabs tabs tabs-size">
                <button class="tabs__item tabs__item--active">
                  <span class="tabs__item-icon">S</span><span class="tabs__item-text">${
                    product.sizes.s.size
                  }</span></button>
                <button class="tabs__item">
                  <span class="tabs__item-icon">M</span><span class="tabs__item-text">${
                    product.sizes.m.size
                  }</span></button>
                <button class="tabs__item">
                  <span class="tabs__item-icon">L</span><span class="tabs__item-text">${
                    product.sizes.l.size
                  }</span></button>
              </div>
            </div>
            <div class="modal__variation">
              <p class="modal__variation-title">Additives</p>
              <div class="modal__tabs tabs tabs-addiv">
                <button class="tabs__item tabs__item-addiv">
                  <span class="tabs__item-icon">1</span><span class="tabs__item-text">${
                    product.additives[0].name
                  }</span></button>
                <button class="tabs__item tabs__item-addiv">
                  <span class="tabs__item-icon">2</span><span class="tabs__item-text">${
                    product.additives[1].name
                  }</span></button>
                <button class="tabs__item tabs__item-addiv">
                  <span class="tabs__item-icon">3</span><span class="tabs__item-text">${
                    product.additives[2].name
                  }</span></button>
              </div>
            </div>
            <div class="modal__total">
              <p class="modal__total-text">Total:</p>
              <p class="modal__total-summ">$<span>${product.price}</span></p>
            </div>
            <div class="modal__annotation">
              <svg xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  class="modal__annotation-icon">
                <g clip-path="url(#clip0_268_12877)">
                  <path d="M8 7.66663V11"
                        stroke="#403F3D"
                        stroke-linecap="round"
                        stroke-linejoin="round" />
                  <path d="M8 5.00667L8.00667 4.99926"
                        stroke="#403F3D"
                        stroke-linecap="round"
                        stroke-linejoin="round" />
                  <path d="M7.99967 14.6667C11.6816 14.6667 14.6663 11.6819 14.6663 8.00004C14.6663 4.31814 11.6816 1.33337 7.99967 1.33337C4.31778 1.33337 1.33301 4.31814 1.33301 8.00004C1.33301 11.6819 4.31778 14.6667 7.99967 14.6667Z"
                        stroke="#403F3D"
                        stroke-linecap="round"
                        stroke-linejoin="round" />
                </g>
                <defs>
                  <clipPath id="clip0_268_12877">
                    <rect width="16"
                          height="16"
                          fill="white" />
                  </clipPath>
                </defs>
              </svg>
              <div class="modal__annotation-text">The cost is not final. Download our mobile app to see the final price
                and place your order. Earn loyalty points and enjoy your favorite coffee with up to 20% discount.</div>
            </div>
            <button class="modal__close">Close</button>
          </div>
        </div>`;
      }
    }
    renderModalContent(modalContent, currentItem, data);
  }

  function renderCategory(items, data) {
    items.forEach((item) => {
      let listItem = document.createElement("li");
      listItem.classList.add("menu__item");
      listItem.innerHTML = item;
      menuList.append(listItem);
    });

    menuListItems = menuList.querySelectorAll(".menu__item");
    menuListItems.forEach((item, index) => {
      item.addEventListener("click", () =>
        generateModalItem(item, index, data)
      );
    });

    if (window.innerWidth <= mobileWidth) {
      hideUnnecessaryItem();
    }
  }

  function renderModalContent(item, current, data) {
    modalWrapper.innerHTML = "";
    let modalItem = document.createElement("div");
    modalItem.classList.add("modal__container");
    modalItem.innerHTML = item;
    modalWrapper.append(modalItem);
    openModal();

    const modalSizeItems = document.querySelectorAll(".tabs-size button");
    modalSizeItems.forEach((item, index) => {
      item.addEventListener("click", () => {
        if (!item.classList.contains("tabs__item--active")) {
          modalSizeItems.forEach((el) =>
            el.classList.remove("tabs__item--active")
          );
          item.classList.add("tabs__item--active");
        }
        let size = item
          .querySelector(".tabs__item-icon")
          .textContent.toLowerCase();
        totalPrice(size, current, data, index);
      });
    });

    const modalAddivItems = document.querySelectorAll(".tabs-addiv button");
    modalAddivItems.forEach((item, index) => {
      item.addEventListener("click", () => {
        if (!item.classList.contains("tabs__item--active")) {
          item.classList.add("tabs__item--active", "tabs__item-addiv--active");
          totalPrice(item, current, data, index, "plus");
        } else {
          item.classList.remove(
            "tabs__item--active",
            "tabs__item-addiv--active"
          );
          ("tabs__item-addiv--active");
          totalPrice(item, current, data, index, "minus");
        }
      });
    });
  }

  function totalPrice(size, current, data, index, operation = null) {
    const modalTotalSumm = document.querySelector(".modal__total-summ span");
    let summ = modalTotalSumm.textContent;

    if (operation === null) {
      for (product of data) {
        if (product.name === current) {
          currentIndex = index;
          modalTotalSumm.textContent = (
            parseFloat(product.price) +
            parseFloat(product.sizes[size]["add-price"]) +
            addivSumm
          ).toFixed(2);
        }
      }
    }
    if (operation) {
      for (product of data) {
        if (product.name === current) {
          if (operation === "plus") {
            modalTotalSumm.textContent = (
              parseFloat(summ) +
              parseFloat(product.additives[index]["add-price"])
            ).toFixed(2);
            addivSumm += parseFloat(product.additives[index]["add-price"]);
          }

          if (operation === "minus") {
            modalTotalSumm.textContent = (
              parseFloat(summ) -
              parseFloat(product.additives[index]["add-price"])
            ).toFixed(2);
            addivSumm -= parseFloat(product.additives[index]["add-price"]);
          }
        }
      }
    }
  }

  function hideUnnecessaryItem() {
    menuListItems.forEach((e, index) =>
      index >= amountView ? e.classList.add("menu__item--hidden") : false
    );
    if (amountProducts <= amountView) {
      menuBtnLoad.classList.remove("menu__btn-load--active");
    } else {
      menuBtnLoad.classList.add("menu__btn-load--active");
    }
  }

  function showUnnecessaryItem() {
    menuListItems.forEach((e) => e.classList.remove("menu__item--hidden"));
  }

  /* Check window width */
  window.addEventListener("resize", function () {
    let currentWidth = window.innerWidth;
    if (currentWidth !== lastWindowWidth) {
      if (currentWidth <= mobileWidth) {
        hideUnnecessaryItem();
      } else {
        showUnnecessaryItem();
      }
    }
    lastWindowWidth = window.innerWidth;
  });

  menuBtnLoad.addEventListener("click", function () {
    menuListItems.forEach((e) => e.classList.remove("menu__item--hidden"));
    this.classList.remove("menu__btn-load--active");
  });

  /* Modal Show/Hide */
  modal.addEventListener("click", function (e) {
    let target = e.target;
    if (
      target.closest("button.modal__close") ||
      target.classList.contains("modal__overlay")
    ) {
      modal.classList.remove("modal--show");
      body.classList.remove("no-scroll");
      modalWrapper.innerHTML = "";
      addivSumm = 0;
    }
  });

  function openModal() {
    modal.classList.add("modal--show");
    body.classList.add("no-scroll");
  }

  getProducts(url, currentCategory);
});
