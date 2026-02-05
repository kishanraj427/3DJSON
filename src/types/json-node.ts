// Type for different JSON value types
export type JsonValueType =
  | 'object'
  | 'array'
  | 'string'
  | 'number'
  | 'boolean'
  | 'null';

// 3D position coordinates
export interface Position3D {
  x: number;
  y: number;
  z: number;
}

// Core node structure for visualization
export interface JsonNode {
  id: string;
  key: string;
  type: JsonValueType;
  value: unknown;
  children: JsonNode[];
  position: Position3D;
  depth: number;
  parentId: string | null;
}

// Edge/connection between nodes
export interface NodeEdge {
  id: string;
  fromId: string;
  toId: string;
  fromPosition: Position3D;
  toPosition: Position3D;
}

// Complete visualization data structure
export interface VisualizationData {
  nodes: JsonNode[];
  edges: NodeEdge[];
  rootNode: JsonNode | null;
}
