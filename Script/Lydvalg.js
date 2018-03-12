var select = document.getElementById("audioFile");
var lydvalg = document.getElementById("lydvalg");

select.addEventListener("input", function(){
    //console.log(select.value);
    var ourRequest = new XMLHttpRequest();
    ourRequest.open('GET', 'JSON/test.json');
    ourRequest.onload = function(){
        var lydfil = JSON.parse(ourRequest.responseText);
        changeAudio(lydfil);
}
ourRequest.send();  
});

function changeAudio(lydfil){
    console.log(lydfil[select.value].id)
    audioelement = "<audio controls id=" + lydfil[select.value].id + "><source src=" + lydfil[select.value].src + " type='audio/wav'/>";
    lydvalg.insertAdjacentHTML("beforeend", audioelement);
}


