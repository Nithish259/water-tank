const SVG_NS = 'http://www.w3.org/2000/svg';

const CHART_HEIGHT = 300;
const MIN_CHART_WIDTH = 480;
const COLUMN_WIDTH = 32;

const PADDING = {
  top: 24,
  right: 24,
  bottom: 48,
  left: 48,
};

/**
 * Creates an SVG element with the given attributes.
 */
function createSvgElement(tag, attributes = {}) {
  const element = document.createElementNS(SVG_NS, tag);

  for (const [key, value] of Object.entries(attributes)) {
    element.setAttribute(key, String(value));
  }

  return element;
}

/**
 * Creates an SVG text element.
 */
function createText(text, attributes = {}) {
  const element = createSvgElement('text', attributes);

  element.textContent = String(text);

  return element;
}

/**
 * Creates an SVG rectangle.
 */
function createRectangle(x, y, width, height, className) {
  return createSvgElement('rect', {
    x,
    y,
    width,
    height,
    class: className,
    rx: 1,
  });
}

/**
 * Generates integer tick values for the vertical axis.
 */
function createTicks(maxHeight) {
  const step = Math.max(1, Math.ceil(maxHeight / 6));

  const ticks = [];

  for (let value = 0; value <= maxHeight; value += step) {
    ticks.push(value);
  }

  if (ticks[ticks.length - 1] !== maxHeight) {
    ticks.push(maxHeight);
  }

  return ticks;
}

/**
 * Renders the blocks and trapped water as SVG.
 *
 * @param {HTMLElement} container
 * @param {number[]} heights
 * @param {number[]} waterAtEachIndex
 * @param {"combined" | "water"} mode
 */
export function renderWaterTank(
  container,
  heights,
  waterAtEachIndex,
  mode = 'combined',
) {
  const maxHeight = Math.max(1, ...heights);

  const chartWidth = Math.max(
    MIN_CHART_WIDTH,
    heights.length * COLUMN_WIDTH + PADDING.left + PADDING.right,
  );

  const plotWidth = chartWidth - PADDING.left - PADDING.right;

  const plotHeight = CHART_HEIGHT - PADDING.top - PADDING.bottom;

  const baseline = PADDING.top + plotHeight;

  const scale = plotHeight / maxHeight;

  const cellWidth = plotWidth / Math.max(1, heights.length);

  const barWidth = Math.max(1, cellWidth - 2);

  const svg = createSvgElement('svg', {
    viewBox: `0 0 ${chartWidth} ${CHART_HEIGHT}`,
    width: chartWidth,
    height: CHART_HEIGHT,
    role: 'img',
    'aria-label':
      mode === 'combined'
        ? 'Blocks with trapped rainwater'
        : 'Trapped rainwater distribution',
  });

  // Keep large charts readable using horizontal scrolling.
  svg.style.minWidth = `${chartWidth}px`;

  // Add an accessible SVG description.
  const title = createSvgElement('title');

  title.textContent =
    mode === 'combined' ? 'Water tank visualization' : 'Trapped water only';

  svg.appendChild(title);

  // Draw horizontal grid lines and Y-axis labels.
  const ticks = createTicks(maxHeight);

  for (const tick of ticks) {
    const y = baseline - tick * scale;

    const line = createSvgElement('line', {
      x1: PADDING.left,
      y1: y,
      x2: chartWidth - PADDING.right,
      y2: y,
      class: 'chart-grid-line',
    });

    const label = createText(tick, {
      x: PADDING.left - 10,
      y: y + 4,
      'text-anchor': 'end',
      class: 'chart-label',
    });

    svg.append(line, label);
  }

  // Draw each column.
  heights.forEach((height, index) => {
    const water = waterAtEachIndex[index];

    const x = PADDING.left + index * cellWidth + 1;

    const blockPixelHeight = height * scale;
    const waterPixelHeight = water * scale;

    const group = createSvgElement('g', {
      class: 'chart-column',
    });

    // Native SVG tooltip.
    const tooltip = createSvgElement('title');

    tooltip.textContent =
      `Index: ${index}\n` +
      `Block height: ${height}\n` +
      `Trapped water: ${water}`;

    group.appendChild(tooltip);

    // Draw the original block in combined mode.
    if (mode === 'combined' && height > 0) {
      const block = createRectangle(
        x,
        baseline - blockPixelHeight,
        barWidth,
        blockPixelHeight,
        'block-rect',
      );

      group.appendChild(block);
    }

    // Draw trapped water above the original block.
    if (water > 0) {
      const waterRectangle = createRectangle(
        x,
        baseline - blockPixelHeight - waterPixelHeight,
        barWidth,
        waterPixelHeight,
        'water-rect',
      );

      group.appendChild(waterRectangle);
    }

    // Display height or water depth below each column.
    const valueLabel = createText(mode === 'combined' ? height : water, {
      x: x + barWidth / 2,
      y: baseline + 16,
      'text-anchor': 'middle',
      class: 'chart-label',
    });

    const indexLabel = createText(index, {
      x: x + barWidth / 2,
      y: baseline + 33,
      'text-anchor': 'middle',
      class: 'chart-label',
      opacity: 0.65,
    });

    group.append(valueLabel, indexLabel);

    svg.appendChild(group);
  });

  // Draw the horizontal baseline.
  const axis = createSvgElement('line', {
    x1: PADDING.left,
    y1: baseline,
    x2: chartWidth - PADDING.right,
    y2: baseline,
    class: 'chart-axis',
  });

  svg.appendChild(axis);

  // Provide an explanation when no water is trapped.
  if (mode === 'water' && waterAtEachIndex.every((water) => water === 0)) {
    const emptyMessage = createText('No trapped water', {
      x: PADDING.left + plotWidth / 2,
      y: PADDING.top + plotHeight / 2,
      'text-anchor': 'middle',
      class: 'chart-label',
    });

    svg.appendChild(emptyMessage);
  }

  // Replace the previous visualization.
  container.replaceChildren(svg);
}
