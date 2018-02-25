console.log(ambisonics);

//Setter opp audio context og variabler
//webkit for safari og eldre versjoner av chrome

var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
var context = new AudioContext; //Initialiserer audio context

var soundUrl = "Lyder/wxyz3.wav";
var FilterUrl = "Filter/aalto2016_N1.wav";

var soundBuffer, sound;

// ambisonics rotasjon
var rotator = new ambisonics.sceneRotator(context, 1); // 1. orden (FOA)
console.log(rotator);

//ambisonic decoder
var binDecoder = new ambisonics.binDecoder(context, 1);
console.log(binDecoder);

//FuMa (b-format rekkefølge til ACN <--> WXYZ til WYZX)
var converterF2A = new ambisonics.converters.wxyz2acn(context);
console.log(converterF2A);

// output gain
var gainOut = context.createGain();

//Signalgang-kobling (FOA --> Rotering --> Bineaural --> Gain --> Destinasjon/ut)
converterF2A.out.connect(rotator.in);
rotator.out.connect(binDecoder.in);
binDecoder.out.connect(gainOut);
gainOut.connect(context.destination);

// function to load samples
function loadSample(url, doAfterLoading) {
    var fetchSound = new XMLHttpRequest(); // Load the Sound with XMLHttpRequest, objekt som henter data fra server uten å refreshe siden (som messenger på facebook)
    fetchSound.open("GET", url, true); // Path to Audio File, initialiserer request
    fetchSound.responseType = "arraybuffer"; // Read as Binary Data
    fetchSound.onload = function() { // onload <- event handler
        context.decodeAudioData(fetchSound.response, doAfterLoading, onDecodeAudioDataError);
    }
    fetchSound.send(); //asynkron request sendes
}

// function to load samples
function loadSample(url, doAfterLoading) {
    var fetchSound = new XMLHttpRequest(); // Load the Sound with XMLHttpRequest
    fetchSound.open("GET", url, true); // Path to Audio File
    fetchSound.responseType = "arraybuffer"; // Read as Binary Data
    fetchSound.onload = function() {
        context.decodeAudioData(fetchSound.response, doAfterLoading, onDecodeAudioDataError);
    }
    fetchSound.send(); //
}
// function to assign sample to the sound buffer for playback (and enable playbutton)
var assignSample2SoundBuffer = function(decodedBuffer) {
        soundBuffer = decodedBuffer;
        document.getElementById('play').disabled = false;
    }
    // function to assign sample to the filter buffers for convolution
var assignSample2Filters = function(decodedBuffer) {
    binDecoder.updateFilters(decodedBuffer);
}
// function to change sample from select box
function changeSample() {
    document.getElementById('play').disabled = true;
    document.getElementById('stop').disabled = true;
    soundUrl = document.getElementById("sample_no").value;
    if (typeof sound != 'undefined' && sound.isPlaying) {
        sound.stop(0);
        sound.isPlaying = false;
    }
    loadSample(soundUrl, assignSample2SoundBuffer);
}

// load and assign samples
loadSample(soundUrl, assignSample2SoundBuffer);
loadSample(FilterUrl, assignSample2Filters);

$(document).ready(function() {

    // Init event listeners
    document.getElementById('play').addEventListener('click', function() {
        sound = context.createBufferSource();
        sound.buffer = soundBuffer;
        sound.loop = true;
        sound.connect(converterF2A.in);
        sound.start(0);
        sound.isPlaying = true;
        document.getElementById('play').disabled = true;
        document.getElementById('stop').disabled = false;
    });
    document.getElementById('stop').addEventListener('click', function() {
        sound.stop(0);
        sound.isPlaying = false;
        document.getElementById('play').disabled = false;
        document.getElementById('stop').disabled = true;
    });

    var volumeSlider = document.getElementById('volume-slider');
    volumeSlider.addEventListener('input', function(input) {
        gainOut.gain.value = volumeSlider.value;
    });

});

// function called when audiocontext.decodeAudioData fails to decode a given audio file, e.g. in Safari with .ogg vorbis format
function onDecodeAudioDataError(error) {
    var url = 'hjre';
  alert("Browser cannot decode audio data..." + "\n\nError: " + error + "\n\n(If you re using Safari and get a null error, this is most likely due to Apple's shady plan going on to stop the .ogg format from easing web developer's life :)");
}
