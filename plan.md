3D JSON Data Visualizer - Implementation Plan
Overview
Build a 3D visualization tool that renders JSON data structures as an interactive node graph:

Objects → Blue cubes
Arrays → Green spheres
Primitives (strings, numbers, booleans, null) → Small colored spheres
Parent-child relationships shown as connecting lines
Features
Text area input with live parsing
File upload for .json files
Sample JSON button for quick testing
Orbit controls (rotate, zoom, pan)
Hover effects on nodes
Labels showing keys and values
Error display for invalid JSON
File Structure

src/
├── App.tsx                           # Main layout + state management
├── types/
│   └── json-node.ts                  # TypeScript interfaces
├── utils/
│   ├── json-parser.ts                # JSON → node tree converter
│   └── layout-algorithm.ts           # 3D positioning (radial tree)
├── components/
│   ├── ui/
│   │   └── InputPanel.tsx            # Text area + file upload + legend
│   └── scene/
│       ├── Scene.tsx                 # Canvas + lighting + controls
│       ├── JsonVisualization.tsx     # Renders all nodes and edges
│       ├── nodes/
│       │   ├── ObjectNode.tsx        # Blue cube for objects
│       │   ├── ArrayNode.tsx         # Green sphere for arrays
│       │   └── PrimitiveNode.tsx     # Colored sphere for primitives
│       └── edges/
│           └── ConnectionLine.tsx    # Lines connecting nodes
Implementation Steps
Step 1: Type Definitions
Create src/types/json-node.ts:

JsonValueType - union type for JSON value types
Position3D - {x, y, z} coordinates
JsonNode - node with id, key, type, value, children, position, depth
NodeEdge - connection between two nodes
VisualizationData - container for nodes and edges
Step 2: JSON Parser
Create src/utils/json-parser.ts:

getValueType() - determine type of JSON value
parseJsonToNodes() - recursively convert JSON to node tree
parseJson() - entry point with error handling
Step 3: Layout Algorithm
Create src/utils/layout-algorithm.ts:

calculatePositions() - radial tree layout in 3D
Root at origin
Children spread radially based on descendant count
Y-axis represents depth (children below parent)
extractEdges() - get all parent-child connections
flattenNodes() - convert tree to flat array for rendering
Step 4: Input Panel
Create src/components/ui/InputPanel.tsx:

TextArea for JSON input (controlled, calls onJsonChange)
File input accepting .json files
"Load Sample JSON" button
Error callout for parse errors
Legend showing node type colors
Step 5: 3D Scene
Create src/components/scene/Scene.tsx:

React Three Fiber Canvas
PerspectiveCamera at [15, 15, 15]
OrbitControls with damping
Ambient + directional + point lights
Grid helper for orientation
Step 6: Node Components
Create node components in src/components/scene/nodes/:

ObjectNode.tsx:

Drei <Box> with blue material (#3b82f6)
Size: 1.5 × 1.5 × 1.5
Hover state changes color
Html label above showing key name
ArrayNode.tsx:

Drei <Sphere> with green material (#22c55e)
Size: radius 0.8
Label shows key and array length
PrimitiveNode.tsx:

Small sphere (radius 0.4)
Color by type: orange=string, purple=number, yellow=boolean, gray=null
Label shows key and truncated value
Step 7: Connection Lines
Create src/components/scene/edges/ConnectionLine.tsx:

Drei <Line> component
Gray color (#94a3b8), semi-transparent
Connects parent position to child position
Step 8: App Component
Update src/App.tsx:

State: visualizationData, parseError
handleJsonChange callback: parse → calculate positions → update state
Flex layout: InputPanel (w-96) | Scene (flex-1)
Step 9: CSS Updates
Update src/index.css:

Ensure html, body, #root are 100% height
Remove conflicting styles
Color Reference
Type	Color	Hex
Object	Blue	#3b82f6
Array	Green	#22c55e
String	Orange	#f97316
Number	Purple	#a855f7
Boolean	Yellow	#eab308
Null	Gray	#6b7280
Verification
Run bun dev to start dev server
Paste sample JSON: {"name": "Test", "items": [1, 2, 3], "active": true}
Verify: blue cube (root object), green sphere (items array), colored nodes for primitives
Test orbit controls: drag to rotate, scroll to zoom, right-drag to pan
Upload a .json file and verify it loads
Enter invalid JSON and verify error message appears
Run bun run lint to check for lint errors
Run bun run build to verify production build works
User approved the plan
