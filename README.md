# 3D JSON Visualizer

An interactive 3D visualization tool that transforms JSON data structures into explorable node graphs. Built with React, Three.js, and TypeScript.

## Features

- **Interactive 3D Visualization**: Navigate JSON data structures in 3D space with intuitive controls
- **Type-Specific Visual Encoding**: Different node types (objects, arrays, primitives) are rendered with distinct shapes and colors
- **Multiple Input Methods**: Paste JSON directly, upload `.json` files, or load sample data
- **Real-time Validation**: Instant feedback on JSON syntax and size limits
- **Radial Tree Layout**: Hierarchical data arranged in a 3D radial tree structure
- **Full Navigation Controls**:
  - Rotate view (left-click + drag)
  - Pan camera (right-click + drag or arrow keys)
  - Zoom in/out (scroll wheel)
- **URL-Based State**: Share visualizations via URL with encoded JSON data

## Visual Design

- **Objects**: Blue cubes
- **Arrays**: Green spheres (with element count)
- **Strings**: Orange spheres
- **Numbers**: Purple spheres
- **Booleans**: Yellow spheres
- **Null**: Gray spheres
- **Connections**: Gray semi-transparent lines between parent and child nodes

## Installation

```bash
# Clone the repository
git clone <repository-url>
cd 3djson

# Install dependencies
bun install
# or
npm install
```

## Usage

### Development

Start the development server with hot module replacement:

```bash
bun dev
# or
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build

```bash
bun run build
# or
npm run build
```

Preview the production build:

```bash
bun run preview
# or
npm run preview
```

## How to Use

1. **Enter JSON Data**:
   - Type or paste JSON into the text area on the home page
   - Upload a `.json` file using the "Upload File" button
   - Click "Load Sample JSON" to see an example

2. **Visualize**:
   - Click the "Visualize" button to generate the 3D graph
   - The JSON data is validated before visualization

3. **Navigate the 3D View**:
   - **Left-click + drag**: Rotate the camera around the scene
   - **Right-click + drag**: Pan the camera up/down/left/right
   - **Arrow keys**: Pan the view with keyboard
   - **Scroll wheel**: Zoom in and out
   - **Back to Input**: Return to the input screen to visualize different JSON

4. **Share**:
   - Copy the URL from the visualization page to share with others
   - The JSON data is encoded in the URL parameters

## Technology Stack

- **Framework**: React 19.2.0 with TypeScript 5.9
- **Routing**: TanStack Router (file-based routing)
- **Build Tool**: Vite 7.2.4
- **3D Graphics**: Three.js 0.182.0 + React Three Fiber + Drei
- **UI Framework**: Radix UI Themes 3.3.0
- **Styling**: Tailwind CSS 4.1.18
- **Testing**: Vitest 4.0.18
- **Linting**: ESLint 9

## Project Structure

```
src/
├── routes/              # TanStack Router routes
│   ├── index.tsx       # Input screen (/)
│   ├── visualize.tsx   # 3D visualization screen (/visualize)
│   └── __root.tsx      # Root layout
├── components/
│   └── scene/          # 3D rendering components
│       ├── Scene.tsx              # Main 3D scene setup
│       ├── JsonVisualization.tsx  # Node/edge orchestration
│       ├── nodes/                 # Node type components
│       │   ├── ObjectNode.tsx
│       │   ├── ArrayNode.tsx
│       │   └── PrimitiveNode.tsx
│       └── edges/
│           └── ConnectionLine.tsx
├── utils/              # Utility functions
│   ├── json-parser.ts         # JSON to node tree converter
│   ├── layout-algorithm.ts    # 3D position calculator
│   └── route-utils.ts         # URL encoding/decoding
├── types/
│   └── json-node.ts    # TypeScript type definitions
└── main.tsx            # Application entry point
```

## Code Quality

Run linting:
```bash
bun run lint
# or
npm run lint
```

Run tests:
```bash
bun run test
# or
npm run test
```

## Development Guide

For detailed development guidance, architectural decisions, and contribution guidelines, see [CLAUDE.md](./CLAUDE.md).

## License

MIT
