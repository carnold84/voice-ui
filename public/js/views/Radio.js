const template = document.createElement('template');
template.innerHTML = `
  <div id="view-radio" class="view-wrapper hidden">
    <style>
      .radio-header {
        align-items: center;
        display: flex;
        flex-direction: column;
      }
      .radio-logo {
        background-image: url('img/triplej.svg');
        background-position: center center;
        background-repeat: no-repeat;
        background-size: 74% 74%;
        border-bottom: 1px solid #2b3b4d;
        height: 260px;
        margin: 0 0 20px;
        width: 100%;
      }
      .radio-logo svg {
        fill: #ffffff;
      }
      .radio-name {
        color: #788491;
        font-size: 16px;
        font-weight: 400px;
        margin: 0 0 5px;
      }
      .radio-title {
        color: #ffffff;
        font-size: 20px;
        font-weight: 400;
        margin: 0 0 10px;
      }
      .radio-controls {
        height: 100px;
        position: relative;
        width: 100%;
      }
      .radio-stop {
        align-items: center;
        border: 2px solid #ef4134;
        border-radius: 35px;
        display: flex;
        height: 60px;
        justify-content: center;
        left: calc(50% - 120px);
        margin: 0 5px 0 0;
        position: absolute;
        top: calc(50% - 30px);
        width: 60px;
      }
      .radio-stop svg {
        fill: #ef4134;
        height: 30px;
        width: 30px;
      }
      .radio-pause {
        left: calc(50% - 50px);
        position: absolute;
      }
      .radio-pause svg {
        fill: #ef4134;
        height: 100px;
        width: 100px;
      }
    </style>
    <header class="view-header">
      <button id="close-btn" class="close-btn">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          <path d="M0 0h24v24H0z" fill="none"/>
        </svg>
      </button>
    </header>
    <div class="view-content">
      <div class="radio-header">
        <div class="radio-logo"></div>
        <h3 class="radio-name">Triple J</h3>
        <h2 class="radio-title">Latest Music</h2>
        <div class="radio-controls">
          <div class="radio-stop">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path d="M0 0h24v24H0z" fill="none"/>
              <path d="M6 6h12v12H6z"/>
            </svg>
          </div>
          <div class="radio-pause">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path d="M0 0h24v24H0z" fill="none"/><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
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

    this.app.elContent.appendChild(content);
  }

  onClose () {
    this.app.selectView(null);
  }

  show () {
    this.elWrapper.classList.remove('hidden');
    this.elWrapper.offsetHeight;
    this.elWrapper.addEventListener('transitionend', this.onShowComplete);
    this.elWrapper.classList.add('transition-in');
  }

  onShowComplete () {
    this.elWrapper.classList.remove('transition-in');
    this.elWrapper.classList.add('shown');
    this.elWrapper.removeEventListener('transitionend', this.onShowComplete);
  }

  hide () {
    this.elWrapper.addEventListener('transitionend', this.onHideComplete);
    this.elWrapper.classList.remove('shown');
    this.elWrapper.classList.add('transition-out');
  }

  onHideComplete () {
    this.elWrapper.classList.add('hidden');
    this.elWrapper.classList.remove('transition-out');
    this.elWrapper.removeEventListener('transitionend', this.onHideComplete);
  }
}

export default Radio;
