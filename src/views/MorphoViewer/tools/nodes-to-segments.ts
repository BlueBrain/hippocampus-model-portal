import { TgdPainterSegmentsData } from "../tgd";
import { CellNodeType } from "../types";
import { CellNodes } from "./nodes";
import { Segments } from "./segments";

export function nodesToSegmentsData(nodes: CellNodes): TgdPainterSegmentsData {
  const segments = new Segments(nodes);
  nodes.forEach(
    ({ index: childIndex, parent: parentIndex, type: childType }) => {
      if (parentIndex < 0) return;

      const parent = nodes.getByIndex(parentIndex);
      if (!parent) return;

      const parentType = parent.type;
      if (parentType === CellNodeType.Soma && childType !== CellNodeType.Soma)
        return;

      segments.addSegment(childIndex, parentIndex);
    }
  );
  return segments.data;
}
