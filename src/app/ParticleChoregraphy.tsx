import React, { useRef, useEffect } from 'react';

type ParticleChoreographyProps = {
  data: number[];
};

const ParticleChoreography = ({ data }: ParticleChoreographyProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      data.forEach((val, idx) => {
        const radius = val / 2;
        const angle = (idx / data.length) * Math.PI * 2;
        const x = canvas.width / 2 + Math.cos(angle) * radius;
        const y = canvas.height / 2 + Math.sin(angle) * radius;

        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `hsl(${(idx / data.length) * 360}, 100%, 50%)`;
        ctx.fill();
        ctx.closePath();
      });
    };

    draw();
  }, [data]);

  return (
    <canvas
      ref={canvasRef}
      width={600}
      height={600}
      style={{ position: 'absolute', top: 100, left: 0 }}
    ></canvas>
  );
};

export default ParticleChoreography;