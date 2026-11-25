import {
  calculateWaterBruteForce,
  calculateWaterPrefixSuffix,
  calculateWaterTwoPointers,
  calculateTrappedWater,
} from './algorithms/waterTank.js';

const heights = [0, 4, 0, 0, 0, 6, 0, 6, 4, 0];

console.log('================================');
console.log('Water Tank Algorithm');
console.log('================================');

console.log('Input:', heights);

console.log('Brute Force:', calculateWaterBruteForce(heights));

console.log('Prefix Suffix:', calculateWaterPrefixSuffix(heights));

console.log('Two Pointers:', calculateWaterTwoPointers(heights));

const result = calculateTrappedWater(heights);

console.log('Final Result:', result);

console.log('================================');
