const calorieCounter = document.getElementById('calorie-counter');
const budgetNumberInput = document.getElementById('budget');
const entryDropdown = document.getElementById('entry-dropdown');
const addEntryButton = document.getElementById('add-entry');
const clearButton = document.getElementById('clear');
const output = document.getElementById('output');
let isError = false;

function cleanInputString(str) {
  // Remove unwanted characters: +, -, spaces
  return str.replace(/[+-\s]/g, '');
}

function isInvalidInput(str) {
  // Match scientific notation
  return /\d+e\d+/i.test(str);
}

function addEntry() {
  const targetInputContainer = document.querySelector(`#${entryDropdown.value} .input-container`);
  const entryNumber = targetInputContainer.querySelectorAll('input[type="text"]').length + 1;

  const HTMLString = `
    <label for="${entryDropdown.value}-${entryNumber}-name">Entry ${entryNumber} Name</label>
    <input type="text" id="${entryDropdown.value}-${entryNumber}-name" placeholder="Name" />
    <label for="${entryDropdown.value}-${entryNumber}-calories">Entry ${entryNumber} Calories</label>
    <input type="number" min="0" id="${entryDropdown.value}-${entryNumber}-calories" placeholder="Calories" />
  `;

  targetInputContainer.insertAdjacentHTML('beforeend', HTMLString);
}

function calculateCalories(e) {
  e.preventDefault();
  isError = false;

  const inputGroups = {
    breakfast: document.querySelectorAll("#breakfast input[type='number']"),
    lunch: document.querySelectorAll("#lunch input[type='number']"),
    dinner: document.querySelectorAll("#dinner input[type='number']"),
    snacks: document.querySelectorAll("#snacks input[type='number']"),
    exercise: document.querySelectorAll("#exercise input[type='number']")
  };

  const results = {};
  for (const [key, inputs] of Object.entries(inputGroups)) {
      results[key] = getCaloriesFromInputs(inputs);
      if (isError) return;
  }

  const budgetCalories = getCaloriesFromInputs([budgetNumberInput]);
  if (isError) return;

  const consumedCalories = results.breakfast + results.lunch + results.dinner + results.snacks;
  const remainingCalories = budgetCalories - consumedCalories + results.exercise;
  const surplusOrDeficit = remainingCalories < 0 ? 'Surplus' : 'Deficit';

  output.innerHTML = `
    <span class="${surplusOrDeficit.toLowerCase()}">${Math.abs(remainingCalories)} Calorie ${surplusOrDeficit}</span>
    <hr>
    <p>${budgetCalories} Calories Budgeted</p>
    <p>${consumedCalories} Calories Consumed</p>
    <p>${results.exercise} Calories Burned</p>
  `;

  output.classList.remove('hide');
}

function getCaloriesFromInputs(list) {
  let calories = 0;

  for (const item of list) {
      const currVal = cleanInputString(item.value);

      if (isInvalidInput(currVal)) {
        alert(`Invalid Input: ${currVal}`);
        isError = true;
        return 0;
      }

      calories += Number(currVal);
  }

  return calories;
}

function clearForm() {
  document.querySelectorAll('.input-container').forEach(container => container.innerHTML = '');
  budgetNumberInput.value = '';
  output.innerText = '';
  output.classList.add('hide');
}

// Attach event listeners
addEntryButton.addEventListener("click", addEntry);
calorieCounter.addEventListener("submit", calculateCalories);
clearButton.addEventListener("click", clearForm);