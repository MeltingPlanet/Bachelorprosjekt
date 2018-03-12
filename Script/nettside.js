console.log(ambisonics);

// AUDIO CONTEXT & WEBKIT ##############################################################################
var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
var context = new AudioContext; //Initialiserer audio context

// SPECIFY FILTER URL ###################################################################################
var FilterUrl = "Filter/aalto2016_N1.wav";


// AMBISONICS ROTATION #################################################################################
var rotator = new ambisonics.sceneRotator(context, 1); // 1. orden (FOA)
console.log(rotator);


//AMBISONIC DECODER ####################################################################################
var binDecoder = new ambisonics.binDecoder(context, 1);
console.log(binDecoder);


//FuMa (b-format rekkefølge til ACN <--> WXYZ til WYZX) ################################################
var converterF2A = new ambisonics.converters.wxyz2acn(context);
console.log(converterF2A);

// MONO ENCODER #######################################################################################
var monoEncoder = new ambisonics.monoEncoder(context, 1);
console.log(monoEncoder);


// OUTPUT GAIN #########################################################################################
var gainOut = context.createGain();


//SIGNAL FLOW (FOA --> Rotering --> Bineaural --> Gain --> Destinasjon/ut) #############################
converterF2A.out.connect(rotator.in);
rotator.out.connect(binDecoder.in);
binDecoder.out.connect(context.destination);

monoEncoder.out.connect(rotator.in);


// LOAD SAMPLE #########################################################################################
function loadSample(url, doAfterLoading) {
    var fetchSound = new XMLHttpRequest(); // Load the Sound with XMLHttpRequest
    fetchSound.open("GET", url, true); // Path to Audio File
    fetchSound.responseType = "arraybuffer"; // Read as Binary Data
    fetchSound.onload = function() {
        context.decodeAudioData(fetchSound.response, doAfterLoading, onDecodeAudioDataError);
    }
    fetchSound.send(); //
}

// SAMPLE TO CONVOLUTION FILTER #################################################################
var assignSample2Filters = function(decodedBuffer) {
    binDecoder.updateFilters(decodedBuffer);
}

// LOAD SAMPLES #############################################################################

loadSample(FilterUrl, assignSample2Filters);


// MOBIL SENSOR ROTERING #############################################################################
var rotasjonSlider = document.getElementById("grader");
var initialOffset = null;

window.addEventListener("deviceorientation", function(event) {
    console.log(event.alpha);
    //var alpha = event.alpha;

    if(initialOffset === null && event.absolute !== true
        && +event.webkitCompassAccuracy > 0 && +event.webkitCompassAccuracy < 50) {
        initialOffset = event.webkitCompassHeading || 0;
        }
       
        var alpha = event.alpha - initialOffset;
        if(alpha < 0) {
        alpha += 360;
        }
       
        // Now use our derived world-based `alpha` instead of raw `evt.alpha` value

    rotasjonSlider.value = alpha;
    rotator.roll = rotasjonSlider.value;
    console.log(rotasjonSlider.value);
    rotator.updateRotMtx();
}, false);

// READY FUNCTION - PLAY STOP ############################################################################
$(document).ready(function() {

    for(var i = 1; i <=3; i ++){
        var audioElement = document.getElementById("audioElement" + i);
        console.log("audioElement" + i)
        audioElement.loop = true;
     
        var mediaElementSource = context.createMediaElementSource(audioElement);
        console.log(mediaElementSource);
        if(i <= 2){
          mediaElementSource.connect(converterF2A.in);
        }else{
          mediaElementSource.connect(monoEncoder.in);
        }
    };
});

// EXCEPTION ALERT ###########################################################################
function onDecodeAudioDataError(error) {
    var url = 'hjre';
  alert("Browser cannot decode audio data..." + "\n\nError: " + error + "\n\n(If you re using Safari and get a null error, this is most likely due to Apple's shady plan going on to stop the .ogg format from easing web developer's life :)");
}


/*#####################################################################
  _.,-----/=\-----,._ ##
 (__ ~~~"""""""~~~ __)##    '########:'########:::::'###:::::'######::'##::::'##:
  | ~~~"""""""""~~~ | ##    ... ##..:: ##.... ##:::'## ##:::'##... ##: ##:::: ##:
  | |  ; ,   , ;  | | ##    ::: ##:::: ##:::: ##::'##:. ##:: ##:::..:: ##:::: ##:
  | |  | |   | |  | | ##    ::: ##:::: ########::'##:::. ##:. ######:: #########:
  | |  | |   | |  | | ##    ::: ##:::: ##.. ##::: #########::..... ##: ##.... ##:
  | |  | |   | |  | | ##    ::: ##:::: ##::. ##:: ##.... ##:'##::: ##: ##:::: ##:
  | |  | |   | |  | | ##    ::: ##:::: ##:::. ##: ##:::: ##:. ######:: ##:::: ##:
  | |  | |   | |  | | ##    :::..:::::..:::::..::..:::::..:::......:::..:::::..::
  | |  | |   | |  | | ##
  |. \_| |   | |_/ .| ##
   `-,.__ ~~~ __.,-'  ##
         ~~~~~        ##
#######################################################################







#######################################################################
 */

