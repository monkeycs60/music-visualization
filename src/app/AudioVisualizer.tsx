import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { BufferGeometry, Material } from 'three';

type AudioVisualizerProps = {
  audioBuffer: AudioBuffer;
};

const AudioVisualizer = ({ audioBuffer }: AudioVisualizerProps) => {
  const ref = useRef<THREE.Mesh<BufferGeometry, Material | Material[]>>(null);
  const audioContext = useMemo(() => new (window.AudioContext)(), []);
  const analyser = useMemo(() => audioContext.createAnalyser(), [audioContext]);
  const dataArrayRef = useRef(new Uint8Array(analyser.frequencyBinCount));

  useEffect(() => {
    if (audioBuffer) {
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(analyser);
      analyser.connect(audioContext.destination);
      source.start();

      return () => {
        source.stop();
        audioContext.close();
      };
    }
  }, [audioBuffer, analyser, audioContext]);

  useFrame(() => {
    if (analyser) {
      const newDataArray = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(newDataArray);
      dataArrayRef.current = newDataArray;
      // Utilisez dataArrayRef.current pour accéder aux données de l'analyseur
    }
  });

  return (
    <mesh ref={ref}>
      {/* Ajoutez la visualisation en utilisant les données de dataArrayRef.current */}
    </mesh>
  );
};

export default AudioVisualizer;