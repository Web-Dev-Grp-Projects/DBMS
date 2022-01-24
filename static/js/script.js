// When the user scrolls the page, execute myFunction 
window.onscroll = function() {myFunction()};

function myFunction() {
  var winScroll = document.body.scrollTop || document.documentElement.scrollTop;
  var height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  var scrolled = (winScroll / height) * 100;
  document.getElementById("myBar").style.width = scrolled + "%";
}

function showText(id,delay){
  var elem=document.getElementById(id);
  setTimeout(function(){elem.style.visibility='visible';},delay*1000)
}

window.onload = function(){
showText('delayedText1',0.6);
showText('delayedText2',0.8);
}