let deck;
const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
let playerHand = [];
let dealerHand = [];
let score = 0;
let totalHandsPlayed = 0;

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

function isSoftHand(hand) {
    return hand.includes('A') && calculateHandValue(hand) <= 21;
}


function shouldSplit(playerHand, dealerCard) {
    if (playerHand.length !== 2 || playerHand[0].split(' ')[0] !== playerHand[1].split(' ')[0]) {
        return false;
    }

    let playerCardValue = playerHand[0].split(' ')[0];
    let dealerValue = dealerCard.split(' ')[0];

    switch (playerCardValue) {
        case 'A':
            return true;
        case '10':
        case 'J':
        case 'Q':
        case 'K':
            return false;
        case '9':
            return !(dealerValue === '7' || dealerValue === '10' || dealerValue === 'J' || dealerValue === 'Q' || dealerValue === 'K' || dealerValue === 'A');
        case '8':
            return true;
        case '7':
            return dealerValue >= '2' && dealerValue <= '7';
        case '6':
            return dealerValue >= '2' && dealerValue <= '6';
        case '5':
            return false;
        case '4':
            return dealerValue === '5' || dealerValue === '6';
        case '3':
        case '2':
            return dealerValue >= '2' && dealerValue <= '7';
        default:
            return false;
    }
}

function shouldDouble(playerHand, dealerCard) {
    if (playerHand.length !== 2) {
        return false;
    }

    let playerValue = calculateHandValue(playerHand);
    let dealerValue = dealerCard.split(' ')[0];

    if (isSoftHand(playerHand)) {
        switch (playerValue) {
            case 20:
                return false;
            case 19:
                return dealerValue === '6';
            case 18:
                return dealerValue >= '2' && dealerValue <= '6';
            // Continue for other soft totals
        }
    } else {
        switch (playerValue) {
            case 11:
                return true;
            case 10:
                return dealerValue !== '10' && dealerValue !== 'A';
            case 9:
                return dealerValue >= '3' && dealerValue <= '6';
            // Continue for other hard totals
        }
    }

    return false;
}

function basicStrategyDecision(playerHand, dealerCard) {
    if (shouldSplit(playerHand, dealerCard)) {
        return 'split';
    }

    if (shouldDouble(playerHand, dealerCard)) {
        return 'double';
    }

    let playerValue = calculateHandValue(playerHand);
    let dealerValue = dealerCard.split(' ')[0];

    if (isSoftHand(playerHand)) {
        if (playerValue >= 19) {
            return 'stand';
        } else if (playerValue === 18) {
            return dealerValue === '9' || dealerValue === '10' || dealerValue === 'A' ? 'hit' : 'stand';
        } else {
            return 'hit';
        }
    } else {
        if (playerValue >= 17) {
            return 'stand';
        } else if (playerValue >= 13 && playerValue <= 16) {
            return dealerValue >= '2' && dealerValue <= '6' ? 'stand' : 'hit';
        } else if (playerValue === 12) {
            return dealerValue >= '4' && dealerValue <= '6' ? 'stand' : 'hit';
        } else {
            return 'hit';
        }
    }
}

function displayCards(showAllDealerCards = false) {
    document.getElementById('playerCards').innerText = 'Your cards: ' + playerHand.join(', ');
    let dealerCardDisplay = showAllDealerCards ? dealerHand.join(', ') : dealerHand[0] + ', [Hidden]';
    document.getElementById('dealerCards').innerText = 'Dealer cards: ' + dealerCardDisplay;
}

function updateScoreDisplay() {
    let scorePercentage = totalHandsPlayed === 0 ? 0 : (score / totalHandsPlayed * 100).toFixed(2);
    document.getElementById('scoreDisplay').innerText = `Score: ${score}/${totalHandsPlayed} (${scorePercentage}%)`;
}

function disableActionButtons() {
    document.getElementById('hitButton').disabled = true;
    document.getElementById('standButton').disabled = true;
    document.getElementById('doubleButton').disabled = true;
    document.getElementById('splitButton').disabled = true;
}

function enableDealButton() {
    document.getElementById('dealButton').disabled = false;
}

function disableDealButton() {
    document.getElementById('dealButton').disabled = true;
}

function evaluateFirstDecision(playerAction) {
    let recommendedAction = basicStrategyDecision(playerHand, dealerHand[0]);

    if (playerAction === recommendedAction) {
        score++;
        alert("Correct decision! The recommended action was: " + recommendedAction);
    } else {
        alert("Incorrect decision. The recommended action was: " + recommendedAction);
    }

    updateScoreDisplay();

    // Disable action buttons after the decision is made
    document.getElementById('hitButton').disabled = true;
    document.getElementById('standButton').disabled = true;
    document.getElementById('doubleButton').disabled = true;
    document.getElementById('splitButton').disabled = true;

    // Re-enable the deal button for the next round
    document.getElementById('dealButton').disabled = false;
}

function onHit() {
    evaluateFirstDecision('hit');
}

function onStand() {
    evaluateFirstDecision('stand');
}

function onDouble() {
    evaluateFirstDecision('double');
}

function onSplit() {
    evaluateFirstDecision('split');
}

function deal() {
    let playerBlackjack, dealerBlackjack;
    do {
        deck = shuffleDeck(createDeck());
        playerHand = [deck.pop(), deck.pop()];
        dealerHand = [deck.pop()];

        let playerValue = calculateHandValue(playerHand);
        let dealerValue = calculateHandValue(dealerHand);
        playerBlackjack = (playerValue === 21);
        dealerBlackjack = (dealerValue === 21);
    } while (playerBlackjack || dealerBlackjack);

    displayCards();
    totalHandsPlayed++;
    updateScoreDisplay();

    // Enable action buttons
    document.getElementById('hitButton').disabled = false;
    document.getElementById('standButton').disabled = false;
    document.getElementById('doubleButton').disabled = false;
    document.getElementById('splitButton').disabled = false;

    // Disable the deal button during player's turn
    document.getElementById('dealButton').disabled = true;
}

document.getElementById('dealButton').addEventListener('click', deal);
document.getElementById('hitButton').addEventListener('click', onHit);
document.getElementById('standButton').addEventListener('click', onStand);
document.getElementById('doubleButton').addEventListener('click', onDouble);
document.getElementById('splitButton').addEventListener('click', onSplit);

disableActionButtons();