import './styles.css';

import { calculateTrappedWater } from './algorithms/waterTank.js';

import { parseHeights } from './utils/validation.js';

import { renderWaterTank } from './visualization/svgRenderer.js';

// Application presets.
const EXAMPLES = {
  assignment: [0, 4, 0, 0, 0, 6, 0, 6, 4, 0],
  simple: [4, 0, 0, 4],
  multiple: [3, 0, 2, 0, 4],
  noWater: [1, 2, 3, 4, 5],
};

// DOM references.
const form = document.getElementById('water-form');

const input = document.getElementById('heights-input');

const errorMessage = document.getElementById('input-error');

const statusMessage = document.getElementById('calculation-status');

const totalWaterElement = document.getElementById('total-water');

const blockCountElement = document.getElementById('block-count');

const maxHeightElement = document.getElementById('max-height');

const combinedChart = document.getElementById('combined-chart');

const waterChart = document.getElementById('water-chart');

const breakdownBody = document.getElementById('breakdown-body');

const breakdownTotal = document.getElementById('breakdown-total');

const randomButton = document.getElementById('random-button');

const resetButton = document.getElementById('reset-button');

const exampleButtons = document.querySelectorAll('[data-example]');

// Error handling.
function showError(message) {
  errorMessage.textContent = message;
  errorMessage.hidden = false;

  input.setAttribute('aria-invalid', 'true');

  statusMessage.textContent =
    'Calculation failed. Previous results are unchanged.';
}

function clearError() {
  errorMessage.textContent = '';
  errorMessage.hidden = true;

  input.removeAttribute('aria-invalid');
}

// Update statistic cards.
function updateStatistics(heights, totalWater) {
  totalWaterElement.textContent = totalWater.toLocaleString('en-US');

  blockCountElement.textContent = String(heights.length);

  maxHeightElement.textContent = String(Math.max(0, ...heights));
}

// Render the calculation breakdown.
function renderBreakdown(heights, waterAtEachIndex, totalWater) {
  const fragment = document.createDocumentFragment();

  heights.forEach((height, index) => {
    const water = waterAtEachIndex[index];

    const row = document.createElement('tr');

    const values = [index, height, water, height + water];

    values.forEach((value, columnIndex) => {
      const cell = document.createElement('td');

      cell.textContent = String(value);

      if (columnIndex === 2 && water > 0) {
        cell.classList.add('water-value');
      }

      row.appendChild(cell);
    });

    fragment.appendChild(row);
  });

  breakdownBody.replaceChildren(fragment);

  breakdownTotal.textContent = totalWater.toLocaleString('en-US');
}

// Main application calculation.
function calculateAndRender() {
  let heights;

  try {
    heights = parseHeights(input.value);
  } catch (error) {
    showError(error.message);
    input.focus();
    return;
  }

  clearError();

  const { totalWater, waterAtEachIndex } = calculateTrappedWater(heights);

  updateStatistics(heights, totalWater);

  renderWaterTank(combinedChart, heights, waterAtEachIndex, 'combined');

  renderWaterTank(waterChart, heights, waterAtEachIndex, 'water');

  renderBreakdown(heights, waterAtEachIndex, totalWater);

  statusMessage.textContent =
    `Calculation complete. ${totalWater} units ` +
    `of water trapped across ${heights.length} positions.`;
}

// Apply a predefined or generated input.
function applyInput(heights) {
  input.value = heights.join(', ');

  calculateAndRender();
}

// Handle form submission.
form.addEventListener('submit', (event) => {
  event.preventDefault();

  calculateAndRender();
});

// Clear validation errors while the user edits.
input.addEventListener('input', () => {
  clearError();

  statusMessage.textContent = 'Input changed. Calculate to update the results.';
});

// Generate a random array.
randomButton.addEventListener('click', () => {
  const randomHeights = Array.from({ length: 12 }, () =>
    Math.floor(Math.random() * 9),
  );

  applyInput(randomHeights);
});

// Reset to the original assignment example.
resetButton.addEventListener('click', () => {
  applyInput(EXAMPLES.assignment);
});

// Handle example preset buttons.
exampleButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const exampleName = button.dataset.example;

    const example = EXAMPLES[exampleName];

    if (example) {
      applyInput(example);
    }
  });
});

// Render the initial assignment example.
applyInput(EXAMPLES.assignment);
