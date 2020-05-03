$(document).ready(function(){
    $(window).scroll(function(){
        $("#topbar").css("opacity", 1 - $(window).scrollTop() / $('#header').height()/0.8);
    });
});