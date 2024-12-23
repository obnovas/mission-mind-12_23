interface Position {
  left: number;
  top: number;
  placement: 'left' | 'right';
}

const OFFSET = 12; // Distance from cursor

export function getTooltipPosition(
  mousePosition: { x: number; y: number },
  tooltipRect: DOMRect,
  windowWidth: number,
  windowHeight: number
): Position {
  const { x, y } = mousePosition;
  const { width, height } = tooltipRect;

  // Check if tooltip would overflow right edge
  const wouldOverflowRight = x + OFFSET + width > windowWidth - 20;
  
  // Calculate left position
  let left = wouldOverflowRight
    ? x - width - OFFSET // Place on left side of cursor
    : x + OFFSET; // Place on right side of cursor

  // Ensure tooltip doesn't go off left edge
  left = Math.max(20, left);

  // Calculate top position
  let top = y - (height / 2);
  
  // Ensure tooltip doesn't go off top or bottom
  top = Math.max(20, Math.min(windowHeight - height - 20, top));

  return {
    left,
    top,
    placement: wouldOverflowRight ? 'left' : 'right'
  };
}