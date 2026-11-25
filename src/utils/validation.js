export const MAX_BLOCKS = 100;
export const MAX_HEIGHT = 1000;

/**
 * Converts user input into an array of valid block heights.
 *
 * @param {string} input
 * @returns {number[]}
 * @throws {Error}
 */
export function parseHeights(input) {
  if (typeof input !== 'string') {
    throw new Error('Input must be a string.');
  }

  let value = input.trim();

  if (value.length === 0) {
    throw new Error('Please enter block heights.');
  }

  // Support both comma-separated input and array notation.
  if (value.startsWith('[') && value.endsWith(']')) {
    value = value.slice(1, -1).trim();
  }

  if (value.length === 0) {
    throw new Error('Please enter at least one block height.');
  }

  const parts = value.split(',');

  if (parts.length > MAX_BLOCKS) {
    throw new Error(`A maximum of ${MAX_BLOCKS} block positions is allowed.`);
  }

  return parts.map((part, index) => {
    const token = part.trim();

    // Accept only non-negative whole numbers.
    if (!/^\d+$/.test(token)) {
      throw new Error(`Position ${index + 1}: enter a non-negative integer.`);
    }

    const height = Number(token);

    if (!Number.isSafeInteger(height) || height > MAX_HEIGHT) {
      throw new Error(
        `Position ${index + 1}: height must be between 0 and ${MAX_HEIGHT}.`,
      );
    }

    return height;
  });
}
