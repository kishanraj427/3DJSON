import type { JsonNode, JsonValueType } from '../types/json-node';

// Determine the type of a JSON value
function getValueType(value: unknown): JsonValueType {
  if (value === null) return 'null';
  if (Array.isArray(value)) return 'array';
  if (typeof value === 'object') return 'object';
  if (typeof value === 'string') return 'string';
  if (typeof value === 'number') return 'number';
  if (typeof value === 'boolean') return 'boolean';
  return 'null';
}

// Generate unique IDs for nodes
function generateId(parentId: string | null, key: string): string {
  return parentId ? `${parentId}.${key}` : key;
}

// Recursively convert JSON to node tree
export function parseJsonToNodes(
  value: unknown,
  key: string = 'root',
  parentId: string | null = null,
  depth: number = 0
): JsonNode {
  const id = generateId(parentId, key);
  const type = getValueType(value);
  const children: JsonNode[] = [];

  if (type === 'object' && value !== null) {
    const obj = value as Record<string, unknown>;
    Object.keys(obj).forEach((childKey) => {
      children.push(parseJsonToNodes(obj[childKey], childKey, id, depth + 1));
    });
  } else if (type === 'array') {
    const arr = value as unknown[];
    arr.forEach((item, index) => {
      children.push(parseJsonToNodes(item, `[${index}]`, id, depth + 1));
    });
  }

  return {
    id,
    key,
    type,
    value: type !== 'object' && type !== 'array' ? value : undefined,
    children,
    position: { x: 0, y: 0, z: 0 },
    depth,
    parentId,
  };
}

// Main parsing function with error handling
export function parseJson(jsonString: string): {
  node: JsonNode | null;
  error: string | null;
} {
  try {
    const parsed = JSON.parse(jsonString);
    const node = parseJsonToNodes(parsed);
    return { node, error: null };
  } catch (e) {
    return {
      node: null,
      error: e instanceof Error ? e.message : 'Invalid JSON',
    };
  }
}
