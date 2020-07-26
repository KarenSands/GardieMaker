$(document).ready(function iniciaTodo() {
    $.get("https://raw.githubusercontent.com/Zunnay/GardieMaker/master/data/status", function(estado, success, xhr) {
        document.getElementsByClassName("news-latest")[0].innerHTML = estado;
    });

});

$(function() { 
    $("#load-code").click(function() { 
        window.location.href = "profile?s=" + $("#input-code").val();
    })
});
