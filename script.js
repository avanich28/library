"use strict";

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
