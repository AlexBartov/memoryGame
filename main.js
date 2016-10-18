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
const backImg = "img/snowflake.png";
const grid = document.querySelector(".grid");
const cardTemplate = document.querySelector("#template .flip-container");
const row = document.querySelector("#template .grid-row");
const bestScore = document.querySelector(".best");
const currentScore = document.querySelector(".score");
// Events corresponding to card match
const correctEvent = new Event('correct');
const glowEvent = new Event('glow');
const triesBonus = 25;
const timeBonus = 20;
const maxBonusTries = 60;
const bonusTime = 120;
let numPairs = imgSrcs.length;
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
let best = localStorage.getItem("christmas_memory_best") || 0;
let score = 0;
bestScore.innerHTML = best;

function playSound(sound) {
    if (!mute) {
        sound.play();
    }
}
const sounds = {
    flipSound: new Audio("sound/card-flip.wav"),
    matchSound: new Audio("sound/card-match.mp3"),
    winSound: new Audio("sound/win-music.wav")
}

let flipSound = [];

function flipCard(index) {
    // flipSound[index].play();
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
// shuffle grid
gridIndexes.sort(() => .5 - Math.random());

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
                        // sounds.matchSound.play();
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
 * GameOver function
 */
function gameOver() {
    // sounds.winSound.play();
    playSound(sounds.winSound);
    grid.classList.add("glow");
    // clearNodes(grid);
    if (score > best) {
        best = score;
        bestScore.innerHTML = best;
        localStorage.setItem("christmas_memory_best", best);
    }
    console.log("you win!");
}

function time() {
    return Math.round((Date.now() - start) / 1000.0);
}

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
        let image = document.createElement("img");
        image.src = imgSrcs[imgIndex];
        let backImage = document.createElement("img");
        backImage.src = backImg;
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


function flipCards() {
    let i = 0;
    let timer = setInterval(() => {
        if (i >= cards.length) {
            clearTimeout(timer);
            start = Date.now();
            unblockClicks();
        } else {
            flipCard(i);
            i++;
        }
    }, 100);
}

function startGame() {
    correct = 0;
    tries = 0;
    cards = [];
    grid.classList.remove("glow");
    initGrid();
    blockClicks();
    setTimeout(flipCards, 1000);
}

startGame();