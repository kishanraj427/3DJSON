import { useState } from 'react';
import { Box as ThreeBox, Html } from '@react-three/drei';
import { Box, Text } from '@radix-ui/themes';
import type { JsonNode } from '../../../types/json-node';

interface ObjectNodeProps {
  node: JsonNode;
}

export default function ObjectNode({ node }: ObjectNodeProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <group position={[node.position.x, node.position.y, node.position.z]}>
      <ThreeBox
        args={[1.5, 1.5, 1.5]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <meshStandardMaterial
          color={hovered ? '#60a5fa' : '#3b82f6'}
          transparent
          opacity={0.9}
        />
      </ThreeBox>
      <Html distanceFactor={10} position={[0, 1.2, 0]} center>
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
          <Text size="1">{node.key}</Text>
        </Box>
      </Html>
    </group>
  );
}
