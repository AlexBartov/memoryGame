const imgSrcs = [
    "img/candy.png",
    "img/christmas_pudding.png",
    "img/christmas_tree.png",
    "img/elf_hat.png",
    "img/gift.png",
    "img/gingerbread_man.png",
    "img/happy_snowman.png",
    "img/ribbon.png",
    "img/santa.png",
    "img/teddy_bear_socks.png"
];
const loading = document.querySelector(".loading");
const container = document.querySelector(".container");
// backside image
const backSrc = "img/snowflake.png";
// images
let images = [];
let backImg;
// grid element
const grid = document.querySelector(".grid");
// card template element
const cardTemplate = document.querySelector("#template .flip-container");
// game grid row element
const row = document.querySelector("#template .grid-row");
const muteBtn = document.querySelector("#mute");
const replayBtn = document.querySelector("#replay");
const bestScore = document.querySelector(".best");
const currentScore = document.querySelector(".score");
// Events corresponding to card match
const correctEvent = new Event('correct');
const glowEvent = new Event('glow');
// bonus values
const triesBonus = 25;
const timeBonus = 20;
const maxBonusTries = 60;
const bonusTime = 120;
// number of pairs
const numPairs = imgSrcs.length;
let tries = 0;
// correct pairs
let correct = 0;
// selected cards
let selected = [];
// game cards
let cards = [];
// mute sound variable
let mute = false;
// start time
let start = null;
let best = localStorage && localStorage.getItem("christmas_memory_best") || 0;
let score = 0;
bestScore.innerHTML = best;

replayBtn.addEventListener("click", startGame);

muteBtn.addEventListener("click", () => {
    mute = !mute;
    muteBtn.classList.toggle("quiet");
});

// plays given audio source
// if sound is not muted
function playSound(sound) {
    if (!mute) {
        sound.play();
    }
}

const soundSrcs = ["sound/card-flip.wav", "sound/card-match.mp3", "sound/win-music.wav"]
const soundNames = ["flipSound", "matchSound", "winSound"];
let sounds = {};
let flipSound = [];

function flipCard(index) {
    playSound(flipSound[index]);
    cards[index].classList.toggle("flip");
}

// block/unblock page clicks event handling
const [blockClicks, unblockClicks] = (() => {
    let blocker = event => {
        event.stopPropagation();
        event.preventDefault;
    }
    let block = () => document.addEventListener("click", blocker, true);
    let unBlock = () => document.removeEventListener("click", blocker, true);
    return [block, unBlock];
})();

// populate grid
var gridIndexes = [];
for (let i = 0; i < numPairs; i++) {
    gridIndexes.push(i);
    gridIndexes.push(i);
}

/**
 * Shuffle game grid
 */
function shuffleGrid() {
    let j, temp, i;
    for (i = gridIndexes.length; i; i--) {
        j = Math.floor(Math.random() * i);
        temp = gridIndexes[i - 1];
        gridIndexes[i - 1] = gridIndexes[j];
        gridIndexes[j] = temp;
    }
}

/* From Modernizr, check which transition event is correct */
function whichTransitionEvent() {
    let el = document.createElement('fakeelement');
    let transitions = {
        'transition': 'transitionend',
        'OTransition': 'oTransitionEnd',
        'MozTransition': 'transitionend',
        'WebkitTransition': 'webkitTransitionEnd'
    }

    for (let t in transitions) {
        if (el.style[t] !== undefined) {
            return transitions[t];
        }
    }
}

/* Detect transition event */
let transitionEvent = whichTransitionEvent();

/**
 * Checks win conditions, and handles flipped cards
 */
function conditions() {
    tries++;
    if (selected.length > 1) {
        if (gridIndexes[selected[0]] === gridIndexes[selected[1]] &&
            selected[0] !== selected[1]) {
            correct++;
            selected.forEach((index, i) => {
                cards[index].dispatchEvent(correctEvent);
                // add animation transition finish event listener to second opened card
                if (i == 1) {
                    let sel = selected;
                    cards[index].addEventListener(transitionEvent, () => {
                        sel.forEach((index) => {
                            cards[index].dispatchEvent(glowEvent);
                        });
                        playSound(sounds.matchSound);
                        if (correct == numPairs)
                            setTimeout(gameOver, 500);
                    });
                }
            });
            selected = [];
        } else {
            if (selected[0] !== selected[1]) {
                let sel = selected;
                // swap cards, but not instantly
                setTimeout(() => {
                    sel.forEach((index) => {
                        flipCard(index);
                    });
                }, 500);
            }
            selected = [];
        }
    }
    calcScore();
}

/**
 * Remove all child nodes
 * of a given element
 * 
 * @param {Element} elt
 */
function clearNodes(elt) {
    while (elt.firstChild) {
        elt.removeChild(elt.firstChild);
    }
    return true;
}

/**
 * Gameover function
 */
function gameOver() {
    playSound(sounds.winSound);
    grid.classList.add("glow");
    if (score > best) {
        best = score;
        bestScore.innerHTML = best;
        localStorage && localStorage.setItem("christmas_memory_best", best);
    }
    console.log("you win!");
}

/**
 * Returns current time
 * 
 * @returns {Number}
 */
function time() {
    return Math.round((Date.now() - start) / 1000.0);
}

/**
 * Calculates current score
 */
function calcScore() {
    let bonusTime_ = (bonusTime - time()) * timeBonus;
    let bonusTries = (maxBonusTries - tries) * triesBonus;
    currentScore.innerHTML = score = (bonusTime_ > 0 ? bonusTime_ : 0) + (bonusTries > 0 ? bonusTries : 0);
}

// initialize game grid
function initGrid() {
    if (grid.childNodes.length) {
        clearNodes(grid);
    }
    let currentRow = null;
    gridIndexes.forEach((imgIndex, index) => {
        let image = images[imgIndex].cloneNode();
        let backImage = backImg.cloneNode();
        if (index % 5 == 0) {
            currentRow = row.cloneNode(true);
            grid.appendChild(currentRow);
        }
        let card = cardTemplate.cloneNode(true);
        card.id = "card_" + index;
        card.querySelector(".front").appendChild(image);
        card.querySelector(".back").appendChild(backImage);
        let clickHandler = () => {
            flipCard(index);
            selected.push(index);
            conditions();
        }
        let correctHandler = () => {
            card.removeEventListener("click", clickHandler);
            card.removeEventListener("correct", correctHandler);
        }
        let glowHandler = () => {
            image.classList.toggle("glow");
            card.removeEventListener("glow", glowHandler);
        }
        card.addEventListener("click", clickHandler);
        card.addEventListener("correct", correctHandler);
        card.addEventListener("glow", glowHandler);
        currentRow.appendChild(card);
        cards.push(card);
    });
    // initialize sounds
    // one flip audio source for each card
    flipSound = [];
    for (let i = 0; i < cards.length; i++) {
        flipSound.push(sounds.flipSound.cloneNode());
    }
}


/**
 * Flips all game cards
 */
function flipCards() {
    for (let i = 0; i < cards.length; i++) {
        // unblock clicks when last card is flipped
        if (i == cards.length - 1)
            setTimeout(() => {
                flipCard(i);
                unblockClicks();
            }, 100 * (i + 1));
        else
            setTimeout(() => flipCard(i), 100 * (i + 1));
    }
}

/**
 * Starts game
 */
function startGame() {
    blockClicks();
    correct = 0;
    tries = 0;
    cards = [];
    currentScore.innerHTML = 0;
    grid.classList.remove("glow");
    shuffleGrid();
    initGrid();
    setTimeout(flipCards, 1000);
}

// wait for all objects
(() => {
    let toggleLoading = () => {
        loading.classList.toggle("show");
        container.classList.toggle("hide");
    }
    toggleLoading();
    let triesLeft = 10;
    let loadObjects = () => {
        Promise.all([
            Promise.all(imgSrcs.map((src, index) =>
                new Promise((res, rej) => {
                    let image = document.createElement("img");
                    images[index] = image;
                    image.addEventListener("load", res);
                    image.addEventListener("error", rej);
                    image.src = src;
                })
            )),
            Promise.all(soundSrcs.map((src, index) =>
                new Promise((res, rej) => {
                    let audio = new Audio();
                    audio.addEventListener("loadeddata", res);
                    audio.addEventListener("error", rej);
                    audio.src = src;
                    sounds[soundNames[index]] = audio;
                })
            )),
            new Promise((res, rej) => {
                let image = document.createElement("img");
                image.addEventListener("load", res);
                image.addEventListener("error", rej);
                backImg = image;
                image.src = backSrc;
            })
        ]).then(() => {
            toggleLoading();
            startGame();
        }).catch(err => {
            console.log("objects load error: " + err.toString());
            console.log("Let's try again! Tries left: " + triesLeft--);
            if (triesLeft)
                loadObjects();
            else {
                console.log("Can't load objects!");
                alert("Can't load game!");
            }
        });
    }
    loadObjects();
})();