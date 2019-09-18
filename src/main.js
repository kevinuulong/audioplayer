window.onload = function(){

  const {Howler, Howl} = require('howler');
  
  var sound = new Howl({
      src: ['sound.mp3']
  });
    
  sound.play();
}