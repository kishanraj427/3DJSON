import { Line } from '@react-three/drei';
import type { NodeEdge } from '../../../types/json-node';

interface ConnectionLineProps {
  edge: NodeEdge;
}

export default function ConnectionLine({ edge }: ConnectionLineProps) {
  const points = [
    [edge.fromPosition.x, edge.fromPosition.y, edge.fromPosition.z],
    [edge.toPosition.x, edge.toPosition.y, edge.toPosition.z],
  ];

  return (
    <Line
      points={points as [number, number, number][]}
      color="#94a3b8"
      lineWidth={1.5}
      transparent
      opacity={0.6}
    />
  );
}
