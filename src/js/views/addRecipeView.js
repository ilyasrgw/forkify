import icons from 'url:../../img/icons.svg';

import View from './View.js';

class AddRecipeView extends View {
  _parentElement = document.querySelector('.upload');
  _message = 'Recipe was successfully uploaded';
  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');

  constructor() {
    super();
    this._addHandlerShowWindow();
    this.addHandlerHideWindow();
  }

  toggleWindow() {
    this._overlay.classList.toggle('hidden');
    this._window.classList.toggle('hidden');
  }

  resetModal() {
    // Clear any displayed messages and reset any flags
    this._parentElement.innerHTML = ''; // Reset the form content
    this.clearFormFields(); // Clear the form fields
  }

  _addHandlerShowWindow() {
    console.log('Show window handler added');
    this._btnOpen.addEventListener('click', this.toggleWindow.bind(this));
  }

  addHandlerHideWindow() {
    this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
    this._overlay.addEventListener('click', this.toggleWindow.bind(this));
  }

  addHandlerUpload(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      const dataArr = [...new FormData(this)];
      const data = Object.fromEntries(dataArr);
      handler(data);
    });
  }
  // clearFormFields() {
  //   console.log('clearFormFields called');

  //   if (this._parentElement instanceof HTMLFormElement) {
  //     this._parentElement.reset();
  //     console.log('Form reset using .reset()');
  //   } else {
  //     // Fallback: Manually clear each input field if .reset() doesn't work
  //     console.log('Manually clearing form fields');
  //     [...this._parentElement.elements].forEach(input => {
  //       if (input.type !== 'submit') input.value = '';
  //     });
  //   }
  // }

  _generateMarkup() {}
}

export default new AddRecipeView();
