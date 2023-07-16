"use strict";

const read = document.querySelector(".count-read");
const notRead = document.querySelector(".count-not-read");
const btnAddBook = document.querySelector(".btn--add-new-book");
const formUpload = document.querySelector(".upload");
const btnCloseModal = document.querySelector(".btn--close-modal");
const inputs = document.querySelectorAll("input");
const overlay = document.querySelector(".overlay");
const modal = document.querySelector(".add-book-window");
const results = document.querySelector(".results");

let myLibrary = [];

// Constructor object
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

const toggleHidden = function () {
  // Hide module
  [overlay, modal].forEach((x) => x.classList.toggle("hidden"));

  // Clear input
  Array.from(inputs).forEach((input) => {
    if (input.type === "checkbox") input.checked = false;
    else input.value = "";
  });
};

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

  const [readDisplay, notReadDisplay] = [read, notRead].map((el) =>
    el.querySelector("p")
  );

  readDisplay.textContent = readNum;
  notReadDisplay.textContent = notReadNum;
};

const persistMyLibrary = function () {
  localStorage.setItem("myLibrary", JSON.stringify(myLibrary));
};

const clearMyLibrary = function () {
  localStorage.clear("myLibrary");
};
// clearMyLibrary();

const uploadLocalStorage = function () {
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

const init = function () {
  uploadLocalStorage();

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
