# Water Tank — Rainwater Trapping Visualizer

An interactive web application that calculates and visualizes the amount of rainwater trapped between blocks of varying heights using an optimized two-pointer algorithm.

Developed as part of the Everquint Full Stack Developer Interview Assessment.

## Overview

Given an array of non-negative integers representing block heights, the application determines how many units of water can be trapped between the blocks.

Each block has a unit width. The amount of water trapped at a particular position depends on the tallest boundaries to its left and right.

The application combines efficient algorithmic computation with dynamic SVG visualizations to make the solution intuitive and interactive.

## Features

- Optimized two-pointer rainwater trapping algorithm.
- Brute-force and prefix-suffix implementations for algorithm comparison.
- Dynamic SVG visualization of blocks and trapped water.
- Separate visualization displaying only trapped water.
- Custom input supporting comma-separated values and array notation.
- Real-time calculation through interactive controls.
- Random input generation.
- Predefined example configurations.
- Reset functionality.
- Detailed per-index calculation breakdown.
- Comprehensive input validation and descriptive error messages.
- Responsive desktop and mobile layouts.
- Keyboard-accessible controls and screen-reader announcements.
- Automated algorithm and validation tests.
- No external runtime dependencies.

## Technology Stack

| Technology              | Purpose                                    |
| ----------------------- | ------------------------------------------ |
| JavaScript (ES Modules) | Application logic and algorithms           |
| HTML5                   | Semantic page structure                    |
| CSS3                    | Responsive layout and styling              |
| SVG                     | Dynamic graphical visualization            |
| Vite                    | Development server and production bundling |
| Node.js Test Runner     | Automated testing                          |
| Git                     | Version control                            |

## Problem Statement

Given an array of block heights, calculate the total amount of water that can be trapped after rainfall.

### Example

Input:

```javascript
[0, 4, 0, 0, 0, 6, 0, 6, 4, 0];
```

Output:

```text
18 units
```

Water trapped at each position:

```javascript
[0, 0, 4, 4, 4, 0, 6, 0, 0, 0];
```

### Calculation Breakdown

| Index     | Block Height | Trapped Water |
| --------- | -----------: | ------------: |
| 0         |            0 |             0 |
| 1         |            4 |             0 |
| 2         |            0 |             4 |
| 3         |            0 |             4 |
| 4         |            0 |             4 |
| 5         |            6 |             0 |
| 6         |            0 |             6 |
| 7         |            6 |             0 |
| 8         |            4 |             0 |
| 9         |            0 |             0 |
| **Total** |              |        **18** |

## Algorithm Design

The amount of water trapped at any position is calculated using:

```text
water[i] = min(leftMax[i], rightMax[i]) - height[i]
```

Three approaches are implemented.

### 1. Brute-Force Approach

For each position, scan the blocks to its left and right to determine the maximum boundary heights.

- Time complexity: O(n²)
- Auxiliary space complexity: O(1)

This approach provides a straightforward reference implementation.

### 2. Prefix-Suffix Approach

Precompute the maximum heights to the left and right of every position using two auxiliary arrays.

- Time complexity: O(n)
- Auxiliary space complexity: O(n)

This eliminates repeated boundary scans.

### 3. Two-Pointer

## Live Demo

- **Live Application:** [Open Water Tank Visualizer](https://water-tank-visualizer121.netlify.app/)
- **Source Code:** [GitHub Repository](https://github.com/Nithish259/water-tank)