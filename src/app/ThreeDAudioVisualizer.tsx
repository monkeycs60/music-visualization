import { Canvas } from '@react-three/fiber';
import { scaleLinear, scalePow } from 'd3-scale';
import { useMemo } from 'react';
import * as THREE from 'three';

type ThreeDAudioVisualizerProps = {
  rawData: number[];
};

const ThreeDAudioVisualizer = ({ rawData }: ThreeDAudioVisualizerProps) => {
   const maxFrequency = 255;

   const colorScale = scaleLinear<string>()
      .domain([0, maxFrequency])
      .range(['rgb(18,236,246)', 'rgb(246,156,242)']);

   const heightScale = scalePow<number, number>()
      .domain([0, maxFrequency])
      .range([0, 100])
      .exponent(1.3);

   const bars = useMemo(() => {
      return rawData.map((frequency, index) => {
         const height = heightScale(frequency);
         const color = colorScale(frequency);

         return {
            key: index,
            position: [index * 2.5 - rawData.length / 2, 0, 0],
            height,
            color,
         };
      });
   }, [rawData, heightScale, colorScale]);

   return (
      <Canvas camera={{ position: [0, 0, 150], fov: 75 }}>
         {bars.map((bar) => (
            <mesh key={bar.key} position={new THREE.Vector3(...bar.position)} scale={[1, bar.height, 1]}>
               <boxGeometry args={[1, 1, 1]} />
               <meshStandardMaterial color={bar.color} />
            </mesh>
         ))}
         <ambientLight intensity={0.4} />
         <pointLight position={[50, 20, 20]} />
      </Canvas>
   );
};

export default ThreeDAudioVisualizer;