let score = 0;
let autoclickerCost = 10;
let autoclickerCount = 0;
let autoclickerInterval = 10000; // 10 seconds per click
let autoclickers = [];
let minedThroughClicks = 0; // To track TIME mined through clicks

const TOTAL_TOKENS = 2520000;
const TOTAL_MONTHS = 8;
const TOTAL_USERS = 5000; // Adjusted based on the first project's specification
const ORIGINAL_TOKENS_PER_SECOND = 0.005395833 / 10; // Original rate
const TOKENS_PER_SECOND = ORIGINAL_TOKENS_PER_SECOND * 3; // 3 times faster

const scoreElement = document.getElementById('score');
const clickButton = document.getElementById('click-button');
const getBonusButton = document.getElementById('get-bonus');
const get2TimeButton = document.getElementById('get-2-time');
const timeFortuneButton = document.getElementById('time-fortune');
const get2TimeTimerElement = document.getElementById('get-2-time-timer');
const get2TimeTimerDisplay = document.getElementById('get-2-time-timer-display');
const timeFortuneTimerElement = document.getElementById('time-fortune-timer');
const timeFortuneTimerDisplay = document.getElementById('time-fortune-timer-display');
const rewardMessage = document.getElementById('reward-message');
const spinnerContainer = document.getElementById('spinner-container');

let get2TimeTimerInterval;
let get2TimeTimerEnd;
let timeFortuneTimerInterval;
let timeFortuneTimerEnd;

// Initialize buttons' state
getBonusButton.disabled = true;
get2TimeButton.disabled = false;
timeFortuneButton.disabled = false;

clickButton.addEventListener('click', (event) => {
    increaseScore();
    createFlyOutAnimation(event);
});

getBonusButton.addEventListener('click', () => {
    getBonus();
});

get2TimeButton.addEventListener('click', () => {
    get2Time();
});

timeFortuneButton.addEventListener('click', () => {
    showSpinner();
    startTimeFortuneTimer();
});

function increaseScore() {
    const timeMined = TOKENS_PER_SECOND;
    score += timeMined;
    minedThroughClicks += timeMined;
    updateScore();
    checkBonusEligibility();
}

function updateScore() {
    scoreElement.textContent = score.toFixed(9); // Display with 9 decimal places
}

function getBonus() {
    if (minedThroughClicks >= 6) {
        score += 8;
        minedThroughClicks -= 6; // Subtract the required TIME to reset the eligibility
        updateScore();
        checkBonusEligibility();
    } else {
        console.error('You need to mine at least 6 TIME through clicks to get the bonus');
    }
}

function get2Time() {
    score += 2;
    updateScore();
    startGet2TimeTimer();
}

function startGet2TimeTimer() {
    get2TimeTimerEnd = new Date().getTime() + 24 * 60 * 60 * 1000; // 24 hours from now
    get2TimeTimerElement.style.display = 'block';
    updateGet2TimeTimer();
    get2TimeTimerInterval = setInterval(updateGet2TimeTimer, 1000);
    get2TimeButton.disabled = true;
}

function updateGet2TimeTimer() {
    const now = new Date().getTime();
    const distance = get2TimeTimerEnd - now;

    if (distance <= 0) {
        clearInterval(get2TimeTimerInterval);
        get2TimeTimerElement.style.display = 'none';
        get2TimeButton.disabled = false;
    } else {
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        get2TimeTimerDisplay.textContent = `${hours}h ${minutes}m ${seconds}s`;
    }
}

function startTimeFortuneTimer() {
    timeFortuneTimerEnd = new Date().getTime() + 2 * 60 * 60 * 1000; // 2 hours from now
    timeFortuneTimerElement.style.display = 'block';
    updateTimeFortuneTimer();
    timeFortuneTimerInterval = setInterval(updateTimeFortuneTimer, 1000);
    timeFortuneButton.disabled = true;
}

function updateTimeFortuneTimer() {
    const now = new Date().getTime();
    const distance = timeFortuneTimerEnd - now;

    if (distance <= 0) {
        clearInterval(timeFortuneTimerInterval);
        timeFortuneTimerElement.style.display = 'none';
        timeFortuneButton.disabled = false;
    } else {
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        timeFortuneTimerDisplay.textContent = `${hours}h ${minutes}m ${seconds}s`;
    }
}

function checkBonusEligibility() {
    if (minedThroughClicks >= 6) {
        getBonusButton.disabled = false;
    } else {
        getBonusButton.disabled = true;
    }
}

// Create fly-out animation
function createFlyOutAnimation(event) {
    const flyOut = document.createElement('div');
    flyOut.classList.add('fly-out');
    flyOut.style.left = `${event.clientX}px`;
    flyOut.style.top = `${event.clientY}px`;
    
    // Add the reduced map image to the fly-out
    const flyOutImage = document.createElement('img');
    flyOutImage.src = 'image.png'; // The image to fly out
    flyOutImage.style.width = '50px'; // Adjust the size as needed
    flyOutImage.style.height = '50px'; // Adjust the size as needed
    flyOutImage.style.borderRadius = '50%'; // Keep it circular
    
    flyOut.appendChild(flyOutImage);

    document.body.appendChild(flyOut);

    // Remove the element after the animation is done
    flyOut.addEventListener('animationend', () => {
        flyOut.remove();
    });
}

// Show the spinner
function showSpinner() {
    spinnerContainer.style.display = 'flex';
}

// Add value to balance
function addToBalance(value) {
    // Remove the "+" sign and convert to a number
    const numericValue = parseFloat(value.replace('+', ''));
    // Add the value to the clicker balance
    score += numericValue;
    updateScore();
}

// Close the spinner
function closeSpinner() {
    spinnerContainer.style.display = 'none';
}

// Initialize the score and check button eligibility
updateScore();
checkBonusEligibility();
