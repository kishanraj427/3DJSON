import { useState, useRef, type ChangeEvent } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Callout, TextArea, Button, Box, Text, Flex } from '@radix-ui/themes';
import { parseJson } from '../utils/json-parser';
import { encodeJsonForUrl, validateJsonSize } from '../utils/route-utils';

export const Route = createFileRoute('/')({
  component: InputScreen,
});

const SAMPLE_JSON = JSON.stringify(
  {
    name: 'Test Application',
    version: 1.0,
    features: ['authentication', 'api', 'database'],
    config: {
      port: 3000,
      host: 'localhost',
      debug: true,
    },
    metadata: {
      author: 'Developer',
      license: 'MIT',
      tags: ['web', 'api', 'json'],
    },
  },
  null,
  2
);

function InputScreen() {
  const [jsonInput, setJsonInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleJsonChange = (json: string) => {
    setJsonInput(json);

    if (!json.trim()) {
      setError(null);
      return;
    }

    // Validate JSON parsing
    const { error: parseError } = parseJson(json);
    if (parseError) {
      setError(parseError);
      return;
    }

    // Validate JSON size
    const { valid, error: sizeError } = validateJsonSize(json);
    if (!valid) {
      setError(sizeError || 'JSON too large');
      return;
    }

    setError(null);
  };

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      handleJsonChange(content);
    };
    reader.readAsText(file);
  };

  const handleLoadSample = () => {
    handleJsonChange(SAMPLE_JSON);
  };

  const handleVisualize = () => {
    if (!jsonInput.trim() || error) return;

    const encoded = encodeJsonForUrl(jsonInput);
    navigate({
      to: '/visualize',
      search: { data: encoded },
    });
  };

  const canVisualize = jsonInput.trim() && !error;

  return (
    <Box className="flex items-center justify-center min-h-screen bg-gray-50">
      <Box className="w-full max-w-2xl p-8">
        <Box className="bg-white rounded-lg shadow-lg p-6">
          <Text size="6" weight="bold" mb="4" className="block">
            3D JSON Visualizer
          </Text>

          <Box mb="4">
            <Text size="3" weight="medium" mb="2" className="block">
              JSON Input
            </Text>
            <TextArea
              value={jsonInput}
              onChange={(e) => handleJsonChange(e.target.value)}
              placeholder="Enter JSON here or upload a file..."
              rows={15}
              className="w-full font-mono text-sm"
            />
          </Box>

          <Flex gap="2" mb="4">
            <Button
              variant="soft"
              onClick={() => fileInputRef.current?.click()}
            >
              Upload File
            </Button>
            <Button variant="outline" onClick={handleLoadSample}>
              Load Sample JSON
            </Button>
            <Box className="flex-1" />
            <Button
              size="3"
              disabled={!canVisualize}
              onClick={handleVisualize}
            >
              Visualize
            </Button>
          </Flex>

          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileUpload}
            className="hidden"
          />

          {error && (
            <Callout.Root color="red" mb="4">
              <Callout.Text>
                <strong>Error:</strong> {error}
              </Callout.Text>
            </Callout.Root>
          )}

          <Box className="border-t pt-4">
            <Text size="3" weight="bold" mb="3" className="block">
              Color Legend
            </Text>
            <Flex direction="column" gap="2">
              <Flex align="center" gap="2">
                <Box className="w-4 h-4 rounded bg-[#3b82f6]" />
                <Text size="2">Object</Text>
              </Flex>
              <Flex align="center" gap="2">
                <Box className="w-4 h-4 rounded-full bg-[#22c55e]" />
                <Text size="2">Array</Text>
              </Flex>
              <Flex align="center" gap="2">
                <Box className="w-4 h-4 rounded-full bg-[#f97316]" />
                <Text size="2">String</Text>
              </Flex>
              <Flex align="center" gap="2">
                <Box className="w-4 h-4 rounded-full bg-[#a855f7]" />
                <Text size="2">Number</Text>
              </Flex>
              <Flex align="center" gap="2">
                <Box className="w-4 h-4 rounded-full bg-[#eab308]" />
                <Text size="2">Boolean</Text>
              </Flex>
              <Flex align="center" gap="2">
                <Box className="w-4 h-4 rounded-full bg-[#6b7280]" />
                <Text size="2">Null</Text>
              </Flex>
            </Flex>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
