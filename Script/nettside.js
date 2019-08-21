// Åpner menu overlay
function openNav() {
  document.getElementById('myNav').style.width = '100%';
}

//lukker menu overlay
function closeNav() {
  document.getElementById('myNav').style.width = '0%';
}

$('#open').click(function() {
  // AUDIO CONTEXT & WEBKIT ##############################################################################
  var context = new (window.AudioContext || window.webkitAudioContext)(); //Oppretter en AudioContext

  // SPECIFY FILTER URL ###################################################################################
  var FilterUrl = 'Filter/aalto2016_N1.wav'; //finner HRTF filter og gir det en variabel

  // AMBISONICS ROTATION #################################################################################
  var rotator = new ambisonics.sceneRotator(context, 1); // henter en modul fra ambisonics.js for å panorere 1. orden Ambisonics

  //AMBISONIC DECODER ####################################################################################
  var binDecoder = new ambisonics.binDecoder(context, 1); // Setter opp dekoder og tilorder en variabel

  //ANALYZER 2D ##########################################################################################
  var analyser = new ambisonics.intensityAnalyser(context); //Setter opp analyser for hver enkelt lyd
  var analyser2 = new ambisonics.intensityAnalyser(context);
  var analyser3 = new ambisonics.intensityAnalyser(context);
  var analyser4 = new ambisonics.intensityAnalyser(context);
  var analyser5 = new ambisonics.intensityAnalyser(context);
  var analyser6 = new ambisonics.intensityAnalyser(context);
  console.log(analyser);
  //FuMa (b-format rekkefølge til ACN <--> WXYZ til WYZX) ################################################
  var converterF2A = new ambisonics.converters.wxyz2acn(context); //konverterer fra b-format til ACN
  var converterF2A_2 = new ambisonics.converters.wxyz2acn(context);
  var converterF2A_3 = new ambisonics.converters.wxyz2acn(context);
  var converterF2A_4 = new ambisonics.converters.wxyz2acn(context);
  var converterF2A_5 = new ambisonics.converters.wxyz2acn(context);
  console.log(converterF2A);

  // MONO ENCODER #######################################################################################
  var monoEncoder = new ambisonics.monoEncoder(context, 1); //Konverterer monolyd til ambisonics
  console.log(monoEncoder);

  // OUTPUT GAIN #########################################################################################
  var gainOut = context.createGain(); //Setter opp en node for gaining av lyd

  //SIGNAL FLOW (FOA --> Rotering --> Bineaural --> Gain --> Destinasjon/ut) #############################

  //Kobler lyder til rotasjon
  converterF2A.out.connect(rotator.in);
  converterF2A_2.out.connect(rotator.in);
  converterF2A_3.out.connect(rotator.in);
  converterF2A_4.out.connect(rotator.in);
  converterF2A_5.out.connect(rotator.in);
  monoEncoder.out.connect(rotator.in);

  //Kobler lyder til analyse
  monoEncoder.out.connect(analyser6.in);
  converterF2A.out.connect(analyser.in);
  converterF2A_2.out.connect(analyser2.in);
  converterF2A_3.out.connect(analyser3.in);
  converterF2A_4.out.connect(analyser4.in);
  converterF2A_5.out.connect(analyser5.in);

  //Kobler alt til dekoder
  rotator.out.connect(binDecoder.in);

  //Sender alt til utgangen
  binDecoder.out.connect(context.destination);

  // LOAD SAMPLE #########################################################################################
  function loadSample(url, doAfterLoading) {
    var fetchSound = new XMLHttpRequest(); // Laster inn fil ved XMLHttpRequest
    fetchSound.open('GET', url, true); // Fildestinasjon
    fetchSound.responseType = 'arraybuffer'; // Leses som binær data
    fetchSound.onload = function() {
      //når lyden er lastet inn kjøres funksjonen som legger på HRIR
      context.decodeAudioData(
        fetchSound.response,
        doAfterLoading,
        onDecodeAudioDataError
      );
    };
    fetchSound.send();
  }

  // SAMPLE TO CONVOLUTION FILTER #################################################################
  var assignSample2Filters = function(decodedBuffer) {
    //Konvolverer lydkilden med HRIR filteret
    binDecoder.updateFilters(decodedBuffer);
  };

  // LOAD SAMPLES #############################################################################

  loadSample(FilterUrl, assignSample2Filters);

  //########################### AJAX med JSON #############################
  //
  var select = document.getElementById('audioFile'); //henter et element fra HTML filen og tilordner variabler i javascriptet
  var lydvalg = document.getElementById('lydvalg');

  select.addEventListener('input', function() {
    //Venter på at bruker skal gi en input (velge hvilken lydfil som skal lastes inn) før den kjører funksjonen
    //console.log(select.value);
    var ourRequest = new XMLHttpRequest(); // Laster inn fil ved XMLHttpRequest
    ourRequest.open('GET', 'JSON/Lydfiler.json'); //Hvilken fil som skal hentes inn
    ourRequest.onload = function() {
      //når filen er lastet inn kjører funksjonen
      var lydfil = JSON.parse(ourRequest.responseText); //henter lyden inn på en variabel
      changeAudio(lydfil); //Kjører funksjonen changeAudio men lydfil som input
    };
    if (select.value != 'notselect') {
      ourRequest.send();
    }
  });

  function changeAudio(lydfil) {
    //funksjonen tar inn lydfil
    var divElement = document.createElement('div'); //lager et div element i HTML filen
    var audioElement = document.createElement('AUDIO'); //lager et audioelement i HTML filen

    var label = document.createElement('p'); //lager et text element
    label.setAttribute('id', 'SoundLabel'); //gir text elementet id'en SoundLabel

    if (document.getElementById('audioElement' + select.value) == null) {
      //ungår at den forsøker å lage dublikater av lydelementer

      // Div for audiospor #########################################
      divElement.setAttribute('class', 'audio'); //gir div elementet classen "audio"
      lydvalg.appendChild(divElement); //lager et divelement som et barn av elementet lydvalg i HTML koden
      // AUDIO ######################################################
      audioElement.setAttribute('controls', 'controls'); //Gir brukeren kontroll over audio-avspilling, volum, etc
      audioElement.setAttribute('id', lydfil[0].id[select.value]); //Gir audio-elementet samme id som verdien til liste-elementet i html
      audioElement.setAttribute('controlsList', 'nodownload'); //Fjerner muligheten for å kunne laste ned filen
      audioElement.setAttribute('loop', 'true'); //Filen vil loopes
      audioElement.volume = 1; //setter volum til 1

      var source = document.createElement('source'); //lager elementet source i HTML for å hente inn lydfil

      source.setAttribute('src', lydfil[0].src[select.value]); //value fra html bestemmer hvilken fil som skal hentes inn
      source.setAttribute('type', 'audio/wav'); //setter filformat

      audioElement.appendChild(source);

      divElement.appendChild(audioElement);

      //  kobler audioelement til converter eller monoencoder
      var audioElement = document.getElementById('audioElement' + select.value);

      var mediaElementSource = context.createMediaElementSource(audioElement); //lager et mediaelement for å holde lydfiler som kan strømmes.

      if (select.value == 0) {
        mediaElementSource.connect(converterF2A.in); //Kobler til signalkjede
        var node = document.createTextNode('Hav'); //Gir tekst til audio-elementet
        label.appendChild(node);
        divElement.appendChild(label);
      } else if (select.value == 1) {
        mediaElementSource.connect(converterF2A_2.in);
        var node = document.createTextNode('Bondeland');
        label.appendChild(node);
        divElement.appendChild(label);
      } else if (select.value == 2) {
        mediaElementSource.connect(converterF2A_3.in);
        var node = document.createTextNode('Regn');
        label.appendChild(node);
        divElement.appendChild(label);
      } else if (select.value == 3) {
        mediaElementSource.connect(converterF2A_4.in);
        var node = document.createTextNode('Elv');
        label.appendChild(node);
        divElement.appendChild(label);
      } else if (select.value == 4) {
        mediaElementSource.connect(converterF2A_4.in);
        var node = document.createTextNode('Fugler');
        label.appendChild(node);
        divElement.appendChild(label);
      } else {
        mediaElementSource.connect(monoEncoder.in);
        var node = document.createTextNode('Mono måke');
        label.appendChild(node);
        divElement.appendChild(label);
      }
    }
  }

  // MOBIL SENSOR ROTERING #############################################################################
  function lydRotasjon(pitch, yaw) {
    // Oppdatere Ambisonics rotasjon med verdier fra A-frame
    rotator.yaw = yaw;
    rotator.pitch = pitch;
    rotator.updateRotMtx();
  }

  // ############## MonoEncoder plassering ##############################################################

  var MonoAzim = document.getElementById('MonoSliderAzim');
  var MonoElev = document.getElementById('MonoSliderElev');

  MonoAzim.addEventListener('input', updateMonoPlass);
  MonoElev.addEventListener('input', updateMonoPlass);

  function updateMonoPlass() {
    //Kjøres når bruker velger posisjon på nettsiden

    monoEncoder.azim = MonoAzim.value;
    monoEncoder.elev = MonoElev.value;
    monoEncoder.updateGains(); //sender verdier for azimuth og elevation til JSAmbisonics
  }

  // AUDIO VISUALIZATION #######################################################################

  function updateVisual() {
    // Oppdaterer analysebuffer i JSAmbisonics
    analyser.updateBuffers();
    analyser2.updateBuffers();
    analyser3.updateBuffers();
    analyser4.updateBuffers();
    analyser5.updateBuffers();
    analyser6.updateBuffers();

    var params = analyser.computeIntensity(); //setter opp en analyser for hver lydfil og legger de i variabler som sendes til A-frame
    var params2 = analyser2.computeIntensity();
    var params3 = analyser3.computeIntensity();
    var params4 = analyser4.computeIntensity();
    var params5 = analyser5.computeIntensity();
    var params6 = analyser5.computeIntensity();

    if ($('#audioElement0').length) {
      //Skjekker om audioelementet finnes, hvis det gjør det kjører den funksjonen update3d med input fra analyser
      update3d(params);
    }
    if ($('#audioElement1').length) {
      update3d(params2);
    }
    if ($('#audioElement2').length) {
      update3d(params3);
    }
    if ($('#audioElement3').length) {
      update3d(params4);
    }
    if ($('#audioElement4').length) {
      update3d(params5);
    }
    if ($('#audioElement5').length) {
      update3d(params6);
      //console.log('test');
    }
  }

  function startVisual() {
    //oppdaterer hver frame i A-Frame scenen
    window.requestAnimationFrame(startVisual);
    updateVisual();
  }

  // A-FRAME ###################################################################################
  function getRandomColor() {
    //Funksjon for å hente ut tilfeldig farge i HEX kode.
    let letters = '0123456789abcdef';
    let randomColor = '';
    for (let i = 0; i < 6; i++) {
      randomColor += letters[Math.floor(Math.random() * 16)];
    }
    return randomColor;
  }

  function update3d(params) {
    var sceneEl = document.querySelector('a-scene'); //gir scene elementet fra HTML en variabel
    var sphereEl = document.createElement('a-sphere'); //lager en et kuleelement i HTML

    var sphereX = params[0]; // azim spfæriske koordinater
    var sphereY = params[1]; // elev

    var sphereY = sphereY - 90; //lager en offset for å samsvare med lyd
    // ########### konvertering #####################

    radius = 300; //setter en default radius til alle kulene
    radSphereX = (sphereX * Math.PI) / 180; //konvertering fra radianer til grader
    radSphereY = (sphereY * Math.PI) / 180;

    phi = radSphereX;
    theta = radSphereY;
    rho = radius;

    cartX = rho * Math.cos(theta) * Math.cos(phi); // Kartesiske koordinatsystem
    cartY = rho * Math.cos(theta) * Math.sin(phi);
    cartZ = rho * Math.sin(theta);

    var cartX = cartX.toString(); //gjør koordinatene om til en string
    var cartY = cartY.toString();
    var cartZ = cartZ.toString();

    //###############################################

    var cartPos = cartX + ' ' + cartY + ' ' + cartZ; //lager et sammenhengende string format med posisjon til hver kule

    var color = getRandomColor(); //tilordner en tilfeldig farge til hver kule
    color = '#' + color.toString(); //setter en # forran og gjør fargen om til en string

    var intensity = 50 * (1 - params[2]); //scalering av kulene
    var intensity = intensity.toString();

    sphereEl.setAttribute('position', cartPos); //Gir kulen posisjon
    sphereEl.setAttribute('color', color); // gir kulen farge
    sphereEl.setAttribute('radius', intensity); // gir kulen en radius
    sceneEl.appendChild(sphereEl); //Gjør kulen til et barn av scene elementet i HTML

    //########## Holder kontroll på antall spfærer ###########

    var counter = sceneEl.childElementCount;
    if (counter > 30) {
      var sphere = document.querySelector('a-sphere');
      sphere.parentNode.removeChild(sphere); //tar vekk en kule hvis antall kuler er over 30
    }

    //########################################################

    //################ Henter verdier for kamera/visuell rotasjon og sender til lydrotasjon ############

    var camera = document.querySelector('[camera]').object3D.rotation;

    var camX = document.querySelector('[camera]').object3D.rotation._x; // Euler koordinater
    var camY = document.querySelector('[camera]').object3D.rotation._y;
    var camZ = document.querySelector('[camera]').object3D.rotation._z;

    var camPitch = (camX * 180) / Math.PI; //Konvertering fra radianer til grader
    var camYaw = (camY * 180) / Math.PI;
    var camRoll = (camZ * 180) / Math.PI;

    lydRotasjon(camPitch, camYaw);
  }

  startVisual();

  // Unntaksmelding om ikke nettleseren kan dekode data  ###########################################################################
  function onDecodeAudioDataError(error) {
    alert(
      'Browser cannot decode audio data...' +
        '\n\nError: ' +
        error +
        "\n\n(If you re using Safari and get a null error, this is most likely due to Apple's shady plan going on to stop the .ogg format from easing web developer's life :)"
    );
  }
});
