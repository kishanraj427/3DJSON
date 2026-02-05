import { useState } from 'react';
import { Sphere, Html } from '@react-three/drei';
import { Box, Text } from '@radix-ui/themes';
import type { JsonNode } from '../../../types/json-node';

interface PrimitiveNodeProps {
  node: JsonNode;
}

const TYPE_COLORS: Record<string, string> = {
  string: '#f97316',
  number: '#a855f7',
  boolean: '#eab308',
  null: '#6b7280',
};

const TYPE_COLORS_HOVER: Record<string, string> = {
  string: '#fb923c',
  number: '#c084fc',
  boolean: '#fbbf24',
  null: '#9ca3af',
};

export default function PrimitiveNode({ node }: PrimitiveNodeProps) {
  const [hovered, setHovered] = useState(false);
  const color = TYPE_COLORS[node.type] || '#6b7280';
  const hoverColor = TYPE_COLORS_HOVER[node.type] || '#9ca3af';

  // Truncate long values
  const displayValue =
    node.value !== null && node.value !== undefined
      ? String(node.value).length > 20
        ? String(node.value).substring(0, 20) + '...'
        : String(node.value)
      : 'null';

  return (
    <group position={[node.position.x, node.position.y, node.position.z]}>
      <Sphere
        args={[0.4, 16, 16]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <meshStandardMaterial
          color={hovered ? hoverColor : color}
          transparent
          opacity={0.9}
        />
      </Sphere>
      <Html distanceFactor={10} position={[0, 0.8, 0]} center>
        <Box
          px="2"
          py="1"
          style={{
            background: 'white',
            border: '1px solid var(--gray-7)',
            borderRadius: 'var(--radius-2)',
            boxShadow: 'var(--shadow-1)',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
          }}
        >
          <Text size="1">
            {node.key}: {displayValue}
          </Text>
        </Box>
      </Html>
    </group>
  );
}
