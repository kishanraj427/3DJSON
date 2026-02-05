import { useState } from 'react';
import { Sphere, Html } from '@react-three/drei';
import { Box, Text } from '@radix-ui/themes';
import type { JsonNode } from '../../../types/json-node';

interface ArrayNodeProps {
  node: JsonNode;
}

export default function ArrayNode({ node }: ArrayNodeProps) {
  const [hovered, setHovered] = useState(false);
  const arrayLength = node.children.length;

  return (
    <group position={[node.position.x, node.position.y, node.position.z]}>
      <Sphere
        args={[0.8, 32, 32]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <meshStandardMaterial
          color={hovered ? '#4ade80' : '#22c55e'}
          transparent
          opacity={0.9}
        />
      </Sphere>
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
          <Text size="1">
            {node.key} [{arrayLength}]
          </Text>
        </Box>
      </Html>
    </group>
  );
}
