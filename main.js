// Predefined set of values for the spinner
const spinnerValues = ["+0.01", "+0.15", "+0.25", "+0.45", "+0.75", "+0.85", "+1"];

for (let i = 0; i < 25; i++) {
    // Randomly select a value from the predefined set
    const randomValue = spinnerValues[Math.floor(Math.random() * spinnerValues.length)];
    const cellColor = (i % 2) ? 'middle' : '';

    document.querySelector('.scopeHidden > ul').innerHTML += `
      <li class="${cellColor}">${randomValue}</li>
    `;
}

function startSpinner() {
    const move = -150 * 15;
    const elm = (str) => document.querySelector(str);
    const elms = (str) => document.querySelectorAll(str);

    elm('.scopeHidden > ul').style.left = move + 'px';

    const index = -Math.floor((move + (elm('.scopeHidden').offsetWidth / 2) / -150) / 150) + 1;
    const selectedValue = elms('.scopeHidden > ul > li')[index].textContent;

    elms('.scopeHidden > ul > li')[index].style.background = 'red';

    // Add the selected value to the clicker balance after 3 seconds
    setTimeout(() => {
        addToBalance(selectedValue);
        closeSpinner();
    }, 3000);
}

function addToBalance(value) {
    // Remove the "+" sign and convert to a number
    const numericValue = parseFloat(value.replace('+', ''));
    // Add the value to the clicker balance
    score += numericValue;
    updateScore();
}

function closeSpinner() {
    const spinnerContainer = document.getElementById('spinner-container');
    spinnerContainer.style.display = 'none';
}
