const SNAP_THRESHOLD = 8; // pixels proximity to trigger snap

export interface SnapResult {
  x: number | null; // snapped left position (null = no snap on x)
  y: number | null; // snapped top position (null = no snap on y)
  guides: { orientation: 'h' | 'v'; position: number }[];
}

/**
 * Calculate snap positions for a dragging field against existing fields.
 * Snaps any outer edge (left/right/top/bottom) of the moving field to any
 * outer edge of every other field on the same page.
 * All values are in zoomed pixel coordinates relative to the document frame.
 */
export function calculateSnap(
  dragLeft: number,
  dragTop: number,
  dragWidth: number,
  dragHeight: number,
  fields: { offsetLeft: number; offsetTop: number; offsetWidth: number; offsetHeight: number; dataItem?: any }[],
  currentPage: number,
  excludeIds?: string[],
): SnapResult {
  const result: SnapResult = { x: null, y: null, guides: [] };

  const dragRight = dragLeft + dragWidth;
  const dragBottom = dragTop + dragHeight;

  let closestDx = SNAP_THRESHOLD + 1;
  let closestDy = SNAP_THRESHOLD + 1;

  for (const field of fields) {
    if (field.dataItem?.page !== currentPage) continue;
    if (excludeIds && excludeIds.includes(field.dataItem?.id)) continue;

    const fLeft = field.offsetLeft;
    const fTop = field.offsetTop;
    const fRight = fLeft + field.offsetWidth;
    const fBottom = fTop + field.offsetHeight;

    // X-axis: any dragged edge to any target edge
    const xPairs = [
      { dragEdge: dragLeft, targetEdge: fLeft },
      { dragEdge: dragLeft, targetEdge: fRight },
      { dragEdge: dragRight, targetEdge: fLeft },
      { dragEdge: dragRight, targetEdge: fRight },
    ];

    for (const { dragEdge, targetEdge } of xPairs) {
      const dist = Math.abs(dragEdge - targetEdge);
      if (dist < closestDx) {
        closestDx = dist;
        result.x = dragLeft + (targetEdge - dragEdge);
        result.guides = result.guides.filter(g => g.orientation !== 'v');
        result.guides.push({ orientation: 'v', position: targetEdge });
      }
    }

    // Y-axis: any dragged edge to any target edge
    const yPairs = [
      { dragEdge: dragTop, targetEdge: fTop },
      { dragEdge: dragTop, targetEdge: fBottom },
      { dragEdge: dragBottom, targetEdge: fTop },
      { dragEdge: dragBottom, targetEdge: fBottom },
    ];

    for (const { dragEdge, targetEdge } of yPairs) {
      const dist = Math.abs(dragEdge - targetEdge);
      if (dist < closestDy) {
        closestDy = dist;
        result.y = dragTop + (targetEdge - dragEdge);
        result.guides = result.guides.filter(g => g.orientation !== 'h');
        result.guides.push({ orientation: 'h', position: targetEdge });
      }
    }
  }

  if (closestDx > SNAP_THRESHOLD) {
    result.x = null;
    result.guides = result.guides.filter(g => g.orientation !== 'v');
  }
  if (closestDy > SNAP_THRESHOLD) {
    result.y = null;
    result.guides = result.guides.filter(g => g.orientation !== 'h');
  }

  return result;
}
