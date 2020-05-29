function playAudio(audio){
    (!audio.paused) ? audio.cloneNode().play() : audio.play();
}

function stopAudio(audio){
    audio.pause();
    audio.currentTime = 0;
}