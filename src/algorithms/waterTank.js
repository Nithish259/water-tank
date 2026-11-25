/**
 * Calculates trapped rainwater using brute force.
 *
 * Time Complexity: O(n²)
 * Auxiliary Space Complexity: O(1)
 *
 * @param {number[]} heights
 * @returns {number}
 */
export function calculateWaterBruteForce(heights) {
  const n = heights.length;

  let totalWater = 0;

  for (let i = 0; i < n; i++) {
    let leftMax = 0;
    let rightMax = 0;

    // Find the tallest block on the left.
    for (let j = 0; j <= i; j++) {
      leftMax = Math.max(leftMax, heights[j]);
    }

    // Find the tallest block on the right.
    for (let j = i; j < n; j++) {
      rightMax = Math.max(rightMax, heights[j]);
    }

    // Calculate the maximum possible water level.
    const waterLevel = Math.min(leftMax, rightMax);

    // Calculate water stored at the current index.
    const trappedWater = waterLevel - heights[i];

    // Accumulate the trapped water.
    totalWater += trappedWater;
  }

  return totalWater;
}

/**
 * Calculates trapped rainwater using prefix
 * and suffix maximum arrays.
 *
 * Time Complexity: O(n)
 * Auxiliary Space Complexity: O(n)
 *
 * @param {number[]} heights
 * @returns {number}
 */
export function calculateWaterPrefixSuffix(heights) {
  const n = heights.length;

  if (n < 3) {
    return 0;
  }

  const leftMax = new Array(n).fill(0);
  const rightMax = new Array(n).fill(0);

  // Initialize the first left maximum.
  leftMax[0] = heights[0];

  // Build prefix maximums.
  for (let i = 1; i < n; i++) {
    leftMax[i] = Math.max(leftMax[i - 1], heights[i]);
  }

  // Initialize the last right maximum.
  rightMax[n - 1] = heights[n - 1];

  // Build suffix maximums.
  for (let i = n - 2; i >= 0; i--) {
    rightMax[i] = Math.max(rightMax[i + 1], heights[i]);
  }

  let totalWater = 0;

  // Calculate trapped water at each position.
  for (let i = 0; i < n; i++) {
    const waterLevel = Math.min(leftMax[i], rightMax[i]);

    totalWater += waterLevel - heights[i];
  }

  return totalWater;
}

/**
 * Calculates trapped rainwater using two pointers.
 *
 * Time Complexity: O(n)
 * Auxiliary Space Complexity: O(1)
 *
 * @param {number[]} heights
 * @returns {number}
 */
export function calculateWaterTwoPointers(heights) {
  const n = heights.length;

  if (n < 3) {
    return 0;
  }

  let left = 0;
  let right = n - 1;

  let leftMax = 0;
  let rightMax = 0;

  let totalWater = 0;

  while (left <= right) {
    // Update the known boundary heights.
    leftMax = Math.max(leftMax, heights[left]);
    rightMax = Math.max(rightMax, heights[right]);

    if (leftMax <= rightMax) {
      // The left maximum determines the water level.
      totalWater += leftMax - heights[left];

      left++;
    } else {
      // The right maximum determines the water level.
      totalWater += rightMax - heights[right];

      right--;
    }
  }

  return totalWater;
}

/**
 * Calculates total trapped rainwater and the
 * water stored at each block position.
 *
 * Time Complexity: O(n)
 * Auxiliary Space: O(1), excluding output
 * Output Space: O(n)
 *
 * @param {number[]} heights
 * @returns {{
 *   totalWater: number,
 *   waterAtEachIndex: number[]
 * }}
 */
export function calculateTrappedWater(heights) {
  const n = heights.length;

  const waterAtEachIndex = new Array(n).fill(0);

  if (n < 3) {
    return {
      totalWater: 0,
      waterAtEachIndex,
    };
  }

  let left = 0;
  let right = n - 1;

  let leftMax = 0;
  let rightMax = 0;

  let totalWater = 0;

  while (left <= right) {
    leftMax = Math.max(leftMax, heights[left]);
    rightMax = Math.max(rightMax, heights[right]);

    if (leftMax <= rightMax) {
      const trappedWater = leftMax - heights[left];

      waterAtEachIndex[left] = trappedWater;

      totalWater += trappedWater;

      left++;
    } else {
      const trappedWater = rightMax - heights[right];

      waterAtEachIndex[right] = trappedWater;

      totalWater += trappedWater;

      right--;
    }
  }

  return {
    totalWater,
    waterAtEachIndex,
  };
}
