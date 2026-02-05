import { useMemo } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { z } from 'zod';
import { Box, Button, Callout } from '@radix-ui/themes';
import type { VisualizationData } from '../types/json-node';
import { parseJson } from '../utils/json-parser';
import {
  calculatePositions,
  extractEdges,
  flattenNodes,
} from '../utils/layout-algorithm';
import { decodeJsonFromUrl } from '../utils/route-utils';
import Scene from '../components/scene/Scene';

const visualizeSearchSchema = z.object({
  data: z.string(),
});

export const Route = createFileRoute('/visualize')({
  validateSearch: visualizeSearchSchema,
  component: VisualizeScreen,
});

function VisualizeScreen() {
  const { data } = Route.useSearch();
  const navigate = useNavigate();

  const visualizationData = useMemo((): {
    data: VisualizationData;
    error: string | null;
  } => {
    // Decode JSON from URL
    const jsonString = decodeJsonFromUrl(data);
    if (!jsonString) {
      return {
        data: { nodes: [], edges: [], rootNode: null },
        error: 'Failed to decode JSON from URL',
      };
    }

    // Parse JSON
    const { node, error: parseError } = parseJson(jsonString);
    if (parseError || !node) {
      return {
        data: { nodes: [], edges: [], rootNode: null },
        error: parseError || 'Failed to parse JSON',
      };
    }

    // Calculate positions and extract visualization data
    const positionedNode = calculatePositions(node);
    const nodes = flattenNodes(positionedNode);
    const edges = extractEdges(positionedNode);

    return {
      data: {
        nodes,
        edges,
        rootNode: positionedNode,
      },
      error: null,
    };
  }, [data]);

  const handleBack = () => {
    navigate({ to: '/' });
  };

  if (visualizationData.error) {
    return (
      <Box className="flex items-center justify-center min-h-screen bg-gray-50">
        <Box className="w-full max-w-md p-8">
          <Callout.Root color="red" mb="4">
            <Callout.Text>
              <strong>Error:</strong> {visualizationData.error}
            </Callout.Text>
          </Callout.Root>
          <Button onClick={handleBack} size="3">
            Back to Input
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box className="relative h-screen">
      <Scene visualizationData={visualizationData.data} />
      <Box
        style={{
          position: 'absolute',
          top: '16px',
          left: '16px',
          padding: '12px',
          borderRadius: '8px',
          zIndex: 1000,
        }}
      >
        <Button variant="soft" onClick={handleBack}>
          ← Back to Input
        </Button>
      </Box>
      <Box
        style={{
          position: 'absolute',
          top: '16px',
          right: '16px',
          padding: '12px',
          background: 'rgba(255, 255, 255, 0.9)',
          borderRadius: '8px',
          fontSize: '12px',
          zIndex: 1000,
          backdropFilter: 'blur(8px)',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
        }}
      >
        <Box style={{ fontWeight: 'bold', marginBottom: '8px' }}>3D Controls:</Box>
        <Box>• <strong>Left-click + drag:</strong> Rotate view</Box>
        <Box>• <strong>Right-click + drag:</strong> Pan up/down/left/right</Box>
        <Box>• <strong>Arrow keys:</strong> Pan view</Box>
        <Box>• <strong>Scroll wheel:</strong> Zoom in/out</Box>
      </Box>
    </Box>
  );
}
