import icons from 'url:../../img/icons.svg';

import View from './View.js';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;
      console.log(btn);
      const goToPage = +btn.dataset.goto;
      console.log(goToPage);
      handler(goToPage);
    });
  }

  _generateMarkup() {
    const curPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    console.log(numPages);

    if (numPages === 1) return '';

    // Create page buttons with ellipses for long page lists
    const pageNumbers = this._generatePageNumbers(curPage, numPages);
    const prevButton =
      curPage > 1 ? this._createButton(curPage - 1, 'prev') : '';
    const nextButton =
      curPage < numPages ? this._createButton(curPage + 1, 'next') : '';

    return `
    ${prevButton}
    ${pageNumbers.map(page => this._createPageMarkup(page, curPage)).join('')}
    ${nextButton}
    `;
  }

  _generatePageNumbers(curPage, numPages) {
    const pages = [];
    if (numPages <= 5) {
      for (let i = 1; i <= numPages; i++) pages.push(i);
    } else {
      if (curPage <= 3) {
        pages.push(1, 2, 3, '...', numPages);
      } else if (curPage > 3 && curPage < numPages - 2) {
        pages.push(
          1,
          '...',
          curPage - 1,
          curPage,
          curPage + 1,
          '...',
          numPages
        );
      } else {
        pages.push(1, '...', numPages - 2, numPages - 1, numPages);
      }
    }
    return pages;
  }

  _createButton(page, type) {
    return `
        <button data-goto="${page}" class="btn--inline pagination__btn--${type}">
        ${type === 'prev' ? 'Previous' : 'Next'}
      </button>
      `;
  }

  _createPageMarkup(page, curPage) {
    return page === '...'
      ? `<span class="pagination__ellipsis">...</span>`
      : `<button data-goto="${page}" class="btn--inline pagination__page ${
          page === curPage ? 'pagination__page--active' : ''
        }">${page}</button>`;
  }
}

export default new PaginationView();
