console.log(ambisonics);

// AUDIO CONTEXT & WEBKIT ##############################################################################
var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
var context = new AudioContext; //Initialiserer audio context

// SPECIFY FILTER URL ###################################################################################
var FilterUrl = "Filter/aalto2016_N1.wav";


// AMBISONICS ROTATION #################################################################################

var rotator = new ambisonics.sceneRotator(context, 1); // 1. orden (FOA)

//AMBISONIC DECODER ####################################################################################
var binDecoder = new ambisonics.binDecoder(context, 1);
console.log(binDecoder);

//ANALYZER 2D ##########################################################################################
var analyser = new ambisonics.intensityAnalyser(context);
console.log(analyser);
//FuMa (b-format rekkefølge til ACN <--> WXYZ til WYZX) ################################################
var converterF2A = new ambisonics.converters.wxyz2acn(context);
console.log(converterF2A);

// MONO ENCODER #######################################################################################
var MonoAzim = 0;
var MonoElev = 0;
var monoEncoder = new ambisonics.monoEncoder(context, 1, MonoAzim, MonoElev);
console.log(monoEncoder);

// OUTPUT GAIN #########################################################################################
var gainOut = context.createGain();


//SIGNAL FLOW (FOA --> Rotering --> Bineaural --> Gain --> Destinasjon/ut) #############################
converterF2A.out.connect(rotator.in);
rotator.out.connect(binDecoder.in);
converterF2A.out.connect(analyser.in);
binDecoder.out.connect(context.destination);
monoEncoder.out.connect(converterF2A.in);


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


  if(document.getElementById("audioElement" + select.value)==null){

    // Div for audiospor #########################################
    divElement.setAttribute("class", "audio");
    lydvalg.appendChild(divElement);

    // AUDIO ######################################################
    audioElement.setAttribute('controls', 'controls');
    audioElement.setAttribute('id', lydfil[0].id[select.value]);
    audioElement.setAttribute('controlsList', 'nodownload');
    audioElement.setAttribute("loop", "true");
    audioElement.volume = 0.5;

    var source = document.createElement("source");

    source.setAttribute('src', lydfil[0].src[select.value]);
    source.setAttribute('type', "audio/wav");

    audioElement.appendChild(source);

    divElement.appendChild(audioElement);

    // Gradeslider ################################################

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

var checkbox = document.getElementById("checkBox");

// MOBIL SENSOR ROTERING #############################################################################

lydvalg.addEventListener("click", function(){
  window.addEventListener("deviceorientation", function(){
      var alpha = event.alpha;
      if(alpha < 0) {
        alpha += 360;
      }
      if(checkbox.checked == true){
        console.log("checkbox: " + checkbox.checked);
        var rotasjonSlider = document.getElementById("Slider");
        rotasjonSlider.value = alpha;
        rotator.roll = alpha;
        console.log(alpha);
        rotator.updateRotMtx();
      };
  });
});
// READY FUNCTION - PLAY STOP ############################################################################

// AUDIO VISUALIZATION #######################################################################
// 
function drawLocal() {
    // Update audio analyser buffers
    analyser.updateBuffers();
    var params = analyser.computeIntensity();
    updateCircles(params, canvas2);
    console.log(params);
}


var mapSprite = new Image(820, 412);
mapSprite.src = "Bilder/map.png";


var canvas2 = document.getElementById('Canvas2');
var canvas2_context = canvas2.getContext("2d");
var circles = [];
var numCircleLim = 100;
var opacityLim = 0.2;

function Circle(xPos, yPos, radius, opacity) {
    this.xPos = xPos;
    this.yPos = yPos;
    this.radius = radius;
    this.opacity = opacity;
}
Circle.prototype.draw = function(context) {
    this.XPos = (document.getElementById('Canvas2').width / 2) - this.Width/2;
    this.YPos = (document.getElementById('Canvas2').height / 2) - this.Width/2;
    context.beginPath();
    context.arc(this.xPos, this.yPos, this.radius, 0, Math.PI * 2, false);
    context.closePath();

    context.fillStyle = 'rgba(185, 211, 238,' + this.opacity + ')';
    // context.fillStyle = 'rgba(255, 102, 51,' + this.opacity + ')';
    context.fill();
};

function angles2pixels(azim, elev, cnv) {
    var rect = cnv.getBoundingClientRect();
    var xy = [];
    xy[0] = Math.round(-azim*rect.width/360 + rect.width/2);
    xy[1] = Math.round(rect.height/2 - elev*rect.height/180);
    return xy;
}
function updateCircles(params, cnv) {
    var xy = angles2pixels(params[0], params[1], cnv);
    var radius = 30*(1-params[2]);
    var opacity = 1;

    if (circles.length<numCircleLim) {
        var circle = new Circle(xy[0], xy[1], radius, opacity);
        circles.push(circle);
    }
    else {
        var circle = new Circle(xy[0], xy[1], radius, opacity);
        circles.shift();
        circles.push(circle);
        for (var i=0; i<numCircleLim-1; i++) circles[i].opacity = opacityLim + i*(1-opacityLim)/numCircleLim;
    }
}

function draw() {
    requestAnimationFrame(draw);

    // Clear Canvas
    canvas2_context.fillStyle = "#000";
    canvas2_context.fillRect(0, 0, canvas2.width, canvas2.height);

    // Draw map
    canvas2_context.drawImage(mapSprite, 0, 0);

        // run example specific draw callback
    if (!(typeof(drawLocal)=='undefined')) { drawLocal(); }
    // Draw Circles

    for (var i=0; i<circles.length; i++) circles[i].draw(canvas2_context);

};
draw();

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
 

