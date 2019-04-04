import Radio from './views/Radio.js';
import Navigation from './views/Navigation.js';

const template = document.createElement('template');
template.innerHTML = `
  <div id="app" class="app">
    <style>
      .app {
        display: flex;
        flex-wrap: wrap;
        font-size: 2.5em;
        height: 100%;
        position: absolute;
        width: 100%;
      }

      .select-btn {
        align-items: center;
        background-color: #ffffff;
        border: 1px solid #eeeeee;
        color: #222222;
        display: flex;
        flex-direction: column;
        font-size: 52px;
        font-weight: 100;
        height: 50%;
        justify-content: center;
        text-decoration: none;
        width: 50%;
      }

      .select-btn .icon {
        margin: 0 0 10px;
      }

      .select-btn .label {
        pointer-events: none;
      }
    </style>
    <button class="select-btn" data-id="radio">
    <!--<span class="icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24">
          <path d="M3.24 6.15C2.51 6.43 2 7.17 2 8v12c0 1.1.89 2 2 2h16c1.11 0 2-.9 2-2V8c0-1.11-.89-2-2-2H8.3l8.26-3.34L15.88 1 3.24 6.15zM7 20c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm13-8h-2v-2h-2v2H4V8h16v4z"/>
          <path d="M0 0h24v24H0z" fill="none"/>
        </svg>
      </span>-->
      <span class="label">Radio</span>
    </button>
    <button class="select-btn" data-id="navigation">
    <!--<span class="icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24">
          <path d="M0 0h24v24H0z" fill="none"/>
          <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"/>
        </svg>
      </span>-->
      <span class="label">Navigation</span>
    </button>
    <button class="select-btn" data-id="audiobooks">
    <!--<span class="icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24">
          <path d="M0 0h24v24H0z" fill="none"/>
          <path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z"/>
        </svg>
      </span>-->
      <span class="label">Audiobooks</span>
    </button>
  </div>
`;

class App {
  constructor() {
    this.onSpeechResult = this.onSpeechResult.bind(this);
    this.onViewSelect = this.onViewSelect.bind(this);

    this.elRoot = document.querySelector('#root');
    // clone element
    const content = template.content.cloneNode(true);

    this.elApp = content.querySelector('#app');
    this.elRoot.appendChild(content);

    const buttons = this.elApp.querySelectorAll('.select-btn');
    buttons.forEach(button => {
      button.addEventListener('click', this.onViewSelect);
    });

    this.views = {
      radio: new Radio(this),
      navigation: new Navigation(this),
    };

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const SpeechGrammarList = window.SpeechGrammarList || window.webkitSpeechGrammarList;
    const SpeechRecognitionEvent = window.SpeechRecognitionEvent || window.webkitSpeechRecognitionEvent;

    if (SpeechRecognition && SpeechGrammarList && SpeechRecognitionEvent) {
      const commands = ['close', 'radio', 'navigation', 'audiobooks'];
      const grammar = '#JSGF V1.0; grammar commands; public <command> = ' + commands.join(' | ') + ' ;';
      const recognition = new SpeechRecognition();
      const speechRecognitionList = new SpeechGrammarList();

      speechRecognitionList.addFromString(grammar, 1);

      recognition.grammars = speechRecognitionList;
      //recognition.continuous = true;
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.addEventListener('result', this.onSpeechResult);

      //recognition.start();
    }

    console.log(SpeechRecognition, SpeechGrammarList, SpeechRecognitionEvent);

    this.state = {
      currentView: null,
    };
  }

  onSpeechResult(event) {
    const {currentView} = this.state;

    var last = event.results.length - 1;
    var command = event.results[last][0].transcript;
    console.log('Command: ' + command);

    if (command === 'close' && currentView !== null) {
      this.selectView(null);
    } else {
      this.selectView(command);
    }

    console.log('Confidence: ' + event.results[0][0].confidence);
  }

  selectView(view) {
    let {currentView} = this.state;

    console.log(currentView);

    if (currentView !== null) {
      this.views[currentView].hide();
    }

    if (view !== null) {
      this.views[view].show();
    }

    this.state.currentView = view;
  }

  onViewSelect(evt) {
    const id = evt.target.getAttribute('data-id');
    console.log(id);
    this.selectView(id);
  }
}

export default App;
