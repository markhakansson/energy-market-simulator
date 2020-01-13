// Original source code by
// https://tobiasahlin.com/moving-letters/
// with some modifications

function textFadeInOut (text, id, delayMultiplier) {
    var textWrapper = document.querySelector(id);
    textWrapper.textContent = text;
    textWrapper.innerHTML = textWrapper.textContent.replace(/\S/g, "<span class='letter'>$&</span>");

    anime.timeline({
        loop: false
    })
        .add({
            targets: '.ml12 .letter',
            translateX: [40, 0],
            translateZ: 0,
            opacity: [0, 1],
            easing: 'easeOutExpo',
            duration: 1200 * delayMultiplier,
            delay: (el, i) => 500 + 30 * i
        }).add({
            targets: '.ml12 .letter',
            translateX: [0, -30],
            opacity: [1, 0],
            easing: 'easeInExpo',
            duration: 1100 * delayMultiplier,
            delay: (el, i) => 100 + 30 * i
        });
}

function textFadeIn (text, id, delayMultiplier) {
    var textWrapper = document.querySelector(id);
    textWrapper.textContent = text;
    textWrapper.innerHTML = textWrapper.textContent.replace(/\S/g, "<span class='letter'>$&</span>");

    anime.timeline({
        loop: false
    })
        .add({
            targets: '.ml12 .letter',
            translateX: [40, 0],
            translateZ: 0,
            opacity: [0, 1],
            easing: 'easeOutExpo',
            duration: 1200 * delayMultiplier,
            delay: (el, i) => 500 + 30 * i
        });
}
