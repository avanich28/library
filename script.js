"use strict";

const btnAddBook = document.querySelector(".btn--add-new-book");
const btnCloseModal = document.querySelector(".btn--close-modal");
const btnSubmit = document.querySelector(".btn--submit-form");
const btnStatus = document.getElementsByClassName("btn--status"); // HTML Collection
const overlay = document.querySelector(".overlay");
const modal = document.querySelector(".add-book-window");

let myLibrary = [];

// Constructor Obj
function Book(title, author, pages, status) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.status = status;
}

Book.prototype.info = function () {
  return `The ${this.title} by ${this.author}, ${this.pages}, not read yet`;
};

function addBookToLibrary(e) {
  e.preventDefault();
  const input = new Book();
  myLibrary.push();
}

btnSubmit.addEventListener("click", (e) => {});

const handleToggle = function () {
  [overlay, modal].forEach((x) => x.classList.toggle("hidden"));
};

[btnAddBook, btnCloseModal, overlay].forEach((btn) =>
  btn.addEventListener("click", handleToggle)
);

Array.from(btnStatus).forEach((x) =>
  x.addEventListener("click", (e) => {
    const target = e.target;
    target.classList.toggle("btn--status-read");
    target.classList.toggle("btn--status-unread");
    target.textContent = target.textContent === "Read" ? "Not Read" : "Read";
  })
);
