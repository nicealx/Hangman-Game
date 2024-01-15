const body = document.querySelector(".body");
const questions = [
  ["Кого из птиц называют санитаром леса?", "дятла"],
  ["Сколько лапок у паука?", "восемь"],
  ["Какой кот ходит по цепи кругом в сказке Пушкина?", "учёный"],
  ["Как называют замёрзшую воду?", "лёд"],
  ["Кто самое медлительное животное?", "ленивец"],
  ["Сколько цветов в радуге?", "семь"],
  ["Какая планета самая горячая?", "Венера"],
  ["За какой нотой идёт «ми»?", "ре"],
  ["Сколько сторон света есть?", "четыре"],
  ["С какого месяца начинается лето?", "июнь"],
];
const keyboardEN = [
  81, 87, 69, 82, 84, 89, 85, 73, 79, 80, 65, 83, 68, 70, 71, 72, 74, 75, 76,
  90, 88, 67, 86, 66, 78, 77,
];

const keyboardRU = [
  70, 188, 68, 85, 76, 84, 192, 186, 80, 66, 81, 82, 75, 86, 89, 74, 71, 72, 67,
  78, 69, 65, 219, 87, 88, 73, 79, 221, 83, 77, 222, 190, 90,
];
const ruKeyCodes = {
  81: "й",
  87: "ц",
  69: "у",
  82: "к",
  84: "е",
  89: "н",
  85: "г",
  73: "ш",
  79: "щ",
  80: "з",
  219: "х",
  221: "ъ",
  65: "ф",
  83: "ы",
  68: "в",
  70: "а",
  71: "п",
  72: "р",
  74: "о",
  75: "л",
  76: "д",
  186: "ж",
  222: "э",
  90: "я",
  88: "ч",
  67: "с",
  86: "м",
  66: "и",
  78: "т",
  77: "ь",
  188: "б",
  190: "ю",
  192: "ё",
};
const charsList = {};
let count = 0;
const countMax = 6;
const people = [
  "head.png",
  "body.png",
  "hand-left.png",
  "hand-right.png",
  "leg-left.png",
  "leg-right.png",
];

let countNotification = 0;

localStorage.setItem("current", 0);
let currentQuestion = +localStorage.getItem("current");

function newGame(main, modalDiv, bodyTitle) {
  main.remove();
  modalDiv.remove();
  bodyTitle.remove();
  count = 0;
  countNotification = 0;
  Object.keys(charsList).forEach((key) => delete charsList[key]);
  createContent();
}

function handlerKeypress(e) {
  let key = e.key;
  let target = null;
  const answerText = arguments.callee.answerText,
    keyboardDiv = arguments.callee.keyboardDiv,
    counterDynamic = arguments.callee.counterDynamic,
    answerDiv = arguments.callee.answerDiv,
    gallowsDiv = arguments.callee.gallowsDiv,
    main = arguments.callee.main;
  bodyTitle = arguments.callee.bodyTitle;
  if (ruKeyCodes[e.keyCode] !== undefined) {
    if (ruKeyCodes[e.keyCode].toUpperCase() === key.toUpperCase()) {
      keyboardDiv.querySelectorAll("button").forEach((el) => {
        if (el.value === key.toUpperCase()) {
          target = el;
        }
      });
      checkAnswer(
        key.toUpperCase(),
        answerText,
        target,
        keyboardDiv,
        counterDynamic,
        answerDiv,
        gallowsDiv,
        main,
        bodyTitle
      );
    } else if (keyboardEN.indexOf(e.keyCode) !== -1) {
      const notification = createNotification();
      body.append(notification);

      setTimeout(() => {
        notification.classList.add("notification--active");
      }, 100);

      setTimeout(() => {
        notification.classList.remove("notification--active");
      }, 3000);

      setTimeout(() => {
        notification.remove();
        countNotification--;
      }, 3500);
    }
  }
}

function createNotification() {
  const notificationDiv = document.createElement("div");
  notificationDiv.className = "notification";
  const notificationText = document.createElement("p");
  notificationText.className = "notification__text";
  notificationText.textContent =
    "Переключитесь пожалуйста на русскую раскладку. Спасибо!";
  notificationDiv.append(notificationText);
  notificationDiv.style.bottom = `${10 + countNotification * 100}px`;
  countNotification++;
  return notificationDiv;
}

function generateQuestion() {
  const random = Math.floor(Math.random() * questions.length);

  if (currentQuestion === random) {
    return generateQuestion();
  } else {
    localStorage.setItem("current", random);
    currentQuestion = +localStorage.getItem("current");
    return [createAnswer(questions[random][1]), questions[random][0]];
  }
}

function disableKeys(keyboardDiv) {
  keyboardDiv.querySelectorAll("button").forEach((button) => {
    button.disabled = true;
    button.classList.add("keyboard__button--end-game");
  });
}

function checkWin(keyboardDiv, answerText, main, bodyTitle) {
  disableKeys(keyboardDiv);
  document.removeEventListener("keydown", handlerKeypress);
  body.append(
    createModal(
      answerText,
      "Вы выиграли!",
      "modal__button-win",
      "modal__overlay-win",
      main,
      bodyTitle
    )
  );
}

function checkAnswer(
  value,
  answer,
  target,
  keyboardDiv,
  counterDynamic,
  answerDiv,
  gallowsDiv,
  main,
  bodyTitle
) {
  const chars = {};
  const check = [];

  answer
    .toUpperCase()
    .split("")
    .forEach((el, i) => {
      if (el === value) {
        chars[i] = el;
        target.disabled = true;
        target.classList.add("keyboard__button--correct");
        check.push(0);
      } else if (charsList[i] === undefined) {
        chars[i] = "_";
      }
    });

  if (check.length > 0) {
    correctInput(chars, keyboardDiv, answerDiv, answer, main, bodyTitle);
  } else {
    errorInput(
      keyboardDiv,
      counterDynamic,
      target,
      answer,
      gallowsDiv,
      main,
      bodyTitle
    );
  }
}

function errorInput(
  keyboardDiv,
  counterDynamic,
  target,
  answerText,
  gallowsDiv,
  main,
  bodyTitle
) {
  if (count < countMax) {
    const partImg = document.createElement("img");
    partImg.className = `gallows__part gallows__part-${
      people[count].split(".")[0]
    }`;
    partImg.src = `./assets/img/people/${people[count]}`;
    gallowsDiv.append(partImg);
  }

  count++;
  target.disabled = true;
  target.classList.add("keyboard__button--error");

  if (count === countMax) {
    disableKeys(keyboardDiv);
    document.removeEventListener("keydown", handlerKeypress);
    body.append(
      createModal(
        answerText,
        "Вы проиграли! :(",
        "modal__button-lose",
        "modal__overlay-lose",
        main,
        bodyTitle
      )
    );
  }

  if (count <= 2) {
    counterDynamic.classList.add("counter__count-light");
  } else if (count <= 4) {
    counterDynamic.classList.remove("counter__count-light");
    counterDynamic.classList.add("counter__count-normal");
  } else {
    counterDynamic.classList.remove("counter__count-normal");
    counterDynamic.classList.add("counter__count-danger");
  }
  counterDynamic.textContent = count;
}

function correctInput(
  chars,
  keyboardDiv,
  answerDiv,
  answerText,
  main,
  bodyTitle
) {
  const check = [];
  Object.assign(charsList, chars);
  const answer = answerDiv.querySelectorAll(".answer__char");
  const answerArray = Array.from(answer);
  const charsListKeys = Object.keys(charsList);

  answerArray.forEach((el, i) => {
    if (charsListKeys.indexOf(i)) {
      el.textContent = charsList[i];
    }
  });

  charsListKeys.forEach((el) => {
    if (charsList[el] !== "_") {
      check.push(0);
    }
  });

  if (check.length === answer.length) {
    checkWin(keyboardDiv, answerText, main, bodyTitle);
  }
}

function createKeyboard() {
  const keys = [];

  keyboardRU.forEach((el) => {
    let button = document.createElement("button");
    button.className = "keyboard__button";
    button.value = ruKeyCodes[el].toUpperCase();
    button.innerText = ruKeyCodes[el].toUpperCase();
    keys.push(button);
  });

  return keys;
}

function createAnswer(answer) {
  const answerDiv = document.createElement("div");
  answerDiv.className = "answer";
  const answerText = document.createElement("p");
  answerText.className = "answer__text";
  answerDiv.append(answerText);

  answer.split("").forEach((el) => {
    const span = document.createElement("span");
    span.className = "answer__char";
    span.textContent = "_";
    answerText.append(span);
  });

  return [answerDiv, answer];
}

function createModal(
  answerText,
  titleModal,
  btnClass,
  overlayClass,
  main,
  bodyTitle
) {
  const modalDiv = document.createElement("div");
  modalDiv.className = "modal";
  const modalWrapper = document.createElement("div");
  modalWrapper.className = "modal__wrapper";
  const modalOverlay = document.createElement("div");
  modalOverlay.className = `modal__overlay ${overlayClass}`;
  const modalTitle = document.createElement("h3");
  modalTitle.className = "modal__title";
  modalTitle.textContent = titleModal;
  const modalAnswer = document.createElement("p");
  const modalSpan = document.createElement("span");
  modalAnswer.className = "modal__answer";
  modalAnswer.textContent = "Ответ: ";
  modalSpan.textContent = answerText.toUpperCase();
  modalAnswer.append(modalSpan);

  const modalButton = document.createElement("button");
  modalButton.className = `modal__button ${btnClass}`;
  modalButton.textContent = "Сыграть ещё";
  modalButton.onclick = () => newGame(main, modalDiv, bodyTitle);

  modalWrapper.append(modalTitle, modalAnswer, modalButton);
  modalDiv.append(modalWrapper, modalOverlay);
  return modalDiv;
}

function createGallows() {
  const gallowsDiv = document.createElement("div");
  gallowsDiv.className = "gallows";

  const gallowsImg = document.createElement("img");
  gallowsImg.className = "gallows__img";
  gallowsImg.src = "./assets/img/gallows.png";

  gallowsDiv.append(gallowsImg);

  return gallowsDiv;
}

function createContent() {
  const main = document.createElement("main");
  main.className = "app";
  const bodyTitle = document.createElement("h1");
  bodyTitle.className = "title";
  bodyTitle.textContent = "Hangman";

  const appLeft = document.createElement("section");
  appLeft.className = "app__left";

  const gallowsDiv = createGallows();

  const appRight = document.createElement("section");
  appRight.className = "app__right";

  const [answer, question] = generateQuestion();

  const questionDiv = document.createElement("div");
  const questionText = document.createElement("h2");
  questionDiv.className = "question";
  questionText.className = "question__title";
  questionText.innerText = question;

  const [answerDiv, answerText] = answer;

  const counterDiv = document.createElement("div");
  counterDiv.className = "counter";
  const counterP = document.createElement("p");
  counterP.className = "counter__field";
  counterP.textContent = " из ";
  const counterText = document.createElement("span");
  counterText.className = "counter__text";
  counterText.textContent = "Ошибок ";
  const counterDynamic = document.createElement("span");
  counterDynamic.className = "counter__count";
  counterDynamic.textContent = count;
  const counterStatic = document.createElement("span");
  counterStatic.className = "counter__max";
  counterStatic.textContent = countMax;
  counterP.prepend(counterDynamic);
  counterP.prepend(counterText);
  counterP.append(counterStatic);
  counterDiv.append(counterP);

  const keyboardDiv = document.createElement("div");
  keyboardDiv.className = "keyboard";
  keyboardDiv.append(...createKeyboard());

  keyboardDiv.addEventListener("click", (e) => {
    let target = e.target;
    if (target.classList.contains("keyboard__button")) {
      let value = target.value;
      checkAnswer(
        value,
        answerText,
        target,
        keyboardDiv,
        counterDynamic,
        answerDiv,
        gallowsDiv,
        main,
        bodyTitle
      );
    }
  });

  handlerKeypress.answerText = answerText;
  handlerKeypress.keyboardDiv = keyboardDiv;
  handlerKeypress.counterDynamic = counterDynamic;
  handlerKeypress.answerDiv = answerDiv;
  handlerKeypress.gallowsDiv = gallowsDiv;
  handlerKeypress.main = main;
  handlerKeypress.bodyTitle = bodyTitle;

  document.addEventListener("keydown", handlerKeypress);

  appLeft.append(gallowsDiv);
  questionDiv.append(questionText);
  appRight.append(questionDiv);
  appRight.append(answerDiv);
  appRight.append(counterDiv);
  appRight.append(keyboardDiv);
  main.append(appLeft, appRight);
  body.prepend(main);
  body.prepend(bodyTitle);

  console.log(answerText.toUpperCase());
}

createContent();
