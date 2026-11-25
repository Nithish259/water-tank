import test from 'node:test';
import assert from 'node:assert/strict';

import {
  calculateWaterBruteForce,
  calculateWaterPrefixSuffix,
  calculateWaterTwoPointers,
  calculateTrappedWater,
} from '../src/algorithms/waterTank.js';

const testCases = [
  {
    name: 'Original assignment example',
    input: [0, 4, 0, 0, 0, 6, 0, 6, 4, 0],
    expected: 18,
  },
  {
    name: 'Empty array',
    input: [],
    expected: 0,
  },
  {
    name: 'Single block',
    input: [5],
    expected: 0,
  },
  {
    name: 'Two blocks',
    input: [5, 3],
    expected: 0,
  },
  {
    name: 'All zero heights',
    input: [0, 0, 0, 0],
    expected: 0,
  },
  {
    name: 'Equal block heights',
    input: [4, 4, 4, 4],
    expected: 0,
  },
  {
    name: 'Increasing heights',
    input: [1, 2, 3, 4, 5],
    expected: 0,
  },
  {
    name: 'Decreasing heights',
    input: [5, 4, 3, 2, 1],
    expected: 0,
  },
  {
    name: 'Single gap',
    input: [3, 0, 3],
    expected: 3,
  },
  {
    name: 'Multiple gaps',
    input: [3, 0, 2, 0, 4],
    expected: 7,
  },
  {
    name: 'Taller left boundary',
    input: [4, 0, 2, 0, 3],
    expected: 7,
  },
  {
    name: 'Classic trapping rainwater example',
    input: [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1],
    expected: 6,
  },
  {
    name: 'Wide gap',
    input: [5, 0, 0, 0, 5],
    expected: 15,
  },
  {
    name: 'Large block heights',
    input: [1000, 0, 1000],
    expected: 1000,
  },
];

// Verify all four implementations.
for (const { name, input, expected } of testCases) {
  test(name, () => {
    assert.equal(calculateWaterBruteForce(input), expected);

    assert.equal(calculateWaterPrefixSuffix(input), expected);

    assert.equal(calculateWaterTwoPointers(input), expected);

    assert.equal(calculateTrappedWater(input).totalWater, expected);
  });
}

// Verify exact water distribution.
test('Returns correct water at each index', () => {
  const result = calculateTrappedWater([0, 4, 0, 0, 0, 6, 0, 6, 4, 0]);

  assert.deepEqual(result, {
    totalWater: 18,
    waterAtEachIndex: [0, 0, 4, 4, 4, 0, 6, 0, 0, 0],
  });
});

// Verify the algorithm does not mutate input.
test('Does not modify the original input', () => {
  const input = Object.freeze([3, 0, 2, 0, 4]);

  calculateWaterBruteForce(input);
  calculateWaterPrefixSuffix(input);
  calculateWaterTwoPointers(input);
  calculateTrappedWater(input);

  assert.deepEqual(input, [3, 0, 2, 0, 4]);
});

// Verify output consistency.
test('Water distribution sum equals total water', () => {
  const result = calculateTrappedWater([3, 0, 2, 0, 4]);

  const sum = result.waterAtEachIndex.reduce(
    (total, water) => total + water,
    0,
  );

  assert.equal(sum, result.totalWater);
});

// Verify output length.
test('Water distribution matches input length', () => {
  const input = [3, 0, 2, 0, 4];

  const result = calculateTrappedWater(input);

  assert.equal(result.waterAtEachIndex.length, input.length);
});

// Compare implementations across every small input
// of length 0–6 with heights ranging from 0–3.
test('Exhaustive small-input algorithm comparison', () => {
  function verify(input) {
    const expected = calculateWaterBruteForce(input);

    assert.equal(calculateWaterPrefixSuffix(input), expected);

    assert.equal(calculateWaterTwoPointers(input), expected);

    const result = calculateTrappedWater(input);

    assert.equal(result.totalWater, expected);

    // Independently verify water at every index.
    for (let i = 0; i < input.length; i++) {
      const leftMax = Math.max(...input.slice(0, i + 1));

      const rightMax = Math.max(...input.slice(i));

      const expectedWater = Math.min(leftMax, rightMax) - input[i];

      assert.equal(result.waterAtEachIndex[i], expectedWater);
    }
  }

  function generate(input, remaining) {
    if (remaining === 0) {
      verify(input);
      return;
    }

    for (let height = 0; height <= 3; height++) {
      generate([...input, height], remaining - 1);
    }
  }

  for (let length = 0; length <= 6; length++) {
    generate([], length);
  }
});
