import clsx from 'clsx';
import { arc } from 'd3';
import { useState } from 'react';
import ParticleChoreography from '@/components/ParticleChoregraphy';

const arcBuilder = arc();

type MediaPlayerProps = {
  trackUrl: string;
};

const AudioPlayer =  ({ trackUrl }: MediaPlayerProps) => {
    const [endAngle, setEndAngle] = useState(Math.PI);
    const [rawData, setRawData] = useState<number[]>([]);
    
  const initAudio = async () => {
  const res = await fetch(trackUrl);
  const byteArray = await res.arrayBuffer();

  const context = new AudioContext();
  const audioBuffer = await context.decodeAudioData(byteArray);

  const source = context.createBufferSource();
  source.buffer = audioBuffer;

  const analyzer = context.createAnalyser();
  analyzer.fftSize = 512;

  source.connect(analyzer);
  analyzer.connect(context.destination);
  source.start();

  const bufferLength = analyzer.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  const update = () => {
  analyzer.getByteFrequencyData(dataArray);
  const numberArray = Array.from(dataArray);
  setRawData(numberArray);
  const avgFreq = dataArray.reduce((acc, val) => acc + val, 0) / bufferLength;
  setEndAngle((avgFreq / 255) * Math.PI);
  requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
};

const path = arcBuilder({
innerRadius: 50,
outerRadius: 90,
startAngle: 0,
endAngle: endAngle,
});

  return (
    <>
    <div
    className={clsx(
      'relative flex h-3/4 w-full items-center justify-center rounded-lg bg-gray-400 p-16',
    )}
    onClick={initAudio}
    >
      <svg className={clsx(
        'h-full w-full',
      )}
      viewBox='-100 -100 200 200'
      preserveAspectRatio='xMidYMid meet'
      >
          <g>
            <path d={path!} fill='black' />
         </g>
      </svg>
      <ParticleChoreography  data={rawData} />
    </div>
</>
);
};

export default AudioPlayer;