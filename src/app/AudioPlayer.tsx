import clsx from 'clsx';
import { arc } from 'd3';
import { useState, useRef } from 'react';
import ProgressBar from '@/components/ProgressBar';
import AudioBars from './AudioBars';
import ThreeDAudioVisualizer from './ThreeDAudioVisualizer';

const arcBuilder = arc();

type MediaPlayerProps = {
  trackUrl: string;
};

const AudioPlayer = ({ trackUrl }: MediaPlayerProps) => {
   const [rawData, setRawData] = useState<number[]>([]);
   const [currentTime, setCurrentTime] = useState(0);
   const [duration, setDuration] = useState(0);
   const [arcRadius, setArcRadius] = useState(50);
   const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
   const [audioSource, setAudioSource] = useState<AudioBufferSourceNode | null>(null);
   const [isPlaying, setIsPlaying] = useState(false);
   const feTurbulenceRef = useRef<SVGFETurbulenceElement>(null);

   const togglePlayPause = async () => {
      if (!audioContext) {
         const res = await fetch(trackUrl);
         const byteArray = await res.arrayBuffer();

         const context = new AudioContext();
         const audioBuffer = await context.decodeAudioData(byteArray);

         const source = context.createBufferSource();
         source.buffer = audioBuffer;
         setDuration(audioBuffer.duration);

         const analyzer = context.createAnalyser();
         analyzer.fftSize = 512;

         source.connect(analyzer);
         analyzer.connect(context.destination);
         source.start();

         const bufferLength = analyzer.frequencyBinCount;
         const dataArray = new Uint8Array(bufferLength);

         // realtime update of the current time
         const updateCurrentTime = () => {
            setCurrentTime(context.currentTime);
         };

         const updateBaseFrequency = (rawData: number[]) => {
            const avgFreq = rawData.reduce((acc, val) => acc + val, 0) / rawData.length;
            const normalizedFreq = avgFreq / 255;
            const baseFrequency = 0.01 + normalizedFreq * 0.1; // Ajustez le multiplicateur pour obtenir l'effet souhaité

            if (feTurbulenceRef.current) {
               feTurbulenceRef.current.setAttribute('baseFrequency', baseFrequency.toString());
            }

            // Mettre à jour le rayon de l'arc de cercle en fonction de l'intensité de la bande sonore
            const minRadius = 50; // Rayon minimum
            const maxRadius = 80; // Rayon maximum
            const newArcRadius = minRadius + normalizedFreq * (maxRadius - minRadius);
            setArcRadius(newArcRadius);
         };

         const update = () => {
            analyzer.getByteFrequencyData(dataArray);
            const numberArray = Array.from(dataArray);
            setRawData(numberArray);
            updateBaseFrequency(numberArray);
            const avgFreq = dataArray.reduce((acc, val) => acc + val, 0) / bufferLength;
            requestAnimationFrame(update);
            updateCurrentTime();
         };
         requestAnimationFrame(update);

         source.onended = () => {
            setIsPlaying(false);
            setAudioContext(null);
            setAudioSource(null);
            setArcRadius(80);
         };

         setAudioContext(context);
         setAudioSource(source);
         setIsPlaying(true);
      } else {
         if (isPlaying) {
            audioContext.suspend().then(() => {
               setIsPlaying(false);
            });
         } else {
            audioContext.resume().then(() => {
               setIsPlaying(true);
            });
         }
      }
   };

   const formatTime = (time: number) => {
      const minutes = Math.floor(time / 60);
      const seconds = Math.floor(time % 60);
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
   };

   const avgIntensity = rawData.reduce((acc, val) => acc + val, 0) / rawData.length;

   return (
      <>
         <div
            className={clsx(
               'relative flex h-3/4 w-full flex-col items-center justify-center rounded-lg bg-gray-400 p-16',
            )}
         >
            <svg
               className={clsx('h-full w-3/4')}
               viewBox="-100 -100 200 200"
               preserveAspectRatio="xMidYMid meet"
            >
               <defs>
                  <linearGradient
                     id="gradient"
                     gradientUnits="userSpaceOnUse"
                     x1="-100"
                     y1="0"
                     x2="100"
                     y2="0"
                  >
                     <stop offset="0" stopColor="rgb(246,156,242)" stopOpacity="1" />
                     <stop offset="1" stopColor="rgb(18,236,246)" stopOpacity="1" />
                  </linearGradient>
                  <filter id="wavy">
                     <feTurbulence
                        ref={feTurbulenceRef}
                        baseFrequency={0.01}
                        numOctaves={3}
                        seed={99}
                        type ="fractalNoise"
                        stitchTiles="stitch"
                     />
                     <feDisplacementMap
                        xChannelSelector="R"
                        yChannelSelector="G"
                        scale="30"
                        in="SourceGraphic"
                     />
                  </filter>
               </defs>
               <g>
                  <path
                     d={
                        arcBuilder({
                           innerRadius: 60,
                           outerRadius: 58,
                           startAngle: 50,
                           endAngle: 2 * Math.PI,
                        }) || undefined
                     }
                     fill="none"
                     strokeWidth="8"
                     strokeLinecap="round"
                     stroke="url(#gradient)"
                     filter="url(#wavy)"
                  />
                  <path
                     d={
                        arcBuilder({
                           innerRadius: arcRadius - 2,
                           outerRadius: arcRadius + 5,
                           startAngle: 0,
                           endAngle: 2 * Math.PI,
                        }) || undefined
                     }
                     fill="none"
                     strokeWidth="6"
                     strokeLinecap="round"
                     stroke="url(#gradient)"
                  />
               </g>
               <text
                  x="0"
                  y="0"
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="48"
                  fontWeight="bold"
                  fill="white"
                  // pointerEvents="none"
                  onClick={togglePlayPause}

               >
                  {isPlaying ? 'Play' : '▶'}
               </text>
            </svg>
            <AudioBars data={rawData} width={400} />
            <ThreeDAudioVisualizer rawData={rawData} />
            <ProgressBar currentTime={currentTime} duration={duration} width={200} />
            <div>
               {formatTime(duration - currentTime) < '0:00'
                  ? '0:00'
                  : formatTime(duration - currentTime)}
            </div>
         </div>
      </>
   );
};

export default AudioPlayer;