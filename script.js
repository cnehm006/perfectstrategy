let playerHand = [];
let dealerHand = [];
const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

function createDeck() {
    let deck = [];
    for (let suit of suits) {
        for (let value of values) {
            deck.push(value + ' of ' + suit);
        }
    }
    return deck;
}

function shuffleDeck(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
}

function deal() {
    let deck = shuffleDeck(createDeck());
    playerHand = [deck.pop(), deck.pop()];
    dealerHand = [deck.pop(), deck.pop()];
    displayCards();
}

function displayCards() {
    document.getElementById('playerCards').innerText = 'Your cards: ' + playerHand.join(', ');
    document.getElementById('dealerCards').innerText = 'Dealer cards: ' + dealerHand.join(', ');
}

function hit() {
    // Add functionality for player hit (deal another card to player)
}

function stand() {
    // Add functionality for player stand (end player's turn)
}

document.getElementById('dealButton').addEventListener('click', deal);
document.getElementById('hitButton').addEventListener('click', hit);
document.getElementById('standButton').addEventListener('click', stand);