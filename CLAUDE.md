# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React + TypeScript application using Vite as the build tool, focused on 3D visualization with Three.js. The project integrates React Three Fiber for declarative 3D rendering and Radix UI for UI theming.

## Common Commands

### Development
```bash
bun dev           # Start development server with HMR
bun run dev       # Alternative to start dev server
```

### Building
```bash
bun run build     # Type-check with tsc then build with Vite
bun run preview   # Preview production build locally
```

### Code Quality
```bash
bun run lint      # Run ESLint on all TypeScript files
bun run test      # Run tests with Vitest
```

## Technology Stack

- **Framework**: React 19.2.0 with TypeScript 5.9
- **Routing**: TanStack Router (file-based routing)
- **Build Tool**: Vite 7.2.4 (with Fast Refresh via @vitejs/plugin-react)
- **3D Graphics**: Three.js 0.182.0 + React Three Fiber + Drei (3D helpers)
- **UI Framework**: Radix UI Themes 3.3.0
- **Styling**: Tailwind CSS 4.1.18 + PostCSS + Autoprefixer
- **Testing**: Vitest 4.0.18
- **Linting**: ESLint 9 with TypeScript ESLint, React Hooks, and React Refresh plugins

## Architecture

### Application Overview
This is a **3D JSON Data Visualizer** that renders JSON data structures as interactive 3D node graphs. The architecture follows a clear separation between data processing, UI controls, and 3D rendering.

### Data Flow
1. **Input** → User enters JSON via index route (text area or file upload) at `/`
2. **Validation** → JSON is validated and encoded into URL search params
3. **Navigation** → User navigates to `/visualize?data=<encoded-json>`
4. **Parse** → `json-parser.ts` converts JSON string to tree of JsonNode objects
5. **Layout** → `layout-algorithm.ts` calculates 3D positions using radial tree layout
6. **Render** → Scene component visualizes nodes and edges in 3D space

### Core Type System (`src/types/json-node.ts`)
Central data structures used throughout the application:
- **JsonNode**: Represents a single node in the JSON tree (id, key, type, value, children, position, depth, parentId)
- **NodeEdge**: Connection between two nodes (fromId, toId, positions)
- **VisualizationData**: Complete graph data (nodes array, edges array, rootNode)
- **Position3D**: 3D coordinates (x, y, z)
- **JsonValueType**: Union of 'object' | 'array' | 'string' | 'number' | 'boolean' | 'null'

### Data Processing Layer

**JSON Parser** (`src/utils/json-parser.ts`):
- Recursively converts JSON to hierarchical JsonNode tree
- Assigns unique IDs to each node (parent.child path-based)
- Determines node types and extracts primitive values
- Handles arrays with indexed keys like `[0]`, `[1]`

**Layout Algorithm** (`src/utils/layout-algorithm.ts`):
- Implements radial tree layout in 3D space
- Root node at origin (0, 0, 0)
- Children spread radially around parent based on descendant count
- Y-axis represents depth (children positioned below parents)
- Configurable spacing (horizontal, vertical, radius multiplier)
- Provides `flattenNodes()` and `extractEdges()` for rendering

### Component Architecture

**Routing Structure** (`src/routes/`):
The application uses TanStack Router for file-based routing:

**Index Route** (`src/routes/index.tsx`):
- Input screen at `/` where users enter or upload JSON
- State management for JSON input and validation errors
- `handleJsonChange()` validates JSON and checks size limits
- File upload support for `.json` files
- Sample JSON loader with demo data
- Color legend showing node type color mapping
- "Visualize" button navigates to visualization route with encoded JSON in URL params
- Uses Radix UI components (TextArea, Button, Callout, Box, Text, Flex)

**Visualize Route** (`src/routes/visualize.tsx`):
- Visualization screen at `/visualize?data=<encoded-json>`
- Decodes JSON from URL search params using `decodeJsonFromUrl()`
- Orchestrates data pipeline: parse → position → flatten → extract edges
- Renders Scene component with visualization data
- "Back to Input" button to return to index route
- Controls help overlay in top-right corner explaining 3D navigation
- Error handling with error display and back button

**Root Route** (`src/routes/__root.tsx`):
- Root layout wrapper for all routes
- Provides outlet for nested route content

**3D Scene Layer** (`src/components/scene/`):
- **Scene**: React Three Fiber Canvas setup with camera at [15, 15, 15], OrbitControls with full navigation (rotate, pan, zoom), lighting (ambient + directional + point), and ground grid
- **JsonVisualization**: Orchestrates rendering of all nodes and edges (renders edges first, then nodes)
- **Node Components**: Render different JSON types with distinct visual styles:
  - ObjectNode: Blue cube (1.5 × 1.5 × 1.5)
  - ArrayNode: Green sphere (radius 0.8) with array length in label
  - PrimitiveNode: Small colored sphere (radius 0.4) - orange=string, purple=number, yellow=boolean, gray=null
- **ConnectionLine**: Gray semi-transparent lines between parent and child nodes

All nodes use Drei helpers (Box, Sphere, Html) and implement hover states that brighten colors.

### Visual Design System
- **Objects**: Blue (#3b82f6) cubes
- **Arrays**: Green (#22c55e) spheres
- **Strings**: Orange (#f97316) spheres
- **Numbers**: Purple (#a855f7) spheres
- **Booleans**: Yellow (#eab308) spheres
- **Null**: Gray (#6b7280) spheres
- **Edges**: Gray (#94a3b8) semi-transparent lines

### TypeScript Import Convention
The project uses `verbatimModuleSyntax` which requires:
- Type-only imports: `import type { Type } from './module'`
- Mixed imports: `import { value, type Type } from './module'`

### Routing & URL Structure
The application uses TanStack Router for file-based routing with URL-based state management:
- **Route Files**: Located in `src/routes/` directory
- **Index Route** (`/`): JSON input screen
- **Visualize Route** (`/visualize?data=<encoded>`): 3D visualization with JSON encoded in URL
- **URL Encoding**: `route-utils.ts` provides `encodeJsonForUrl()` and `decodeJsonFromUrl()` for URL-safe JSON transmission
- **Size Validation**: `validateJsonSize()` ensures JSON fits within URL length limits

### Entry Point
`src/main.tsx` wraps the app with React.StrictMode and Radix UI Theme (light appearance, indigo accent), and initializes TanStack Router.

## Development Notes

### Adding New Node Types
To add a new visual representation for a JSON type:
1. Create new component in `src/components/scene/nodes/`
2. Import and add case in `JsonVisualization.tsx` switch statement
3. Update color legend in `src/routes/index.tsx` (InputScreen component)
4. Add color constant to the visual design system

### Modifying Layout Algorithm
The radial tree layout in `layout-algorithm.ts` uses these principles:
- Children are positioned radially around parent in XZ plane
- Angle allocation is proportional to descendant count (larger subtrees get more space)
- Y-axis decreases with depth (verticalSpacing config)
- Radius increases with depth (radiusMultiplier × depth × horizontalSpacing)
- Modify `DEFAULT_CONFIG` to adjust spacing

### 3D Scene Customization
When modifying the 3D scene:
- Camera position affects initial view (currently [15, 15, 15])
- **OrbitControls Navigation**:
  - `enablePan={true}` with `panSpeed={2.0}` for mouse-based panning (right-click drag)
  - `screenSpacePanning={true}` for intuitive screen-relative panning
  - `keyPanSpeed={10.0}` with arrow keys for keyboard navigation
  - `rotateSpeed={0.5}` for rotation sensitivity (left-click drag)
  - `zoomSpeed={0.8}` for zoom sensitivity (scroll wheel)
  - `enableDamping` with `dampingFactor={0.05}` for smooth camera motion
- Grid helper is positioned at y=-10 for ground reference
- Add/modify lights to change scene illumination
- **User Controls** (displayed in help overlay):
  - Left-click + drag: Rotate view
  - Right-click + drag: Pan up/down/left/right
  - Arrow keys: Pan view (keyboard navigation)
  - Scroll wheel: Zoom in/out

### Styling Configuration
- Tailwind CSS classes work throughout the app
- Radix UI theme is configured in `main.tsx` (appearance and accent color)
- `src/index.css` sets html/body/#root to 100% height for full-screen layout
- 3D labels use inline styles for pointer-events and background

### TypeScript Strictness
The project enforces:
- Strict type checking with `verbatimModuleSyntax` enabled
- No unused locals or parameters
- Type-only imports required for types
- No fallthrough cases in switches
