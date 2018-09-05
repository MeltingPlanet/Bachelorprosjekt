
// Åpner menu overlay
function openNav() {
    document.getElementById("myNav").style.width = "100%";
}

//lukker menu overlay
function closeNav() {
    document.getElementById("myNav").style.width = "0%";
}


$( document ).ready(function(){ //sier at koden ikke skal kjøres før hele siden er lastet inn

    // AUDIO CONTEXT & WEBKIT ##############################################################################
    var context = new (window.AudioContext || window.webkitAudioContext)(); //Oppretter en AudioContext

    // SPECIFY FILTER URL ###################################################################################
    //var FilterUrl = "Filter/aalto2016_N1.wav"; //finner HRTF filter og gir det en variabel
    var FilterUrl = "Filter/aalto2016_N1.wav"; //finner HRTF filter og gir det en variabel

    // AMBISONICS ROTATION #################################################################################
    var rotator = new ambisonics.sceneRotator(context, 1); // henter en modul fra ambisonics.js for å panorere 1. orden Ambisonics

    //AMBISONIC DECODER ####################################################################################
    var binDecoder = new ambisonics.binDecoder(context, 1); // Setter opp dekoder og tilorder en variabel

    //ANALYZER 2D ##########################################################################################
    var analyser1 = new ambisonics.intensityAnalyser(context); //Setter opp analyser for hver enkelt lyd
    var analyser2 = new ambisonics.intensityAnalyser(context);
    var analyser3 = new ambisonics.intensityAnalyser(context);
    var analyser4 = new ambisonics.intensityAnalyser(context);
    var analyser5 = new ambisonics.intensityAnalyser(context);
    var analyser6 = new ambisonics.intensityAnalyser(context);
    var analyser7 = new ambisonics.intensityAnalyser(context);
    var analyser8 = new ambisonics.intensityAnalyser(context);
    var analyser9 = new ambisonics.intensityAnalyser(context);
    var analyser10 = new ambisonics.intensityAnalyser(context);
    var analyser11 = new ambisonics.intensityAnalyser(context);
    var analyser12 = new ambisonics.intensityAnalyser(context);
    console.log(analyser1);
    //FuMa (b-format rekkefølge til ACN <--> WXYZ til WYZX) ################################################
    var converterF2A_1 = new ambisonics.converters.wxyz2acn(context); //konverterer fra b-format til ACN
    var converterF2A_2 = new ambisonics.converters.wxyz2acn(context);
    var converterF2A_3 = new ambisonics.converters.wxyz2acn(context);
    var converterF2A_4 = new ambisonics.converters.wxyz2acn(context);
    var converterF2A_5 = new ambisonics.converters.wxyz2acn(context);
    var converterF2A_6 = new ambisonics.converters.wxyz2acn(context);
    var converterF2A_7 = new ambisonics.converters.wxyz2acn(context);
    var converterF2A_8 = new ambisonics.converters.wxyz2acn(context);
    var converterF2A_9 = new ambisonics.converters.wxyz2acn(context);
    var converterF2A_10 = new ambisonics.converters.wxyz2acn(context);
    var converterF2A_11 = new ambisonics.converters.wxyz2acn(context);
    var converterF2A_12 = new ambisonics.converters.wxyz2acn(context);
    console.log(converterF2A_1);

    // MONO ENCODER #######################################################################################
    var monoEncoder = new ambisonics.monoEncoder(context, 1); //Konverterer monolyd til ambisonics
    console.log(monoEncoder);

    // OUTPUT GAIN #########################################################################################   
    
    var gainOut_1 = context.createGain(); //Setter opp en node for gaining av lyd
    var gainOut_2 = context.createGain();
    var gainOut_3 = context.createGain();
    var gainOut_4 = context.createGain();
    var gainOut_5 = context.createGain();
    var gainOut_6 = context.createGain();
    var gainOut_7 = context.createGain();
    var gainOut_8 = context.createGain();
    var gainOut_9 = context.createGain();
    var gainOut_10 = context.createGain();
    var gainOut_11 = context.createGain();
    var gainOut_12 = context.createGain();


    var ampAnalyser = context.createAnalyser();

    ampAnalyser.fftSize = 128;
    var bufferLength = ampAnalyser.frequencyBinCount;
    console.log(bufferLength);
    var dataArray = new Uint8Array(bufferLength);
    var abuffer = new Uint8Array(ampAnalyser.fftSize);

    canvas = document.getElementById("analyserCanvas");
    canvasCtx = canvas.getContext("2d");
    WIDTH = canvas.width;
    HEIGHT = canvas.height;
    canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

    maxGate = 0;
    gate = 0;

    //FREQ ANALYSER ###########################################################
   

    //SIGNAL FLOW (FOA --> Rotering --> Bineaural --> Gain --> Destinasjon/ut) #############################

    //Kobler lyder til gain
    converterF2A_1.out.connect(gainOut_1);
    converterF2A_2.out.connect(gainOut_2);
    converterF2A_3.out.connect(gainOut_3);
    converterF2A_4.out.connect(gainOut_4);
    converterF2A_5.out.connect(gainOut_5);
    converterF2A_6.out.connect(gainOut_6);
    converterF2A_7.out.connect(gainOut_7);
    converterF2A_8.out.connect(gainOut_8);
    converterF2A_9.out.connect(gainOut_9);
    converterF2A_10.out.connect(gainOut_10);
    monoEncoder.out.connect(gainOut_11);
    monoEncoder.out.connect(gainOut_12);

    //Kobler lyder til rotasjon
    gainOut_1.connect(rotator.in);
    gainOut_2.connect(rotator.in);
    gainOut_3.connect(rotator.in);
    gainOut_4.connect(rotator.in);
    gainOut_5.connect(rotator.in);
    gainOut_6.connect(rotator.in);
    gainOut_7.connect(rotator.in);
    gainOut_8.connect(rotator.in);
    gainOut_9.connect(rotator.in);
    gainOut_10.connect(rotator.in);
    gainOut_11.connect(rotator.in);
    gainOut_12.connect(rotator.in);

    //Kobler lyder til analyse

    gainOut_1.connect(analyser1.in);
    gainOut_2.connect(analyser2.in);
    gainOut_3.connect(analyser3.in);
    gainOut_4.connect(analyser4.in);
    gainOut_5.connect(analyser5.in);
    gainOut_6.connect(analyser6.in);
    gainOut_7.connect(analyser7.in);
    gainOut_8.connect(analyser8.in);
    gainOut_9.connect(analyser9.in);
    gainOut_10.connect(analyser10.in);
    gainOut_11.connect(analyser11.in);
    gainOut_12.connect(analyser12.in);

    //Kobler alt til dekoder
    rotator.out.connect(binDecoder.in);
    binDecoder.out.connect(ampAnalyser);
    //Sender alt til utgangen
    binDecoder.out.connect(context.destination);


    // LOAD SAMPLE #########################################################################################
    function loadSample(url, doAfterLoading) {
        var fetchSound = new XMLHttpRequest(); // Laster inn fil ved XMLHttpRequest
        fetchSound.open("GET", url, true); // Fildestinasjon
        fetchSound.responseType = "arraybuffer"; // Leses som binær data
        fetchSound.onload = function() { //når lyden er lastet inn kjøres funksjonen som legger på HRIR
            context.decodeAudioData(fetchSound.response, doAfterLoading, onDecodeAudioDataError);
        }
        fetchSound.send();
    }

    // SAMPLE TO CONVOLUTION FILTER #################################################################
    var assignSample2Filters = function(decodedBuffer) { //Konvolverer lydkilden med HRIR filteret
        binDecoder.updateFilters(decodedBuffer);
    }

    // LOAD SAMPLES #############################################################################

    loadSample(FilterUrl, assignSample2Filters);

    //########################### AJAX med JSON #############################
    //
    var select = document.getElementById("audioFile"); //henter et element fra HTML filen og tilordner variabler i javascriptet
    var lydvalg = document.getElementById("lydvalg");


    select.addEventListener("input", function(){ //Venter på at bruker skal gi en input (velge hvilken lydfil som skal lastes inn) før den kjører funksjonen
        //console.log(select.value);
        var ourRequest = new XMLHttpRequest(); // Laster inn fil ved XMLHttpRequest
        ourRequest.open('GET', 'JSON/Lydfiler.json'); //Hvilken fil som skal hentes inn
        ourRequest.onload = function(){ //når filen er lastet inn kjører funksjonen
            lydfil = JSON.parse(ourRequest.responseText); //henter lyden inn på en variabel
            changeAudio(lydfil); //Kjører funksjonen changeAudio men lydfil som input
    }
    if(select.value != "notselect"){
      ourRequest.send(); 
    } 
    });


    function changeAudio(lydfil){ //funksjonen tar inn lydfil
        var divElement = document.createElement("div"); //lager et div element i HTML filen
        var audioElement = document.createElement("AUDIO");  //lager et audioelement i HTML filen

        var label = document.createElement("p"); //lager et text element
        label.setAttribute("id", "SoundLabel"); //gir text elementet id'en SoundLabel

        var kryss = document.createElement("span");
        //kryss.setAttribute("id", lydfil[0].id[select.value] + "kryss");

        var MonoDiv = document.createElement("div");
        MonoDiv.setAttribute("id", "MonoDiv");

      if(document.getElementById("audioElement" + select.value)==null){ //ungår at den forsøker å lage dublikater av lydelementer

            console.log(lydvalg);

            // Div for audiospor #########################################
            divElement.setAttribute("class", "audio"); //gir div elementet classen "audio"
            divElement.setAttribute("id", "audioDiv"+ select.value); //gir div elementet classen "audio"
            console.log(divElement);
            lydvalg.appendChild(divElement); //lager et divelement som et barn av elementet lydvalg i HTML koden
            // AUDIO ######################################################
            audioElement.setAttribute('controls', 'controls'); //Gir brukeren kontroll over audio-avspilling, volum, etc
            audioElement.setAttribute('id', lydfil[0].id[select.value]); //Gir audio-elementet samme id som verdien til liste-elementet i html
            audioElement.setAttribute('controlsList', 'nodownload'); //Fjerner muligheten for å kunne laste ned filen
            audioElement.setAttribute("loop", "true");  //Filen vil loopes
            audioElement.volume = 1; //setter volum til 1

            var source = document.createElement("source"); //lager elementet source i HTML for å hente inn lydfil

            source.setAttribute('src', lydfil[0].src[select.value]); //value fra html bestemmer hvilken fil som skal hentes inn
            source.setAttribute('type', "audio/wav"); //setter filformat

            audioElement.appendChild(source);   

            divElement.appendChild(audioElement);
            console.log(audioElement);
            //  kobler audioelement til converter eller monoencoder 
            var audioElement = document.getElementById("audioElement" + select.value); 
            console.log(audioElement);
            var mediaElementSource = context.createMediaElementSource(audioElement); //lager et mediaelement for å holde lydfiler som kan strømmes.
            console.log(mediaElementSource);

            // HAV ########################################################

            if(select.value == 0){
                mediaElementSource.connect(converterF2A_1.in); //Kobler til signalkjede
                var node = document.createTextNode("Hav");  //Gir tekst til audio-elementet
                label.appendChild(node);
                divElement.appendChild(label);

                var nodeKryss = document.createTextNode(" X ");
                kryss.appendChild(nodeKryss);
                kryss.setAttribute("id", "HavKryss")
                kryss.style.color = "DimGray";
                kryss.style.fontWeight = "bold";
                divElement.appendChild(kryss);

                // GAIN SLIDER ########################################################

                var gain1Label = document.createElement("label");
                gain1Label.setAttribute("for", "gain1");
                gain1Label.setAttribute("id", "gain1Label");
                gain1Label.style.display = "inline-block";
                gain1Label.style.marginLeft = "5%";

                var nodeGain1Label = document.createTextNode("Gain:");
                gain1Label.appendChild(nodeGain1Label);

                divElement.appendChild(gain1Label);

                var gain1 = document.createElement("input");
                gain1.setAttribute("id", "gain1");
                gain1.setAttribute("type", "range");
                gain1.setAttribute("min", "0");
                gain1.setAttribute("max", "10");
                gain1.setAttribute("step", "0.01");
                gain1.style.width = "20%";
                divElement.appendChild(gain1);
                gain1.defaultValue = 5;
                gainOut_1.gain.setValueAtTime(gain1.value, context.currentTime);

                // BONDELAND ########################################################

            }else if(select.value == 1){
                mediaElementSource.connect(converterF2A_2.in);
                var node = document.createTextNode("Bondeland");
                label.appendChild(node);
                divElement.appendChild(label);

                var nodeKryss = document.createTextNode("     X");
                kryss.appendChild(nodeKryss);
                kryss.setAttribute("id", "Bondeland");
                kryss.style.color = "DimGray";
                kryss.style.fontWeight = "bold";
                divElement.appendChild(kryss);

                // GAIN SLIDER ########################################################

                var gain2Label = document.createElement("label");
                gain2Label.setAttribute("for", "gain2");
                gain2Label.setAttribute("id", "gain2Label");
                gain2Label.style.display = "inline-block";
                gain2Label.style.marginLeft = "5%";

                var nodeGain2Label = document.createTextNode("Gain:");
                gain2Label.appendChild(nodeGain2Label);

                divElement.appendChild(gain2Label);

                var gain2 = document.createElement("input");
                gain2.setAttribute("id", "gain2");
                gain2.setAttribute("type", "range");
                gain2.setAttribute("min", "0");
                gain2.setAttribute("max", "10");
                gain2.setAttribute("step", "0.01");
                gain2.style.width = "20%";
                divElement.appendChild(gain2);
                gain2.defaultValue = 5;
                gainOut_2.gain.setValueAtTime(gain2.value, context.currentTime);

                // REGN ########################################################

            }else if(select.value == 2){
                mediaElementSource.connect(converterF2A_3.in);
                var node = document.createTextNode("Regn");
                label.appendChild(node);
                divElement.appendChild(label);

                var nodeKryss = document.createTextNode("     X");
                kryss.appendChild(nodeKryss);
                kryss.setAttribute("id", "Regn");
                kryss.style.color = "DimGray";
                kryss.style.fontWeight = "bold";
                divElement.appendChild(kryss);

                // GAIN SLIDER ########################################################

                var gain3Label = document.createElement("label");
                gain3Label.setAttribute("for", "gain3");
                gain3Label.setAttribute("id", "gain3Label");
                gain3Label.style.display = "inline-block";
                gain3Label.style.marginLeft = "5%";

                var nodeGain3Label = document.createTextNode("Gain:");
                gain3Label.appendChild(nodeGain3Label);

                divElement.appendChild(gain3Label);

                var gain3 = document.createElement("input");
                gain3.setAttribute("id", "gain3");
                gain3.setAttribute("type", "range");
                gain3.setAttribute("min", "0");
                gain3.setAttribute("max", "4");
                gain3.setAttribute("step", "0.01");
                gain3.style.width = "20%";
                divElement.appendChild(gain3);
                gain3.defaultValue = 2;
                gainOut_3.gain.setValueAtTime(gain3.value, context.currentTime);

                // ELV ########################################################

            }else if(select.value == 3){
                mediaElementSource.connect(converterF2A_4.in);
                var node = document.createTextNode("Elv");
                label.appendChild(node);
                divElement.appendChild(label);

                var nodeKryss = document.createTextNode("     X");
                kryss.appendChild(nodeKryss);
                kryss.setAttribute("id", "Elv");
                kryss.style.color = "DimGray";
                kryss.style.fontWeight = "bold";
                divElement.appendChild(kryss);

                // GAIN SLIDER ########################################################

                var gain4Label = document.createElement("label");
                gain4Label.setAttribute("for", "gain4");
                gain4Label.setAttribute("id", "gain4Label");
                gain4Label.style.display = "inline-block";
                gain4Label.style.marginLeft = "5%";

                var nodeGain4Label = document.createTextNode("Gain:");
                gain4Label.appendChild(nodeGain4Label);

                divElement.appendChild(gain4Label);

                var gain4 = document.createElement("input");
                gain4.setAttribute("id", "gain4");
                gain4.setAttribute("type", "range");
                gain4.setAttribute("min", "0");
                gain4.setAttribute("max", "6");
                gain4.setAttribute("step", "0.01");
                gain4.style.width = "20%";
                divElement.appendChild(gain4);
                gain4.defaultValue = 3;
                gainOut_4.gain.setValueAtTime(gain4.value, context.currentTime);

                // FUGLER ########################################################

            }else if(select.value == 4){
                mediaElementSource.connect(converterF2A_5.in);
                var node = document.createTextNode("Fugler");
                label.appendChild(node);
                divElement.appendChild(label);

                var nodeKryss = document.createTextNode("     X");
                kryss.appendChild(nodeKryss);
                kryss.setAttribute("id", "Fugler");
                kryss.style.color = "DimGray";
                kryss.style.fontWeight = "bold";
                divElement.appendChild(kryss);

                // GAIN SLIDER ########################################################

                var gain5Label = document.createElement("label");
                gain5Label.setAttribute("for", "gain5");
                gain5Label.setAttribute("id", "gain5Label");
                gain5Label.style.display = "inline-block";
                gain5Label.style.marginLeft = "5%";

                var nodeGain5Label = document.createTextNode("Gain:");
                gain5Label.appendChild(nodeGain5Label);

                divElement.appendChild(gain5Label);

                var gain5 = document.createElement("input");
                gain5.setAttribute("id", "gain5");
                gain5.setAttribute("type", "range");
                gain5.setAttribute("min", "0");
                gain5.setAttribute("max", "28");
                gain5.setAttribute("step", "0.01");
                gain5.style.width = "20%";
                divElement.appendChild(gain5);
                gain5.defaultValue = 14;
                gainOut_5.gain.setValueAtTime(gain5.value, context.currentTime);

                // BOTANISK ########################################################

            }else if(select.value == 5){
                mediaElementSource.connect(converterF2A_6.in);
                var node = document.createTextNode("Botanisk");
                label.appendChild(node);
                divElement.appendChild(label);

                var nodeKryss = document.createTextNode("     X");
                kryss.appendChild(nodeKryss);
                kryss.setAttribute("id", "Botanisk");
                kryss.style.color = "DimGray";
                kryss.style.fontWeight = "bold";
                divElement.appendChild(kryss);

                // GAIN SLIDER ########################################################

                var gain6Label = document.createElement("label");
                gain6Label.setAttribute("for", "gain6");
                gain6Label.setAttribute("id", "gain6Label");
                gain6Label.style.display = "inline-block";
                gain6Label.style.marginLeft = "5%";

                var nodeGain6Label = document.createTextNode("Gain:");
                gain6Label.appendChild(nodeGain6Label);

                divElement.appendChild(gain6Label);

                var gain6 = document.createElement("input");
                gain6.setAttribute("id", "gain6");
                gain6.setAttribute("type", "range");
                gain6.setAttribute("min", "0");
                gain6.setAttribute("max", "24");
                gain6.setAttribute("step", "0.01");
                gain6.style.width = "20%";
                divElement.appendChild(gain6);
                gain6.defaultValue = 12;
                gainOut_6.gain.setValueAtTime(gain6.value, context.currentTime);

                // MONO MÅKE ########################################################

            }else if(select.value == 6){
                mediaElementSource.connect(monoEncoder.in);
                var node = document.createTextNode("MonoMåke");
                label.appendChild(node);
                divElement.appendChild(label);

                //----------- Lager kryss for å kunne fjerne elementet------
                var nodeKryss = document.createTextNode("     X");
                kryss.appendChild(nodeKryss);
                kryss.setAttribute("id", "MonoMåke");
                kryss.style.color = "DimGray";
                kryss.style.fontWeight = "bold";
                divElement.appendChild(kryss);

                //----------- Legger til slidere for å oppdtere azim og elev ------
                var AzimLabel = document.createElement("label");
                AzimLabel.setAttribute("for", "AzimInput");
                AzimLabel.setAttribute("id", "AzimLabel");
                AzimLabel.style.display = "block";

                var nodeAzimLabel = document.createTextNode("Azimuth:");
                AzimLabel.appendChild(nodeAzimLabel);

                MonoDiv.appendChild(AzimLabel);

                var AzimInput = document.createElement("input");
                AzimInput.setAttribute("id", "AzimInput");
                AzimInput.setAttribute("type", "range");
                AzimInput.setAttribute("min", "-180");
                AzimInput.setAttribute("max", "180");
                AzimInput.setAttribute("step", "10");
                AzimInput.style.width = "100%";
                AzimInput.style.transform = "rotateY(180deg)";

                MonoDiv.appendChild(AzimInput);

                var ElevLabel = document.createElement("label");
                ElevLabel.setAttribute("for", "ElevInput");
                ElevLabel.setAttribute("id", "ElevLabel");
                ElevLabel.style.display = "block";

                var nodeElevLabel = document.createTextNode("Høyde:");
                ElevLabel.appendChild(nodeElevLabel);

                MonoDiv.appendChild(ElevLabel);

                var ElevInput = document.createElement("input");
                ElevInput.setAttribute("id", "ElevInput");
                ElevInput.setAttribute("type", "range");
                ElevInput.setAttribute("min", "-90");
                ElevInput.setAttribute("max", "90");
                ElevInput.setAttribute("step", "10");
                ElevInput.style.width = "100%";

                MonoDiv.appendChild(ElevInput);

                MonoPlassering.appendChild(MonoDiv);

                // GAIN SLIDER ########################################################

                var gain11Label = document.createElement("label");
                gain11Label.setAttribute("for", "gain11");
                gain11Label.setAttribute("id", "gain11Label");
                gain11Label.style.display = "inline-block";
                gain11Label.style.marginLeft = "5%";

                var nodeGain11Label = document.createTextNode("Gain:");
                gain11Label.appendChild(nodeGain11Label);

                divElement.appendChild(gain11Label);

                var gain11 = document.createElement("input");
                gain11.setAttribute("id", "gain11");
                gain11.setAttribute("type", "range");
                gain11.setAttribute("min", "0");
                gain11.setAttribute("max", "8");
                gain11.setAttribute("step", "0.01");
                gain11.style.width = "20%";

                divElement.appendChild(gain11);
                gain11.defaultValue = 4;
                gainOut_11.gain.setValueAtTime(gain11.value, context.currentTime);

                // HEST ########################################################

            }else if(select.value == 7){
                mediaElementSource.connect(converterF2A_7.in);
                var node = document.createTextNode("Hest");
                label.appendChild(node);
                divElement.appendChild(label);

                var nodeKryss = document.createTextNode("     X");
                kryss.appendChild(nodeKryss);
                kryss.setAttribute("id", "Hest");
                kryss.style.color = "DimGray";
                kryss.style.fontWeight = "bold";
                divElement.appendChild(kryss);

                // GAIN SLIDER ########################################################

                var gain7Label = document.createElement("label");
                gain7Label.setAttribute("for", "gain7");
                gain7Label.setAttribute("id", "gain7Label");
                gain7Label.style.display = "inline-block";
                gain7Label.style.marginLeft = "5%";

                var nodeGain7Label = document.createTextNode("Gain:");
                gain7Label.appendChild(nodeGain7Label);

                divElement.appendChild(gain7Label);

                var gain7 = document.createElement("input");
                gain7.setAttribute("id", "gain7");
                gain7.setAttribute("type", "range");
                gain7.setAttribute("min", "0");
                gain7.setAttribute("max", "10");
                gain7.setAttribute("step", "0.01");
                gain7.style.width = "20%";
                divElement.appendChild(gain7);
                gain7.defaultValue = 5;
                gainOut_7.gain.setValueAtTime(gain7.value, context.currentTime);

                // SAU ########################################################

            }else if(select.value == 8){
                mediaElementSource.connect(converterF2A_8.in);
                var node = document.createTextNode("Sau");
                label.appendChild(node);
                divElement.appendChild(label);

                var nodeKryss = document.createTextNode("     X");
                kryss.appendChild(nodeKryss);
                kryss.setAttribute("id", "Sau");
                kryss.style.color = "DimGray";
                kryss.style.fontWeight = "bold";
                divElement.appendChild(kryss);

                // GAIN SLIDER ########################################################

                var gain8Label = document.createElement("label");
                gain8Label.setAttribute("for", "gain8");
                gain8Label.setAttribute("id", "gain8Label");
                gain8Label.style.display = "inline-block";
                gain8Label.style.marginLeft = "5%";

                var nodeGain8Label = document.createTextNode("Gain:");
                gain8Label.appendChild(nodeGain8Label);

                divElement.appendChild(gain8Label);

                var gain8 = document.createElement("input");
                gain8.setAttribute("id", "gain8");
                gain8.setAttribute("type", "range");
                gain8.setAttribute("min", "0");
                gain8.setAttribute("max", "8");
                gain8.setAttribute("step", "0.01");
                gain8.style.width = "20%";
                divElement.appendChild(gain8);
                gain8.defaultValue = 4;
                gainOut_8.gain.setValueAtTime(gain8.value, context.currentTime);

                // HØNSEHUS ########################################################

            }else if(select.value == 9){
                mediaElementSource.connect(converterF2A_9.in);
                var node = document.createTextNode("Hønsehus");
                label.appendChild(node);
                divElement.appendChild(label);

                var nodeKryss = document.createTextNode("     X");
                kryss.appendChild(nodeKryss);
                kryss.setAttribute("id", "Hønsehus");
                kryss.style.color = "DimGray";
                kryss.style.fontWeight = "bold";
                divElement.appendChild(kryss);

                // GAIN SLIDER ########################################################

                var gain9Label = document.createElement("label");
                gain9Label.setAttribute("for", "gain9");
                gain9Label.setAttribute("id", "gain9Label");
                gain9Label.style.display = "inline-block";
                gain9Label.style.marginLeft = "5%";

                var nodeGain9Label = document.createTextNode("Gain:");
                gain9Label.appendChild(nodeGain9Label);

                divElement.appendChild(gain9Label);

                var gain9 = document.createElement("input");
                gain9.setAttribute("id", "gain9");
                gain9.setAttribute("type", "range");
                gain9.setAttribute("min", "0");
                gain9.setAttribute("max", "18");
                gain9.setAttribute("step", "0.01");
                gain9.style.width = "20%";
                divElement.appendChild(gain9);
                gain9.defaultValue = 9;
                gainOut_9.gain.setValueAtTime(gain9.value, context.currentTime);

                // ENDER ########################################################

            }else if(select.value == 10){
                mediaElementSource.connect(converterF2A_10.in);
                var node = document.createTextNode("Ender");
                label.appendChild(node);
                divElement.appendChild(label);

                var nodeKryss = document.createTextNode("     X");
                kryss.appendChild(nodeKryss);
                kryss.setAttribute("id", "Ender");
                kryss.style.color = "DimGray";
                kryss.style.fontWeight = "bold";
                divElement.appendChild(kryss);

                // GAIN SLIDER ########################################################

                var gain10Label = document.createElement("label");
                gain10Label.setAttribute("for", "gain10");
                gain10Label.setAttribute("id", "gain10Label");
                gain10Label.style.display = "inline-block";
                gain10Label.style.marginLeft = "5%";

                var nodeGain10Label = document.createTextNode("Gain:");
                gain10Label.appendChild(nodeGain10Label);

                divElement.appendChild(gain10Label);

                var gain10 = document.createElement("input");
                gain10.setAttribute("id", "gain10");
                gain10.setAttribute("type", "range");
                gain10.setAttribute("min", "0");
                gain10.setAttribute("max", "20");
                gain10.setAttribute("step", "0.01");
                gain10.style.width = "20%";
                divElement.appendChild(gain10);
                gain10.defaultValue = 10;
                gainOut_10.gain.setValueAtTime(gain10.value, context.currentTime);

                // KATT ########################################################

          }else if(select.value == 11){
                mediaElementSource.connect(monoEncoder.in);
                var node = document.createTextNode("Katt");
                label.appendChild(node);
                divElement.appendChild(label);

                //----------- Lager kryss for å kunne fjerne elementet------
                var nodeKryss = document.createTextNode("     X");
                kryss.appendChild(nodeKryss);
                kryss.setAttribute("id", "Katt");
                kryss.style.color = "DimGray";
                kryss.style.fontWeight = "bold";
                divElement.appendChild(kryss);

                //----------- Legger til slidere for å oppdtere azim og elev ------
                var AzimLabel = document.createElement("label");
                AzimLabel.setAttribute("for", "AzimInput");
                AzimLabel.setAttribute("id", "AzimLabel");
                AzimLabel.style.display = "block";

                var nodeAzimLabel = document.createTextNode("Azimuth:");
                AzimLabel.appendChild(nodeAzimLabel);

                MonoDiv.appendChild(AzimLabel);

                var AzimInput = document.createElement("input");
                AzimInput.setAttribute("id", "AzimInput");
                AzimInput.setAttribute("type", "range");
                AzimInput.setAttribute("min", "-180");
                AzimInput.setAttribute("max", "180");
                AzimInput.setAttribute("step", "10");
                AzimInput.style.width = "100%";
                AzimInput.style.transform = "rotateY(180deg)";

                MonoDiv.appendChild(AzimInput);

                var ElevLabel = document.createElement("label");
                ElevLabel.setAttribute("for", "ElevInput");
                ElevLabel.setAttribute("id", "ElevLabel");
                ElevLabel.style.display = "block";

                var nodeElevLabel = document.createTextNode("Høyde:");
                ElevLabel.appendChild(nodeElevLabel);

                MonoDiv.appendChild(ElevLabel);

                var ElevInput = document.createElement("input");
                ElevInput.setAttribute("id", "ElevInput");
                ElevInput.setAttribute("type", "range");
                ElevInput.setAttribute("min", "-90");
                ElevInput.setAttribute("max", "90");
                ElevInput.setAttribute("step", "10");
                ElevInput.style.width = "100%";

                MonoDiv.appendChild(ElevInput);

                MonoPlassering.appendChild(MonoDiv);

                // GAIN SLIDER ########################################################

                var gain12Label = document.createElement("label");
                gain12Label.setAttribute("for", "gain12");
                gain12Label.setAttribute("id", "gain12Label");
                gain12Label.style.display = "inline-block";
                gain12Label.style.marginLeft = "5%";

                var nodeGain12Label = document.createTextNode("Gain:");
                gain12Label.appendChild(nodeGain12Label);

                divElement.appendChild(gain12Label);

                var gain12 = document.createElement("input");
                gain12.setAttribute("id", "gain12");
                gain12.setAttribute("type", "range");
                gain12.setAttribute("min", "0");
                gain12.setAttribute("max", "12");
                gain12.setAttribute("step", "0.01");
                gain12.style.width = "20%";

                divElement.appendChild(gain12);
                gain12.defaultValue = 6;
                gainOut_12.gain.setValueAtTime(gain12.value, context.currentTime);

            }
        }
    }

    document.getElementById("lydvalg").addEventListener("input", function(event){
        if (event.target.id === "gain1") {
            gain1 = document.getElementById("gain1");
            gainOut_1.gain.setValueAtTime(gain1.value, context.currentTime);
            console.log(gain1.value);      
        }
        if (event.target.id === "gain2") {
            gain2 = document.getElementById("gain2");
            gainOut_2.gain.setValueAtTime(gain2.value, context.currentTime);
            console.log(gain2.value);      
        }
        if (event.target.id === "gain3") {
            gain3 = document.getElementById("gain3");
            gainOut_3.gain.setValueAtTime(gain3.value, context.currentTime);
            console.log(gain3.value);      
        }
        if (event.target.id === "gain4") {
            gain4 = document.getElementById("gain4");
            gainOut_4.gain.setValueAtTime(gain4.value, context.currentTime);
            console.log(gain4.value);      
        }
        if (event.target.id === "gain5") {
            gain5 = document.getElementById("gain5");
            gainOut_5.gain.setValueAtTime(gain5.value, context.currentTime);
            console.log(gain5.value);      
        }
        if (event.target.id === "gain6") {
            gain6 = document.getElementById("gain6");
            gainOut_6.gain.setValueAtTime(gain6.value, context.currentTime);
            console.log(gain6.value);      
        }
        if (event.target.id === "gain7") {
            gain7 = document.getElementById("gain7");
            gainOut_7.gain.setValueAtTime(gain7.value, context.currentTime);
            console.log(gain7.value);      
        }
        if (event.target.id === "gain8") {
            gain8 = document.getElementById("gain8");
            gainOut_8.gain.setValueAtTime(gain8.value, context.currentTime);
            console.log(gain8.value);      
        }
        if (event.target.id === "gain9") {
            gain9 = document.getElementById("gain9");
            gainOut_9.gain.setValueAtTime(gain9.value, context.currentTime);
            console.log(gain9.value);      
        }
        if (event.target.id === "gain10") {
            gain10 = document.getElementById("gain10");
            gainOut_10.gain.setValueAtTime(gain10.value, context.currentTime);
            console.log(gain10.value);      
        }
        if (event.target.id === "gain11") {
            gain11 = document.getElementById("gain11");
            gainOut_11.gain.setValueAtTime(gain11.value, context.currentTime);
            console.log(gain11.value);      
        }
        if (event.target.id === "gain12") {
            gain12 = document.getElementById("gain12");
            gainOut_12.gain.setValueAtTime(gain12.value, context.currentTime);
            console.log(gain12.value);      
        }
    })

    document.getElementById("lydvalg").addEventListener("click", function(event){
        document.getElementById("audioFile").value = "notselect";
        if (event.target.id === "HavKryss") {
            document.getElementById("audioDiv0").remove();
            }
        if (event.target.id === "Bondeland") {
            document.getElementById("audioDiv1").remove();
            }
        if (event.target.id === "Regn") {
            document.getElementById("audioDiv2").remove();
            }
        if (event.target.id === "Elv") {
            document.getElementById("audioDiv3").remove();
            }  
        if (event.target.id === "Fugler") {
            document.getElementById("audioDiv4").remove();
            }
        if (event.target.id === "Botanisk") {
            document.getElementById("audioDiv5").remove();
            console.log("true");
            }
        if (event.target.id === "Hest") {
            document.getElementById("audioDiv7").remove();
            console.log("true");
            }
        if (event.target.id === "Sau") {
            document.getElementById("audioDiv8").remove();
            console.log("true");
            }
        if (event.target.id === "Hønsehus") {
            document.getElementById("audioDiv9").remove();
            console.log("true");
            }
        if (event.target.id === "Ender") {
            document.getElementById("audioDiv10").remove();
            console.log("true");
            }
        if (event.target.id === "MonoMåke") {
            document.getElementById("audioDiv6").remove();
            document.getElementById("MonoDiv").remove();
            }
        if (event.target.id === "Katt") {
            document.getElementById("audioDiv11").remove();
            document.getElementById("MonoDiv").remove();
            } 
    })


    // MOBIL SENSOR ROTERING #############################################################################
    function lydRotasjon(pitch, yaw) {

        // Oppdatere Ambisonics rotasjon med verdier fra A-frame
        rotator.yaw = yaw;
        rotator.pitch = pitch;
        rotator.updateRotMtx();

    }

    // ############## MonoEncoder plassering ##############################################################

   document.getElementById("MonoPlassering").addEventListener("input", function(event){
            monoEncoder.azim = AzimInput.value;
            monoEncoder.elev = ElevInput.value;
            monoEncoder.updateGains();  //sender verdier for azimuth og elevation til JSAmbisonics
    })

    // AUDIO VISUALIZATION #######################################################################


    function updateVisual() {
        // Oppdaterer analysebuffer i JSAmbisonics

        ampAnalyser.getByteFrequencyData(dataArray);

        canvasCtx.fillStyle = 'rgb(0, 0, 0)';
        canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

        var barWidth = (WIDTH / bufferLength) * 2.5;
        var barHeight;
        var x = 0;

        for(var i = 0; i < bufferLength; i++) {
            barHeight = dataArray[i];

            canvasCtx.fillStyle = 'rgb(50,' + (barHeight+100) + ',50)';
            canvasCtx.fillRect(x,HEIGHT-barHeight/2,barWidth,barHeight/2);

            x += barWidth + 1;
        }


        analyser1.updateBuffers();
        analyser2.updateBuffers();
        analyser3.updateBuffers();
        analyser4.updateBuffers();
        analyser5.updateBuffers();
        analyser6.updateBuffers();
        analyser7.updateBuffers();
        analyser8.updateBuffers();
        analyser9.updateBuffers();
        analyser10.updateBuffers();
        analyser11.updateBuffers();
        analyser12.updateBuffers();


        var params1 = analyser1.computeIntensity(); //setter opp en analyser for hver lydfil og legger de i variabler som sendes til A-frame
        var params2 = analyser2.computeIntensity();
        var params3 = analyser3.computeIntensity();
        var params4 = analyser4.computeIntensity();
        var params5 = analyser5.computeIntensity();
        var params6 = analyser6.computeIntensity();
        var params7 = analyser7.computeIntensity();
        var params8 = analyser8.computeIntensity();
        var params9 = analyser9.computeIntensity();
        var params10 = analyser10.computeIntensity();
        var params11 = analyser11.computeIntensity();
        var params12 = analyser12.computeIntensity();

        if($('#audioElement0').length){ //Skjekker om audioelementet finnes, hvis det gjør det kjører den funksjonen update3d med input fra analyser
          update3d(params1);
        }
        if($('#audioElement1').length){
          update3d(params2);
        }
        if($('#audioElement2').length){
          update3d(params3);
        }
        if($('#audioElement3').length){
          update3d(params4);
        }
        if($('#audioElement4').length){
          update3d(params5)
        }
        if($('#audioElement5').length){
          update3d(params6);
        }
        if($('#audioElement6').length){
          update3d(params11);
        }
        if($('#audioElement7').length){
          update3d(params7);
        }
        if($('#audioElement8').length){
          update3d(params8);
        }
        if($('#audioElement9').length){
          update3d(params9);
        }
        if($('#audioElement10').length){
          update3d(params10);
        }
        if($('#audioElement11').length){
          update3d(params12);
        }
    }

    
    function startVisual(){ //oppdaterer hver frame i A-Frame scenen
        window.requestAnimationFrame(startVisual);
        updateVisual();
    }
    
    // A-FRAME ###################################################################################
    function getRandomColor() { //Funksjon for å hente ut tilfeldig farge i HEX kode.
        let letters = '0123456789abcdef';
        let randomColor = '';
        for (let i = 0; i < 6; i++) {
            randomColor += letters[Math.floor(Math.random() * 16)];
        }
        return randomColor; 
    }

    function update3d(params) {
        //console.log(maxGate);
        if (maxGate > 0) {
          downRate = maxGate - (0.1 * (maxGate**2));
          maxGate = downRate;
        }

        if (params[3] > maxGate) {
        maxGate = params[3] 
        gate = maxGate/1.001
        //console.log("gate:", gate, "params3:", params[3]);
        }

        var sceneEl = document.querySelector('a-scene'); //gir scene elementet fra HTML en variabel
        if (params[3] > gate) {
        var sphereEl = document.createElement('a-sphere'); //lager en et kuleelement i HTML
        //console.log("azimuth:", params[0], "elev:", params[1])
        var sphereX = params[0]; // azim spfæriske koordinater
        var sphereY = params[1]; // elev

        var sphereY = sphereY; //lager en offset for å samsvare med lyd
        // ########### konvertering #####################

        radius = 3500; //setter en default radius til alle kulene
        radSphereX = sphereX * Math.PI/180; //konvertering fra radianer til grader
        radSphereY = sphereY * Math.PI/180;

        phi = radSphereX 
        theta = radSphereY
        rho = radius

        cartX = rho * Math.cos(theta) * Math.cos(phi); // Kartesiske koordinatsystem
        cartY = rho * Math.cos(theta) * Math.sin(phi);
        cartZ = rho * Math.sin(theta);

        var cartX = cartX.toString(); //gjør koordinatene om til en string
        var cartY = cartY.toString();
        var cartZ = cartZ.toString();
        console.log("energi:", params[3]);
        //###############################################

        var cartPos = cartX + " " + cartY + " " + cartZ; //lager et sammenhengende string format med posisjon til hver kule

        var color = getRandomColor(); //tilordner en tilfeldig farge til hver kule
        color = "#" + color.toString(); //setter en # forran og gjør fargen om til en string

        var intensity = params[3]; //scalering av kulene
        var intensity = intensity.toString();

        sphereEl.setAttribute("position", cartPos); //Gir kulen posisjon
        sphereEl.setAttribute("color", "yellow"); // gir kulen farge
        sphereEl.setAttribute("radius", intensity); // gir kulen en radius
        sceneEl.appendChild(sphereEl); //Gjør kulen til et barn av scene elementet i HTML
        }
        //console.log(params[3])
        //########## Holder kontroll på antall spfærer ###########

        var counter = sceneEl.childElementCount;
        if (counter > 20) {
        var sphere = document.querySelector('a-sphere');
        sphere.parentNode.removeChild(sphere); //tar vekk en kule hvis antall kuler er over 30
        }
        
        //########################################################

        //################ Henter verdier for kamera/visuell rotasjon og sender til lydrotasjon ############

        var camera = document.querySelector('[camera]').object3D.rotation;

        var camX = document.querySelector('[camera]').object3D.rotation._x; // Euler koordinater
        var camY = document.querySelector('[camera]').object3D.rotation._y;
        var camZ = document.querySelector('[camera]').object3D.rotation._z;

        var camPitch = camX*180/Math.PI; //Konvertering fra radianer til grader
        var camYaw = camY*180/Math.PI;
        var camRoll = camZ*180/Math.PI;

        lydRotasjon(camPitch, camYaw);

    }

    startVisual();

    // Unntaksmelding om ikke nettleseren kan dekode data  ###########################################################################
    function onDecodeAudioDataError(error) {
      alert("Browser cannot decode audio data..." + "\n\nError: " + error + "\n\n(If you re using Safari and get a null error, this is most likely due to Apple's shady plan going on to stop the .ogg format from easing web developer's life :)");
    }

});