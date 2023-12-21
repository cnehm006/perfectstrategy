let deck;

function calculateHandValue(hand) {
    let value = 0;
    let aceCount = 0;
    for (let card of hand) {
        let cardValue = card.split(' ')[0];
        if (['J', 'Q', 'K'].includes(cardValue)) {
            value += 10;
        } else if (cardValue === 'A') {
            aceCount++;
            value += 11;
        } else {
            value += parseInt(cardValue);
        }
    }
    while (value > 21 && aceCount > 0) {
        value -= 10;
        aceCount--;
    }
    return value;
}

function deal() {
    deck = shuffleDeck(createDeck());
    playerHand = [deck.pop(), deck.pop()];
    dealerHand = [deck.pop(), deck.pop()];
    displayCards();
    checkForEndOfGame();
}

function hit() {
    if (calculateHandValue(playerHand) < 21) {
        playerHand.push(deck.pop());
        displayCards();
        checkForEndOfGame();
    }
}

function stand() {
    // Dealer's turn to hit until reaching 17 or higher
    while (calculateHandValue(dealerHand) < 17) {
        dealerHand.push(deck.pop());
    }
    displayCards();
    checkForEndOfGame();
}

function checkForEndOfGame() {
    let playerValue = calculateHandValue(playerHand);
    let dealerValue = calculateHandValue(dealerHand);
    let gameOver = false;
    
    if (playerValue > 21) {
        gameOver = true;
        alert('You busted!');
    } else if (dealerValue > 21) {
        gameOver = true;
        alert('Dealer busted. You win!');
    } else if (playerHand.length === 5 && playerValue <= 21) {
        gameOver = true;
        alert('Five card trick! You win!');
    }

    if (gameOver) {
        document.getElementById('hitButton').disabled = true;
        document.getElementById('standButton').disabled = true;
    }
}

document.getElementById('dealButton').addEventListener('click', deal);
document.getElementById('hitButton').addEventListener('click', hit);
document.getElementById('standButton').addEventListener('click', stand);