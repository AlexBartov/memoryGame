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
var cards = [];
const grid = document.querySelector(".grid");
const backImg = "img/snowflake.png";
// Event corresponding to card match
var correctEvent = new Event('correct');
var glowEvent = new Event('glow');

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
for (let i = 0; i < imgSrcs.length; i++) {
    gridIndexes.push(i);
    gridIndexes.push(i);
}
// shuffle grid
gridIndexes.sort(() => .5 - Math.random());

var correct = 0;
var selected = [];

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
    if (selected.length > 1) {
        if (gridIndexes[selected[0]] === gridIndexes[selected[1]] &&
            selected[0] !== selected[1]) {
            selected.forEach((index, i) => {
                cards[index].dispatchEvent(correctEvent);
                // add animation transition finish event listener to second opened card
                if (i == 1) {
                    let sel = selected;
                    cards[index].addEventListener(transitionEvent, () => sel.forEach((index) => {
                        cards[index].dispatchEvent(glowEvent);
                    }));
                }
            });
            correct++;
            if (correct == imgSrcs.length)
                setTimeout(gameOver, 500);
            selected = [];
        } else {
            let sel = selected;
            // swap cards, but not instantly
            setTimeout(() => {
                sel.forEach((index) => {
                    cards[index].classList.toggle("flip");
                });
            }, 500);
            selected = [];
        }
    }
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
    clearNodes(grid);
    console.log("you win!");
}

// draw grid
(() => {
    let cardTemplate = document.querySelector("#template .flip-container");
    let row = document.querySelector("#template .grid-row");
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
            card.classList.toggle("flip");
            selected.push(index);
            conditions();
        }
        let correctHandler = () =>
            card.removeEventListener("click", clickHandler);
        let glowHandler = () =>
            image.classList.toggle("glow");
        card.addEventListener("click", clickHandler);
        card.addEventListener("correct", correctHandler);
        card.addEventListener("glow", glowHandler);
        currentRow.appendChild(card);
        cards.push(card);
    });
})();

function flipCards() {
    let i = 0;
    let timer = setInterval(() => {
        if (i >= cards.length) {
            clearTimeout(timer);
            unblockClicks();
        } else {
            cards[i].classList.toggle("flip");
            i++;
        }
    }, 100);
}
blockClicks();
setTimeout(flipCards, 1000);