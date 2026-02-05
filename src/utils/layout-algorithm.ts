import type { JsonNode, NodeEdge, Position3D } from '../types/json-node';

// Configuration for layout spacing
interface LayoutConfig {
  horizontalSpacing: number;
  verticalSpacing: number;
  radiusMultiplier: number;
}

const DEFAULT_CONFIG: LayoutConfig = {
  horizontalSpacing: 3,
  verticalSpacing: 4,
  radiusMultiplier: 1.5,
};

// Count total descendants for a node
function countDescendants(node: JsonNode): number {
  if (node.children.length === 0) return 1;
  return node.children.reduce((sum, child) => sum + countDescendants(child), 0);
}

// Deep clone a node tree
function cloneNode(node: JsonNode): JsonNode {
  return {
    ...node,
    position: { ...node.position },
    children: node.children.map(cloneNode),
  };
}

// Assign positions to nodes using radial layout
export function calculatePositions(
  rootNode: JsonNode,
  config: LayoutConfig = DEFAULT_CONFIG
): JsonNode {
  const positionedRoot = cloneNode(rootNode);

  positionedRoot.position = { x: 0, y: 0, z: 0 };

  function positionChildren(
    node: JsonNode,
    parentPos: Position3D,
    angleStart: number,
    angleEnd: number
  ): void {
    if (node.children.length === 0) return;

    const totalDescendants = node.children.reduce(
      (sum, child) => sum + countDescendants(child),
      0
    );

    let currentAngle = angleStart;
    const radius =
      config.radiusMultiplier * (node.depth + 1) * config.horizontalSpacing;

    node.children.forEach((child) => {
      const childDescendants = countDescendants(child);
      const angleShare =
        (angleEnd - angleStart) * (childDescendants / totalDescendants);
      const childAngle = currentAngle + angleShare / 2;

      child.position = {
        x: Math.cos(childAngle) * radius,
        y: parentPos.y - config.verticalSpacing,
        z: Math.sin(childAngle) * radius,
      };

      positionChildren(
        child,
        child.position,
        currentAngle,
        currentAngle + angleShare
      );

      currentAngle += angleShare;
    });
  }

  positionChildren(positionedRoot, positionedRoot.position, 0, Math.PI * 2);

  return positionedRoot;
}

// Extract all edges from the node tree
export function extractEdges(node: JsonNode): NodeEdge[] {
  const edges: NodeEdge[] = [];

  function traverse(current: JsonNode): void {
    current.children.forEach((child) => {
      edges.push({
        id: `${current.id}->${child.id}`,
        fromId: current.id,
        toId: child.id,
        fromPosition: current.position,
        toPosition: child.position,
      });
      traverse(child);
    });
  }

  traverse(node);
  return edges;
}

// Flatten node tree to array for rendering
export function flattenNodes(node: JsonNode): JsonNode[] {
  const nodes: JsonNode[] = [node];

  function traverse(current: JsonNode): void {
    current.children.forEach((child) => {
      nodes.push(child);
      traverse(child);
    });
  }

  traverse(node);
  return nodes;
}
