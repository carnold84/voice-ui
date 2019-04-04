const template = document.createElement('template');
template.innerHTML = `
  <div id="view-radio" class="view-wrapper hidden">
    <style>
    </style>
    <header class="view-header">
      <h2>Radio</h2>
      <button id="close-btn">Close</button>
    </header>
  </div>
`;

class Radio {
  constructor(App) {
    this.app = App;

    this.onClose = this.onClose.bind(this);
    this.onHideComplete = this.onHideComplete.bind(this);
    this.onShowComplete = this.onShowComplete.bind(this);

    // clone element
    const content = template.content.cloneNode(true);

    this.elWrapper = content.querySelector('#view-radio');
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

export default Radio;
