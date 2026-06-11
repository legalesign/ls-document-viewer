const SNAP_THRESHOLD = 8; // pixels proximity to trigger snap

export interface SnapResult {
  x: number | null; // snapped left position (null = no snap on x)
  y: number | null; // snapped top position (null = no snap on y)
  guides: { orientation: 'h' | 'v'; position: number }[];
}

/**
 * Calculate snap positions for a dragging field against existing fields.
 * Snaps edges and centers. Shows guides for ALL aligned edges at the snapped position.
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
  const dragCenterX = dragLeft + dragWidth / 2;
  const dragCenterY = dragTop + dragHeight / 2;

  let closestDx = SNAP_THRESHOLD + 1;
  let closestDy = SNAP_THRESHOLD + 1;
  let snappedX = dragLeft;
  let snappedY = dragTop;

  // First pass: find the closest snap distance per axis
  for (const field of fields) {
    if (field.dataItem?.page !== currentPage) continue;
    if (excludeIds && excludeIds.includes(field.dataItem?.id)) continue;

    const fLeft = field.offsetLeft;
    const fTop = field.offsetTop;
    const fRight = fLeft + field.offsetWidth;
    const fBottom = fTop + field.offsetHeight;
    const fCenterX = fLeft + field.offsetWidth / 2;
    const fCenterY = fTop + field.offsetHeight / 2;

    const xPairs = [
      { dragEdge: dragLeft, targetEdge: fLeft },
      { dragEdge: dragLeft, targetEdge: fRight },
      { dragEdge: dragRight, targetEdge: fLeft },
      { dragEdge: dragRight, targetEdge: fRight },
      { dragEdge: dragCenterX, targetEdge: fCenterX },
    ];

    for (const { dragEdge, targetEdge } of xPairs) {
      const dist = Math.abs(dragEdge - targetEdge);
      if (dist < closestDx) {
        closestDx = dist;
        snappedX = dragLeft + (targetEdge - dragEdge);
      }
    }

    const yPairs = [
      { dragEdge: dragTop, targetEdge: fTop },
      { dragEdge: dragTop, targetEdge: fBottom },
      { dragEdge: dragBottom, targetEdge: fTop },
      { dragEdge: dragBottom, targetEdge: fBottom },
      { dragEdge: dragCenterY, targetEdge: fCenterY },
    ];

    for (const { dragEdge, targetEdge } of yPairs) {
      const dist = Math.abs(dragEdge - targetEdge);
      if (dist < closestDy) {
        closestDy = dist;
        snappedY = dragTop + (targetEdge - dragEdge);
      }
    }
  }

  if (closestDx > SNAP_THRESHOLD) snappedX = dragLeft;
  if (closestDy > SNAP_THRESHOLD) snappedY = dragTop;

  // Second pass: collect ALL guides that align at the snapped position
  if (closestDx <= SNAP_THRESHOLD) {
    result.x = snappedX;
    const snappedRight = snappedX + dragWidth;
    const snappedCenterX = snappedX + dragWidth / 2;

    const guideSet = new Set<number>();
    for (const field of fields) {
      if (field.dataItem?.page !== currentPage) continue;
      if (excludeIds && excludeIds.includes(field.dataItem?.id)) continue;

      const fLeft = field.offsetLeft;
      const fRight = fLeft + field.offsetWidth;
      const fCenterX = fLeft + field.offsetWidth / 2;

      for (const target of [fLeft, fRight, fCenterX]) {
        if (Math.abs(snappedX - target) < 1 || Math.abs(snappedRight - target) < 1 || Math.abs(snappedCenterX - target) < 1) {
          guideSet.add(target);
        }
      }
    }
    guideSet.forEach(pos => result.guides.push({ orientation: 'v', position: pos }));
  }

  if (closestDy <= SNAP_THRESHOLD) {
    result.y = snappedY;
    const snappedBottom = snappedY + dragHeight;
    const snappedCenterY = snappedY + dragHeight / 2;

    const guideSet = new Set<number>();
    for (const field of fields) {
      if (field.dataItem?.page !== currentPage) continue;
      if (excludeIds && excludeIds.includes(field.dataItem?.id)) continue;

      const fTop = field.offsetTop;
      const fBottom = fTop + field.offsetHeight;
      const fCenterY = fTop + field.offsetHeight / 2;

      for (const target of [fTop, fBottom, fCenterY]) {
        if (Math.abs(snappedY - target) < 1 || Math.abs(snappedBottom - target) < 1 || Math.abs(snappedCenterY - target) < 1) {
          guideSet.add(target);
        }
      }
    }
    guideSet.forEach(pos => result.guides.push({ orientation: 'h', position: pos }));
  }

  return result;
}
