console.log(ambisonics);

// AUDIO CONTEXT & WEBKIT ##############################################################################
var context = new (window.AudioContext || window.webkitAudioContext)();
//var context = new AudioContext; //Initialiserer audio context


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
var monoEncoder = new ambisonics.monoEncoder(context, 1);
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

//
//
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
function lydRotasjon(pitch, yaw) {

      // Oppdatere Ambisonics rotasjon
      // 
      rotator.yaw = yaw;
      rotator.pitch = pitch;
      rotator.updateRotMtx();

};

// ############## MonoEncoder plassering ##############################################################

monoEncoder.azim = 0;
monoEncoder.elev = 0;
monoEncoder.updateGains();

/*
var gn = new GyroNorm();

checkbox.addEventListener("click", function(){
  gn.init().then(function(){
    gn.start(function(data){
      var yaw = data.do.alpha; // Rotasjon rundt Z-aksen (0 - 360 grader) 
      var pitch = data.do.beta + 180; // Rotasjon rundt x-aksen (-180 til 180 grader) 
      var roll = data.do.gamma; // Rotasjon rundt y-aksen (-90 til 90 grader)

      //console.log(yaw, pitch, roll);

      // Oppdatere Ambisonics rotasjon
      // 
      rotator.yaw = yaw;
      rotator.pitch = pitch;
      rotator.roll = roll;
      rotator.updateRotMtx();
      
      if(checkbox.checked == true){

        var rotasjonSlider = document.getElementById("Slider");
        rotasjonSlider.value = yaw;
        rotator.yaw = yaw;
        rotator.pitch = pitch;
        rotator.roll = roll;
        rotator.updateRotMtx();
      };

    });
  }).catch(function(e){
    console.log("not supported");
  })
});

*/
/*
checkbox.addEventListener("click", function(){
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
*/
// READY FUNCTION - PLAY STOP ############################################################################

// AUDIO VISUALIZATION #######################################################################
// 
//


function drawLocal() {
    // Update audio analyser buffers
    analyser.updateBuffers();
    var params = analyser.computeIntensity();
    updateCircles(params, canvas2);
    update3d(params);
}


var mapSprite = new Image(820, 412);
mapSprite.src = "Bilder/map.png";


var canvas2 = document.getElementById('Canvas2');
var canvas2_context = canvas2.getContext("2d");
var circles = [];
var numCircleLim = 10;
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

function del3d() {

};


function draw() {
    requestAnimationFrame(draw);

    // Clear Canvas
    canvas2_context.fillStyle = "#000";
    canvas2_context.fillRect(0, 0, canvas2.width, canvas2.height);

    // Draw map
    canvas2_context.drawImage(mapSprite, 0, 0);

        // run example specific draw callback
    //if (!(typeof(drawLocal)=='undefined')) { drawLocal(); }
    // Draw Circles
    drawLocal();

    for (var i=0; i<circles.length; i++) circles[i].draw(canvas2_context);

};
draw();

// A-FRAME ###################################################################################

function update3d(params) {
    var sceneEl = document.querySelector('a-scene');
    var sphereEl = document.createElement('a-sphere');

    var sphereX = params[0]; // azim
    var sphereY = params[1]; // elev

    var sphereY = sphereY - 90;
    //console.log(sphereX, sphereY);

    // ########### konvertering #####################

    radius = 60
    radSphereX = sphereX * Math.PI/180; // Radianer
    radSphereY = sphereY * Math.PI/180;

    cartX = radius * Math.cos(radSphereY) * Math.cos(radSphereX); // Kartesiske koordinatsystem
    cartY = radius * Math.cos(radSphereY) * Math.sin(radSphereX);
    cartZ = radius * Math.sin(radSphereY);

    //###############################################
    var cartX = cartX.toString();
    var cartY = cartY.toString();
    var cartZ = cartZ.toString();

    var sphereHolder = cartX + " " + cartY + " " + cartZ;
    //console.log(sphereHolder);

    //var radi = 30*(1-params[2]);

        var circle = document.createElement('a-sphere');
        sphereEl.setAttribute("position", sphereHolder);
        sphereEl.setAttribute("color", "#00FFFF");
        sceneEl.appendChild(sphereEl);
        //sphereEl.setAttribute("radius", radi);
        var animator = document.createElement("a-animation");
        animator.setAttribute("attribute", "radius");
        animator.setAttribute("dur", "200");
        var intensity = 15*(1-params[2]);
        var intensity = String(intensity);
        //console.log(intensity);
        animator.setAttribute("from", intensity);
        animator.setAttribute("to", "1");
        animator.setAttribute("direction", "normal");
        sphereEl.appendChild(animator);
        animator.setAttribute("begin", "fade")
        sphereEl.emit("fade")

        var counter = sceneEl.childElementCount;
        if (counter > 100) {
          //sceneEl.removeChild(sceneEl.firstChild);
          var sphere = document.querySelector('a-sphere');
          sphere.parentNode.removeChild(sphere);

        var camera = document.querySelector('[camera]').object3D.rotation

        //skjekk riktig xyz
        console.log(document.querySelector('[camera]').object3D);
        var camX = document.querySelector('[camera]').object3D.rotation._x;
        var camY = document.querySelector('[camera]').object3D.rotation._y;
        var camZ = document.querySelector('[camera]').object3D.rotation._z;
        //console.log(camY);
        var camPitch = camX*180/Math.PI;
        var camYaw = camY*180/Math.PI;
        var camRoll = camZ*180/Math.PI;
        console.log(camPitch);
        //console.log(camPitch, camYaw, camZ);
        lydRotasjon(camPitch, camYaw);
        };
};


// EXCEPTION ALERT ###########################################################################
function onDecodeAudioDataError(error) {
    var url = 'hjre';
  alert("Browser cannot decode audio data..." + "\n\nError: " + error + "\n\n(If you re using Safari and get a null error, this is most likely due to Apple's shady plan going on to stop the .ogg format from easing web developer's life :)");
};

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
 /*

AFRAME.registerComponent('listener', {
  tick: function () {
    console.log(this.el.getAttribute('position'));
  }
});

AFRAME.registerComponent('rotation-reader', {
  tick: function () {
    console.log(this.el.getAttribute('rotation'));
  }
});

tick: function () {
var camera = document.querySelector('[camera]').object3D
console.log(camera)  
}

*/