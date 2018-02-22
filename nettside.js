
var audioCtx = new (window.AudioContext || window.webkitAudioContext)();


var ambisonics = require('ambisonics');
var encoder = new ambisonics.monoEncoder(audioContext, order);
