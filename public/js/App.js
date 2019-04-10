import Radio from './views/Radio.js';
import Navigation from './views/Navigation.js';

const template = document.createElement('template');
template.innerHTML = `
  <div id="app" class="app">
    <div id="app-content" class="app-content">
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
        <span class="label">Music</span>
      </button>
      <button class="select-btn" data-id="audiobooks">
      <!--<span class="icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24">
            <path d="M0 0h24v24H0z" fill="none"/>
            <path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z"/>
          </svg>
        </span>-->
        <span class="label">Podcasts</span>
      </button>
    </div>
    <div class="app-bar">
      <button class="activate-btn">
        <svg class="start" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
          <path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"/>
          <path d="M0 0h24v24H0z" fill="none"/>
        </svg>
        <svg class="stop" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
          <path d="M0 0h24v24H0z" fill="none"/>
          <path d="M6 6h12v12H6z"/>
        </svg>
      </button>
    </div>
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
    this.elContent = document.querySelector('#app-content');

    const buttons = this.elApp.querySelectorAll('.select-btn');
    buttons.forEach(button => {
      button.addEventListener('click', this.onViewSelect);
    });

    this.elActivateBtn = this.elApp.querySelector('.activate-btn');

    this.views = {
      radio: new Radio(this),
      navigation: new Navigation(this),
    };

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const SpeechGrammarList = window.SpeechGrammarList || window.webkitSpeechGrammarList;
    const SpeechRecognitionEvent = window.SpeechRecognitionEvent || window.webkitSpeechRecognitionEvent;

    if (SpeechRecognition && SpeechGrammarList && SpeechRecognitionEvent) {
      this.commands = ['audiobooks', 'close', 'navigation', 'radio', 'stop'];
      const grammar = '#JSGF V1.0; grammar commands; public <command> = ' + this.commands.join(' | ') + ' ;';
      this.recognition = new SpeechRecognition();
      const speechRecognitionList = new SpeechGrammarList();

      speechRecognitionList.addFromString(grammar, 1);

      this.recognition.grammars = speechRecognitionList;
      this.recognition.continuous = true;
      this.recognition.lang = 'en-US';
      this.recognition.interimResults = false;
      this.recognition.maxAlternatives = 1;

      this.elActivateBtn.classList.add('show');
      this.elActivateBtn.addEventListener('click', this.onActivateSpeech.bind(this));

      this.recognition.addEventListener('result', this.onSpeechResult);
    }

    console.log(SpeechRecognition, SpeechGrammarList, SpeechRecognitionEvent);

    this.state = {
      currentView: null,
      isListening: false,
    };
  }

  onActivateSpeech (event) {
    if (this.state.isListening) {
      this.stop();
    } else {
      this.start();
    }
  }

  stop () {
    this.recognition.stop();
    this.elActivateBtn.classList.remove('is-listening');
    this.state.isListening = false;
  }

  start () {
    this.recognition.start();
    this.elActivateBtn.classList.add('is-listening');
    this.state.isListening = true;
  }

  onSpeechResult (event) {
    const { currentView } = this.state;

    console.log('Confidence: ' + event.results[0][0].confidence);

    const last = event.results.length - 1;
    const command = event.results[last][0].transcript.trim();

    console.log('Command: "' + command + '"', 'currentView: ' + currentView);
    console.log(this.commands.includes(command));

    if (this.commands.includes(command)) {
      if (command === 'close' && currentView !== null) {
        console.log('CLOSE');
        this.selectView(null);
      } else if (command === 'stop') {
        this.stop();
      } else {
        this.selectView(command);
      }
    }
  }

  selectView (view) {
    let { currentView } = this.state;

    console.log(currentView);

    if (currentView !== null) {
      this.views[currentView].hide();
    }

    if (view !== null) {
      this.views[view].show();
    }

    this.state.currentView = view;
  }

  onViewSelect (evt) {
    const id = evt.target.getAttribute('data-id');
    console.log(id);
    this.selectView(id);
  }
}

export default App;
