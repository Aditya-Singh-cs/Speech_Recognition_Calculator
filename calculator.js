class Calculator {
    constructor() {
        this.statement = '';
        this.result = '0'; // Initialize the result to '0'
        this.voiceStart = false;
    }

    update(val) {
        if (val === 'AC') {
            this.clearStatement(); // Call the clearStatement function when 'AC' is pressed
            this.result = '0'; // Reset the result to '0'
        } else if (this.result !== '0') {
            // If the result is not '0', start a new statement
            this.statement = val;
            this.result = '0';
        } else {
            this.statement += val;
        }
        document.getElementById('statement').innerHTML = this.statement;
        document.getElementById('result').innerHTML = this.result; // Update the result on the display
    }

    clearStatement() {
        this.statement = '';
        document.getElementById('statement').innerHTML = '';
    }

    awnswer() {
        this.result = eval(this.statement);
        document.getElementById('result').innerHTML = this.result;
        if (this.voiceStart) 
            this.speak();
    }

    remove() {
        this.statement = this.statement.slice(0, this.statement.length - 1);
        document.getElementById('statement').innerHTML = this.statement;
    }

    voice(val) {
        this.voiceStart = val;
    }

    speak() {
        // Set the text and voice attributes.
        const speech = new SpeechSynthesisUtterance();
        speech.text = `The answer is ${this.result}.`;
        speech.volume = 1;
        speech.rate = 1;
        speech.pitch = 1;
        window.speechSynthesis.speak(speech);
    }
}


let calc = new Calculator();
let SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition = new SpeechRecognition();

// Function call on load
function onload() {
    let btnMarkup = [];
    ['AC', 'DEL', '%', '/', 7, 8, 9, '*', 4, 5, 6, '-', 1, 2, 3, '+', 0, '.', '='].forEach(val => {
        btnMarkup.push(`<button>${val}</button>`);
    })
    document.getElementById('btns').innerHTML = btnMarkup.join('');
}
onload();

document.addEventListener('click', function (val) {
    let target;
    target = val['target']['tagName'].toLowerCase();
    if (target === 'button') {
        if (val['target']['innerHTML'] === '=') {
            calc.awnswer();
        } else if (val['target']['innerHTML'] === 'DEL') {
            calc.remove();
        } else {
            calc.update(val['target']['innerHTML']);
        }
    }
});

recognition.continuous = true;
recognition.onresult = function (e) {
    const transcript = Array.from(e.results).map(result => result[0]).map(result => result.transcript).join('');
    if (e.results[0].isFinal) {
        splitVoice(transcript);
        if (transcript.includes('equal') || transcript.includes('equals to')) {
            calc.awnswer();
        }
    }
};


function toggle() {
    console.log(document.getElementById('checkbox').checked);
    if (document.getElementById('checkbox').checked) {
        recognition.start();
        calc.voice(true);
    } else {
        recognition.stop();
        calc.voice(false);
    }
}

function splitVoice(val) {
    let actualval = val.replace('multi', '*')
        .replace('div', '/')
        .replace('add', '+')
        .replace('min', '-')
        .replace('max', '*')
        .replace('x', '*')
        .replace(/ /g, '')
        .match(/\d|\+|\-|\*|\./g).join('');
    calc.update(actualval);
}
