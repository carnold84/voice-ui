const template = document.createElement('template');
template.innerHTML = `
  <div id="view-navigation" class="view-wrapper hidden">
    <style>
    </style>
    Navigation
    <button id="close-btn">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
        <path d="M0 0h24v24H0z" fill="none"/>
      </svg>
    </button>
  </div>
`;

class Navigation {
  constructor(App) {
    this.app = App;

    this.onClose = this.onClose.bind(this);
    this.onHideComplete = this.onHideComplete.bind(this);
    this.onShowComplete = this.onShowComplete.bind(this);

    // clone element
    const content = template.content.cloneNode(true);

    this.elWrapper = content.querySelector('#view-navigation');
    this.elCloseBtn = content.querySelector('#close-btn');
    this.elCloseBtn.addEventListener('click', this.onClose);

    this.app.elContent.appendChild(content);
  }

  onClose() {
    this.app.selectView(null);
  }

  show() {
    this.elWrapper.classList.remove('hidden');
    this.elWrapper.offsetHeight;
    this.elWrapper.addEventListener('transitionend', this.onShowComplete);
    this.elWrapper.classList.add('transition-in');
  }

  onShowComplete() {
    this.elWrapper.classList.remove('transition-in');
    this.elWrapper.classList.add('shown');
    this.elWrapper.removeEventListener('transitionend', this.onShowComplete);
  }

  hide() {
    this.elWrapper.addEventListener('transitionend', this.onHideComplete);
    this.elWrapper.classList.remove('shown');
    this.elWrapper.classList.add('transition-out');
  }

  onHideComplete() {
    this.elWrapper.classList.add('hidden');
    this.elWrapper.classList.remove('transition-out');
    this.elWrapper.removeEventListener('transitionend', this.onHideComplete);
  }
}

export default Navigation;
