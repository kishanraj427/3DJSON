import { useState, useRef, type ChangeEvent } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import {
  TextArea,
  Button,
  Box,
  Text,
  Flex,
  Card,
  Container,
  Heading,
  Grid,
} from '@radix-ui/themes';
import { parseJson } from '../utils/json-parser';
import { encodeJsonForUrl, validateJsonSize } from '../utils/route-utils';
import {
  Upload,
  Sparkles,
  FileJson,
  Zap,
  AlertCircle,
  CheckCircle,
  XCircle,
} from 'lucide-react';

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
  const [isValidating, setIsValidating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleJsonChange = (json: string) => {
    setJsonInput(json);
    setError(null);

    if (!json.trim()) return;

    setIsValidating(true);

    // Debounce validation
    setTimeout(() => {
      // Validate JSON parsing
      const { error: parseError } = parseJson(json);
      if (parseError) {
        setError(parseError);
        setIsValidating(false);
        return;
      }

      // Validate JSON size
      const { valid, error: sizeError } = validateJsonSize(json);
      if (!valid) {
        setError(sizeError || 'JSON too large');
        setIsValidating(false);
        return;
      }

      setError(null);
      setIsValidating(false);
    }, 300);
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

    // Reset file input
    event.target.value = '';
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

  const canVisualize = jsonInput.trim() && !error && !isValidating;

  return (
    <Box className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
      <Container size="3" className="py-12 px-4">
        <Flex direction="column" align="center" gap="8">
          {/* Header */}
          <Flex direction="column" align="center" gap="2">
            <Flex align="center" gap="3">
              <Sparkles className="w-10 h-10 text-blue-500 dark:text-blue-400" />
              <Heading
                size="8"
                className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text"
              >
                3D JSON Visualizer
              </Heading>
            </Flex>
            <Text size="4" color="gray" align="center" className="max-w-lg">
              Transform your JSON data into interactive 3D visualizations.
              Upload, paste, or try a sample.
            </Text>
          </Flex>

          <Grid columns={{ initial: '1', md: '3' }} gap="6" className="w-full">
            {/* Left Panel - Input */}
            <Card className="col-span-2 p-6 shadow-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
              <Flex direction="column" gap="4">
                <Flex justify="between" align="center">
                  <Flex align="center" gap="2">
                    <FileJson className="w-5 h-5 text-blue-500" />
                    <Text size="5" weight="bold">
                      JSON Input
                    </Text>
                  </Flex>

                  <Flex gap="2">
                    <Button
                      variant="soft"
                      onClick={() => fileInputRef.current?.click()}
                      className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Upload File
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleLoadSample}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      Load Sample
                    </Button>
                  </Flex>
                </Flex>

                <TextArea
                  value={jsonInput}
                  onChange={(e) => handleJsonChange(e.target.value)}
                  placeholder={`{\n  "your": "json",\n  "goes": "here"\n}`}
                  rows={18}
                  className="w-full font-mono text-sm p-4 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 transition-all resize-none"
                />

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json,application/json"
                  onChange={handleFileUpload}
                  className="hidden"
                />

                {/* Status & Error */}
                <Flex direction="column" gap="3">
                  {isValidating && (
                    <Flex
                      align="center"
                      gap="2"
                      className="text-blue-600 dark:text-blue-400"
                    >
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                      <Text size="2">Validating JSON...</Text>
                    </Flex>
                  )}

                  {error && (
                    <Card className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                      <Flex align="start" gap="2">
                        <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5" />
                        <Text size="2" color="red" className="flex-1">
                          <strong>Error:</strong> {error}
                        </Text>
                      </Flex>
                    </Card>
                  )}

                  {jsonInput && !error && !isValidating && (
                    <Flex
                      align="center"
                      gap="2"
                      className="text-green-600 dark:text-green-400"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <Text size="2">Valid JSON ready for visualization</Text>
                    </Flex>
                  )}
                </Flex>

                {/* Visualize Button */}
                <Button
                  size="4"
                  disabled={!canVisualize}
                  onClick={handleVisualize}
                  className={`w-full mt-4 cursor-pointer transition-all duration-200 ${
                    canVisualize
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                      : 'bg-gray-300 dark:bg-gray-700'
                  }`}
                >
                  <Zap className="w-5 h-5 mr-2" />
                  Visualize in 3D
                </Button>
              </Flex>
            </Card>

            {/* Right Panel - Legend & Info */}
            <Flex direction="column" gap="6">
              {/* Legend */}
              <Card className="p-6 shadow-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
                <Text size="5" weight="bold" mb="4">
                  Data Type Colors
                </Text>
                <Grid gap="3">
                  {[
                    {
                      color: 'bg-blue-500',
                      label: 'Object',
                      desc: 'Key-value pairs',
                    },
                    {
                      color: 'bg-emerald-500',
                      label: 'Array',
                      desc: 'Ordered lists',
                    },
                    {
                      color: 'bg-orange-500',
                      label: 'String',
                      desc: 'Text values',
                    },
                    {
                      color: 'bg-purple-500',
                      label: 'Number',
                      desc: 'Numeric values',
                    },
                    {
                      color: 'bg-yellow-500',
                      label: 'Boolean',
                      desc: 'True/False',
                    },
                    {
                      color: 'bg-gray-500',
                      label: 'Null',
                      desc: 'Empty values',
                    },
                  ].map((item, index) => (
                    <Flex
                      key={index}
                      align="center"
                      gap="3"
                      className="p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <div
                        className={`w-8 h-8 rounded-lg ${item.color} flex items-center justify-center`}
                      >
                        {index === 0 ? (
                          <div className="w-4 h-4 bg-blue-200 rounded-sm"></div>
                        ) : (
                          <div className="w-4 h-4 rounded-full bg-white/30"></div>
                        )}
                      </div>
                      <Flex direction="column">
                        <Text size="2" weight="bold">
                          {item.label}
                        </Text>
                        <Text size="1" color="gray">
                          {item.desc}
                        </Text>
                      </Flex>
                    </Flex>
                  ))}
                </Grid>
              </Card>

              {/* Tips */}
              <Card className="p-6 shadow-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
                <Text size="5" weight="bold" mb="4">
                  Quick Tips
                </Text>
                <Flex direction="column" gap="3">
                  <Flex align="start" gap="2">
                    <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                      <Text size="1" weight="bold" color="blue">
                        1
                      </Text>
                    </div>
                    <Text size="2">Paste JSON or upload a .json file</Text>
                  </Flex>
                  <Flex align="start" gap="2">
                    <div className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                      <Text size="1" weight="bold" color="purple">
                        2
                      </Text>
                    </div>
                    <Text size="2">
                      Validate your JSON structure automatically
                    </Text>
                  </Flex>
                  <Flex align="start" gap="2">
                    <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
                      <Text size="1" weight="bold" color="green">
                        3
                      </Text>
                    </div>
                    <Text size="2">Click Visualize to explore in 3D</Text>
                  </Flex>
                </Flex>
              </Card>
            </Flex>
          </Grid>

          {/* Footer Info */}
          <Text size="2" color="gray" align="center" className="mt-8 max-w-xl">
            Supports JSON files up to 2MB. Your data is processed locally and
            never sent to our servers. Ready for complex nested structures and
            large datasets.
          </Text>
        </Flex>
      </Container>
    </Box>
  );
}
