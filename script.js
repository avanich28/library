"use strict";

const readElement = document.querySelector(".count-read");
const notReadElement = document.querySelector(".count-not-read");
const btnAddBook = document.querySelector(".btn--add-new-book");
const formUpload = document.querySelector(".upload");
const btnCloseModal = document.querySelector(".btn--close-modal");
const inputs = document.querySelectorAll("input");
const errors = document.querySelectorAll(".error");
const overlay = document.querySelector(".overlay");
const modal = document.querySelector(".add-book-window");
const results = document.querySelector(".results");

// Contain instances
let myLibrary = [];

// Class
function Book(title, author, pages, status) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.status = status;
}

Book.prototype.toggleStatus = function () {
  const toggle = this.status === "read" ? "not read" : "read";
  this.status = toggle;
  return toggle;
};

// 1) View
const renderError = function (type, errIndex, match) {
  const msgErrText = "Please enter between 1 and 20 characters";
  const msgErrPages = "Please enter a number between 1 and 10,000 ";

  if (match) errors[errIndex].textContent = "";
  else if (!match && type === "pages")
    errors[errIndex].textContent = msgErrPages;
  else if (!match && (type === "title" || type === "author"))
    errors[errIndex].textContent = msgErrText;
};

const renderCard = function (data) {
  // Create card
  const markup = `
    <li class="card" data-index="${myLibrary.length - 1}">
      <div class="detail">
        <div class="first-column">
          <div>Title:</div>
          <div>Author:</div>
          <div>Pages:</div>
        </div>
        <div class="second-column">
          <div>${data.title}</div>
          <div>${data.author}</div>
          <div>${data.pages}</div>
        </div>
      </div>
      <button class="btn--status btn--status-${
        data.status === "read" ? "read" : "unread"
      }">${data.status[0].toUpperCase() + data.status.slice(1)}</button>
      <button class="btn--remove">Remove</button>
    </li>`;

  // Display card
  results.insertAdjacentHTML("afterbegin", markup);
};

const renderNumber = function (readNum, notReadNum) {
  const [readDisplay, notReadDisplay] = [readElement, notReadElement].map(
    (el) => el.querySelector("p")
  );

  readDisplay.textContent = readNum;
  notReadDisplay.textContent = notReadNum;
};

const toggleHidden = function () {
  // Hide module
  [overlay, modal].forEach((x) => x.classList.toggle("hidden"));

  // Clear input
  Array.from(inputs).forEach((input) => {
    if (input.type === "checkbox") input.checked = false;
    else input.value = "";
  });

  // Clear Error message
  Array.from(errors).forEach((err) => err.textContent = "");
};

// 2) Model
const getResultRegEx = (check) => (check ? true : false);

const checkInput = function (type, value) {
  const regExText = /^[a-zA-Z0-9_\s\.\-]{1,20}$/;
  const regExPages = /^[0-9]{1,5}$/;

  if (type === "pages") return getResultRegEx(value.match(regExPages));
  else return getResultRegEx(value.match(regExText));
};

function addBookToLibrary(dataArr) {
  // Get value from data
  const dataValue = dataArr.map((entry) => entry[1]);
  // BUG
  dataValue[3] =
    dataValue[3] === "on" || dataValue[3] === "read" ? "read" : "not read"; // change status value

  // Convert data to object
  const data = new Book(...dataValue);

  // Add data to myLibrary array
  myLibrary.push(data);
}

const getIndex = function (el) {
  return +el.closest(".card").dataset.index;
};

const convertToCapital = function (str) {
  return str
    .split(" ")
    .map((char) => char[0].toUpperCase() + char.slice(1))
    .join(" ");
};

const countStatus = function () {
  const readNum = myLibrary.filter((book) => book.status === "read").length;
  const notReadNum = myLibrary.length - readNum;

  renderNumber(readNum, notReadNum);
};

const persistMyLibrary = function () {
  localStorage.setItem("myLibrary", JSON.stringify(myLibrary));
};

const clearMyLibrary = function () {
  localStorage.clear("myLibrary");
};
// clearMyLibrary();

// 3) Controller
const controlLocalStorage = function () {
  // Fetch data from localStorage
  const storage = localStorage.getItem("myLibrary");

  if (storage) {
    const allData = JSON.parse(storage).map((book) => Object.entries(book));

    allData.forEach((arr) => {
      addBookToLibrary(arr);
      renderCard(myLibrary.slice(0).pop());
    });
  }

  countStatus();
};

const controlStatus = function (e) {
  const btn = e.target.closest(".btn--status");
  if (!btn) return;

  btn.classList.toggle("btn--status-unread");
  btn.classList.toggle("btn--status-read");

  // Change status
  const status = myLibrary[getIndex(btn)].toggleStatus();
  btn.textContent = convertToCapital(status);

  // Update counting
  countStatus();

  // Update localStorage
  persistMyLibrary();
};

const controlRemoveCard = function (e, resultsElement) {
  const btn = e.target.closest(".btn--remove");
  if (!btn) return;

  // Delete obj in myLibrary
  myLibrary.splice(getIndex(btn), 1);

  // Remove element on display
  const card = btn.closest(".card");
  resultsElement.removeChild(card);

  // Reset data-index attribute
  Array.from(resultsElement.querySelectorAll(".card"))
    .reverse()
    .forEach((el, i) => (el.dataset.index = i));

  // Update counting
  countStatus();

  // Update localStorage
  persistMyLibrary();
};

const controlError = function (e) {
  const target = e.target;
  const match = checkInput(target.id, target.value);
  renderError(e.target.id, +target.dataset.err, match);
};

const controlForm = function (e) {
  e.preventDefault();
  // Get data
  const dataArr = [...new FormData(this)]; // this = e.target

  // Add new book
  addBookToLibrary(dataArr);

  // Render card
  renderCard(myLibrary.slice(0).pop());

  // Update counting
  countStatus();

  // Close module
  toggleHidden();

  // Update localStorage
  persistMyLibrary();
};

// Start
const init = function () {
  controlLocalStorage();

  Array.from(inputs)
    .slice(0, 3)
    .forEach((input) => input.addEventListener("input", controlError));

  formUpload.addEventListener("submit", controlForm);

  [btnAddBook, btnCloseModal, overlay].forEach((btn) =>
    btn.addEventListener("click", toggleHidden)
  );

  results.addEventListener("click", function (e) {
    controlStatus(e);
    controlRemoveCard(e, this);
  });
};
init();
