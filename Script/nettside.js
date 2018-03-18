console.log(ambisonics);

// AUDIO CONTEXT & WEBKIT ##############################################################################
var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
var context = new AudioContext; //Initialiserer audio context

// SPECIFY FILTER URL ###################################################################################
var FilterUrl = "Filter/aalto2016_N1.wav";


// AMBISONICS ROTATION #################################################################################

var rotator1 = new ambisonics.sceneRotator(context, 1); // 1. orden (FOA)
var rotator2 = new ambisonics.sceneRotator(context, 1); // 1. orden (FOA)
var rotatorMono = new ambisonics.sceneRotator(context, 1); // 1. orden (FOA)

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
converterF2A.out.connect(rotator1.in);
rotator1.out.connect(binDecoder.in);
rotator2.out.connect(binDecoder.in);
binDecoder.out.connect(context.destination);


monoEncoder.out.connect(converterF2A.in);
converterF2A.out.connect(rotatorMono.in);
rotatorMono.out.connect(binDecoder.in);


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

//########################### AJAX med JSON #############################
var select = document.getElementById("audioFile");
var lydvalg = document.getElementById("lydvalg");


select.addEventListener("input", function(){
    //console.log(select.value);
    var ourRequest = new XMLHttpRequest();
    ourRequest.open('GET', 'JSON/Lydfiler.json');
    ourRequest.onload = function(){
        var lydfil = JSON.parse(ourRequest.responseText);
        changeAudio(lydfil);
}
if(select.value != "notselect"){
  ourRequest.send(); 
} 
});

function changeAudio(lydfil){
  var divElement = document.createElement("div");
  var audioElement = document.createElement("AUDIO");
  var inputCheckbox = document.createElement("input");
  var inputGrader = document.createElement("input");  


  if(document.getElementById("audioElement" + select.value)==null){

    // Div for audiospor #########################################
    divElement.setAttribute("class", "audio");
    lydvalg.appendChild(divElement);

    // AUDIO ######################################################
    audioElement.setAttribute('controls', 'controls');
    audioElement.setAttribute('id', lydfil[0].id[select.value]);
    audioElement.setAttribute('controlsList', 'nodownload');
    audioElement.setAttribute("loop", "true");

    var source = document.createElement("source");

    source.setAttribute('src', lydfil[0].src[select.value]);
    source.setAttribute('type', "audio/wav");

    audioElement.appendChild(source);

    divElement.appendChild(audioElement);

    // Checkbox ###################################################
    /*
    inputCheckbox.setAttribute("id", lydfil[1].id[select.value]);
    inputCheckbox.setAttribute("type", "checkbox")

    divElement.appendChild(inputCheckbox);
    */
    // Gradeslider ################################################
    inputGrader.setAttribute("id", lydfil[2].id[select.value]);
    inputGrader.setAttribute("type", "range");
    inputGrader.setAttribute("min", "0");
    inputGrader.setAttribute("max", "360");
    inputGrader.setAttribute("step", "10");

    divElement.appendChild(inputGrader);

    console.log(audioElement);

    //  kobler audioelement til converter eller monoencoder 
    var audioElement = document.getElementById("audioElement" + select.value);
 
    var mediaElementSource = context.createMediaElementSource(audioElement);
    console.log(mediaElementSource);

    if(select.value <= 1){
    mediaElementSource.connect(converterF2A.in);
    }else{
    mediaElementSource.connect(monoEncoder.in);
    }
  }
}

var checkbox0 = document.getElementById("checkBox0");
var checkbox1 = document.getElementById("checkBox1");
var checkbox2 = document.getElementById("checkBox2");

// MOBIL SENSOR ROTERING #############################################################################

lydvalg.addEventListener("click", function(){
  window.addEventListener("deviceorientation", function(){
      var alpha = event.alpha;
      if(alpha < 0) {
        alpha += 360;
      }
      if(checkbox0.checked == true){
        console.log("checkbox1: " + checkbox0.checked);
        var rotasjonSlider1 = document.getElementById("grader0");
        rotasjonSlider1.value = alpha;
        rotator1.roll = alpha;
        console.log(alpha);
        rotator1.updateRotMtx();
      }
      if(checkbox1.checked == true){
        console.log("checkbox2: " + checkbox1.checked);
        var rotasjonSlider2 = document.getElementById("grader1");
        rotasjonSlider2.value = alpha;
        rotator2.roll = alpha;
        console.log(alpha);
        rotator2.updateRotMtx();
      }
      if(checkbox2.checked == true){
        console.log("checkbox3: " + checkbox2.checked);
        var rotasjonSlider3 = document.getElementById("grader2");
        rotasjonSlider3.value = alpha;
        rotatorMono.roll = alpha;
        console.log(alpha);
        rotatorMono.updateRotMtx();
      }
  });
});
// READY FUNCTION - PLAY STOP ############################################################################


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

    /*
    if(initialOffset === null && event.absolute !== true
        && +event.webkitCompassAccuracy > 0 && +event.webkitCompassAccuracy < 50) {
        initialOffset = event.webkitCompassHeading || 0;
        }
       
        var alpha = event.alpha - initialOffset;
    */

/*for(var i = 1; i <=3; i ++){
    var audioElement = document.getElementById("audioElement" + select.value);

    audioElement.loop = true;
 
    var mediaElementSource = context.createMediaElementSource(audioElement);
    console.log(mediaElementSource);
    if(i <= 2){
    mediaElementSource.connect(converterF2A.in);
    }else{
    mediaElementSource.connect(monoEncoder.in);
    }
};*/



//#######################################################################
 

