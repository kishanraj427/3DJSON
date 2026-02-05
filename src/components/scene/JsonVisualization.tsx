import type { VisualizationData } from '../../types/json-node';
import ObjectNode from './nodes/ObjectNode';
import ArrayNode from './nodes/ArrayNode';
import PrimitiveNode from './nodes/PrimitiveNode';
import ConnectionLine from './edges/ConnectionLine';

interface JsonVisualizationProps {
  visualizationData: VisualizationData;
}

export default function JsonVisualization({
  visualizationData,
}: JsonVisualizationProps) {
  const { nodes, edges } = visualizationData;

  return (
    <group>
      {/* Render all edges first (so they appear behind nodes) */}
      {edges.map((edge) => (
        <ConnectionLine key={edge.id} edge={edge} />
      ))}

      {/* Render all nodes */}
      {nodes.map((node) => {
        switch (node.type) {
          case 'object':
            return <ObjectNode key={node.id} node={node} />;
          case 'array':
            return <ArrayNode key={node.id} node={node} />;
          default:
            return <PrimitiveNode key={node.id} node={node} />;
        }
      })}
    </group>
  );
}
