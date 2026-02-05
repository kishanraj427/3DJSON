import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Grid } from '@react-three/drei';
import type { VisualizationData } from '../../types/json-node';
import JsonVisualization from './JsonVisualization';

interface SceneProps {
  visualizationData: VisualizationData;
}

export default function Scene({ visualizationData }: SceneProps) {
  return (
    <div className="w-full h-full">
      <Canvas>
        {/* Camera */}
        <PerspectiveCamera makeDefault position={[15, 15, 15]} />

        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, -10, -5]} intensity={0.5} />

        {/* Controls */}
        <OrbitControls
          enableDamping
          dampingFactor={0.05}
          rotateSpeed={0.5}
          zoomSpeed={0.8}
          enablePan={true}
          panSpeed={2.0}
          screenSpacePanning={true}
          keyPanSpeed={10.0}
          keys={{ LEFT: 'ArrowLeft', UP: 'ArrowUp', RIGHT: 'ArrowRight', BOTTOM: 'ArrowDown' }}
          listenToKeyEvents={typeof window !== 'undefined' ? window : undefined}
        />

        {/* Grid for orientation */}
        <Grid
          args={[30, 30]}
          cellSize={1}
          cellThickness={0.5}
          cellColor="#6b7280"
          sectionSize={5}
          sectionThickness={1}
          sectionColor="#9ca3af"
          fadeDistance={50}
          fadeStrength={1}
          position={[0, -10, 0]}
        />

        {/* Visualization */}
        <JsonVisualization visualizationData={visualizationData} />
      </Canvas>
    </div>
  );
}
