import test from 'node:test';
import assert from 'node:assert/strict';

import {
  parseHeights,
  MAX_BLOCKS,
  MAX_HEIGHT,
} from '../src/utils/validation.js';

const validCases = [
  {
    name: 'Comma-separated heights',
    input: '3,0,4',
    expected: [3, 0, 4],
  },
  {
    name: 'Array notation',
    input: '[3,0,4]',
    expected: [3, 0, 4],
  },
  {
    name: 'Whitespace around values',
    input: ' 3, 0, 4 ',
    expected: [3, 0, 4],
  },
  {
    name: 'Single zero height',
    input: '0',
    expected: [0],
  },
  {
    name: 'Maximum allowed height',
    input: String(MAX_HEIGHT),
    expected: [MAX_HEIGHT],
  },
  {
    name: 'Original assignment input',
    input: '[0,4,0,0,0,6,0,6,4,0]',
    expected: [0, 4, 0, 0, 0, 6, 0, 6, 4, 0],
  },
];

for (const { name, input, expected } of validCases) {
  test(`Accepts: ${name}`, () => {
    assert.deepEqual(parseHeights(input), expected);
  });
}

const invalidCases = [
  { name: 'Empty input', input: '' },
  { name: 'Whitespace only', input: '   ' },
  { name: 'Empty array', input: '[]' },
  { name: 'Negative number', input: '3,-1,4' },
  { name: 'Decimal number', input: '3,2.5,4' },
  { name: 'Alphabetic input', input: '3,abc,4' },
  { name: 'Empty middle value', input: '3,,4' },
  { name: 'Trailing comma', input: '3,4,' },
  { name: 'Leading comma', input: ',3,4' },
  { name: 'Scientific notation', input: '1e3,0,4' },
  { name: 'Hexadecimal notation', input: '0x10,0,4' },
  { name: 'Infinity', input: 'Infinity,0,4' },
  { name: 'NaN', input: 'NaN,0,4' },
  { name: 'Unmatched brackets', input: '[3,0,4' },
  {
    name: 'Height above maximum',
    input: String(MAX_HEIGHT + 1),
  },
  {
    name: 'Unsafe integer',
    input: '999999999999999999999',
  },
  { name: 'Non-string input', input: null },
];

for (const { name, input } of invalidCases) {
  test(`Rejects: ${name}`, () => {
    assert.throws(() => parseHeights(input), Error);
  });
}

test('Accepts maximum number of block positions', () => {
  const input = Array(MAX_BLOCKS).fill('1').join(',');

  const result = parseHeights(input);

  assert.equal(result.length, MAX_BLOCKS);
});

test('Rejects too many block positions', () => {
  const input = Array(MAX_BLOCKS + 1)
    .fill('1')
    .join(',');

  assert.throws(() => parseHeights(input), /maximum/);
});
