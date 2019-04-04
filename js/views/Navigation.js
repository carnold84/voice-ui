const template = document.createElement('template');
template.innerHTML = `
  <div id="view-navigation" class="view-wrapper hidden">
    <style>
    </style>
    Navigation
    <button id="close-btn">Close</button>
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

    this.app.elRoot.appendChild(content);
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
