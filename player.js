const song = document.querySelectorAll(".song");
const songs = document.querySelector(".songs-list");
const player_title = document.querySelector(".player-title");
const player_artist = document.querySelector(".player-author");
const current_time = document.querySelector(".current-time");
const total_time = document.querySelector(".total-time");
const player_image = document.querySelector(".player-details > img");
const play_pause = document.querySelector(".play-pause");
const progressFilled = document.querySelector(".progress");
const progress_Bar = document.querySelector(".time-progress-bar");
const nextBtn = document.querySelector(".next");
const backBtn = document.querySelector(".previous");
var isMove = false;
var target;

/* set song duration for songs in the song list */

window.addEventListener("load", function () {
    for (i = 0; i < song.length; i++) {
        var a = song[i].querySelector("audio");
        var b = song[i].querySelector(".song-time p");
        let m = parseInt(a.duration / 60);
        if (m < 10) {
            m = "0" + m;
        }

        let s = parseInt(a.duration % 60);
        if (s < 10) {
            s = "0" + s;
        }
        b.innerHTML = m + ":" + s;
    }
});

for (i = 0; i < song.length; i++) {
    song[i].addEventListener('click', (e) => {

        // /* store cliked song in a variable for other function */

        target = e.currentTarget;

        /*remove active class from all songs and add active class to the selected song */

        active(target);

        /* pass song details to music player */

        pass(target);

        /* play the selected song */

        playSelected(target);

        /* update progress bar */

        progressUpdate(target);

        /* update song playing time */

        timeUpdate(target);
        return (target);
    });
}

/* Add and remove active class */

function active(e) {
    for (j = 0; j < song.length; j++) {

        /* remove active class from all elements */

        song[j].classList.remove('active');
    }

    /* add active class to the selected song */

    e.classList.add('active');
}

/* pass song details to music player */

function pass(e) {
    player_title.innerHTML = e.querySelector(".song-title").innerHTML;
    player_artist.innerHTML = "By " + e.querySelector(".song-artist").innerHTML;
    player_image.src = e.querySelector(".about img").src;
    player_image.style.display = "block";
}

/* play selected song */

function playSelected(e) {
    for (j = 0; j < song.length; j++) {

        /* pause all songs */

        song[j].querySelector("audio").pause();
        PlayPauseBtn();
    }

    /* play selected song */

    setTimeout(function () {
        e.querySelector("audio").play();

        /* change play-pause icon */

        PlayPauseBtn();
    }, 500);
}

/* play and pause song when button is clicked */

play_pause.addEventListener('click', () => {
    if (target.querySelector("audio").paused) {
        target.querySelector("audio").play();
    } else {
        target.querySelector("audio").pause();
    }
    PlayPauseBtn();
});

/* change play-pause icon */

function PlayPauseBtn() {
    if (target.querySelector("audio").paused) {
        play_pause.querySelector(".play").style.display = "block";
        play_pause.querySelector(".pause").style.display = "none";
    } else {
        play_pause.querySelector(".play").style.display = "none";
        play_pause.querySelector(".pause").style.display = "block";
    }
}

/* update song time and progress bar */

function progressUpdate(t) {
    // console.log(t);
    let currentAudio = t.querySelector("audio");
    currentAudio.currentTime = 0;
    let progressFilledWidth = 0 + "%";
    currentAudio.addEventListener("timeupdate", () => {
        progressFilledWidth = (currentAudio.currentTime / currentAudio.duration) * 100 + "%";
        progressFilled.style.width = progressFilledWidth;
        if (t !== songs.lastElementChild && currentAudio.play && currentAudio.duration == currentAudio.currentTime) {
            next();
        }
        if (t == songs.lastElementChild && currentAudio.duration == currentAudio.currentTime) {
            currentAudio.pause();
            PlayPauseBtn();
        }
    });
}

/* update current song playing tine */

function timeUpdate(t) {
    let currentAudio = t.querySelector("audio");
    currentAudio.addEventListener("timeupdate", () => {
        current_time.innerHTML = "0:00"

        /* update total song time */

        let min = parseInt(currentAudio.duration / 60);
        if (min < 10) {
            min = "0" + min;
        }

        let sec = parseInt(currentAudio.duration % 60);
        if (sec < 10) {
            sec = "0" + sec;
        }
        total_time.innerHTML = min + ":" + sec;

        /* update current time */

        let mins = Math.floor(currentAudio.currentTime / 60);
        let secs = Math.floor(currentAudio.currentTime % 60);
        if (secs < 10) {
            secs = '0' + String(secs);
        }
        current_time.innerHTML = mins + ':' + secs;
    });
}

/* shifting progress bar time */

function progressMove(e) {
    // console.log(target);
    let Audio = target.querySelector("audio");
    const currentTime = ((e.clientX - progress_Bar.getBoundingClientRect().left) / progress_Bar.offsetWidth) * Audio.duration;
    Audio.currentTime = currentTime;
}

/* executes progressMove function when clicked on progress bar */

progress_Bar.addEventListener("pointerdown", (e) => {
    progressMove(e);
    isMove = true;
});

/* executes progressMove function when cursor is moved on progress bar */

document.addEventListener("pointermove", (e) => {
    if (isMove) {
        progressMove(e);
        song.muted = true;
    }
});

/* unmute song when cursor is unclicked */

document.addEventListener("pointerup", () => {
    isMove = false;
    song.muted = false;
});

function next() {
    target = target.nextElementSibling;

    /*remove active class from all songs and add active class to the selected song */

    active(target);

    /* pass song details to music player */

    pass(target);

    /* play the selected song */

    playSelected(target);

    /* update progress bar */

    progressUpdate(target);

    /* update song playing time */

    timeUpdate(target);
    return (target);
}

function back() {
    target = target.previousElementSibling;

    /*remove active class from all songs and add active class to the selected song */

    active(target);

    /* pass song details to music player */

    pass(target);

    /* play the selected song */

    playSelected(target);

    /* update progress bar */

    progressUpdate(target);

    /* update song playing time */

    timeUpdate(target);
    return (target);
}

/* calls for next function when next button is clicked */

nextBtn.addEventListener('click', () => {
    if (target !== songs.lastElementChild) {
        next();
    }
});

/* calls for back function when previous button is clicked */

backBtn.addEventListener('click', () => {
    if (target !== songs.firstElementChild) {
        back();
    }
});