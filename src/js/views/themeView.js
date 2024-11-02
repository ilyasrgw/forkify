class ThemeView {
  _parentElement = document.documentElement;
  _sliderBtn = document.querySelector('.slider__circle');

  setTheme(theme) {
    const isDarkTheme = theme === 'dark';
    // Toggle them classes
    document.documentElement.classList.toggle('dark-theme', isDarkTheme);
    document.documentElement.classList.toggle('light-theme', !isDarkTheme);

    this._sliderBtn.style.left = isDarkTheme ? '4.5rem' : '1rem';
  }
  addHandlerChangeTheme(handler) {
    document.querySelector('.slider').addEventListener('click', function () {
      const currentTheme = document.documentElement.classList.contains(
        'dark-theme'
      )
        ? 'dark'
        : 'light';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      handler(newTheme);
    });
  }
}

export default new ThemeView();
