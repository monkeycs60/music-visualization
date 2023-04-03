import clsx from 'clsx';
import { arc } from 'd3';
import { useState, useRef, useEffect } from 'react';
import ProgressBar from '@/components/ProgressBar';
import AudioBars from './AudioBars';
import ThreeDAudioVisualizer from './ThreeDAudioVisualizer';
import { motion } from 'framer-motion';
import debounce from 'lodash.debounce';

const arcBuilder = arc();

type MediaPlayerProps = {
   trackInfo: any;
};

const AudioPlayer = ({  trackInfo }: MediaPlayerProps) => {
   const [rawData, setRawData] = useState<number[]>([]);
   const [currentTime, setCurrentTime] = useState(0);
   const [duration, setDuration] = useState(0);
   const [arcRadius, setArcRadius] = useState(50);
   const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
   const [audioSource, setAudioSource] = useState<AudioBufferSourceNode | null>(null);
   const [isPlaying, setIsPlaying] = useState(false);
   const feTurbulenceRef = useRef<SVGFETurbulenceElement>(null);
   const [shouldPlay, setShouldPlay] = useState(false);
   const [wasPlaying, setWasPlaying] = useState(false);

   const playNewTrack = async () => {
   // Stop the current audio playback
      if (audioSource) {
         audioSource.stop();
      }

      // Reset the audio context, source and playback states
      setAudioContext(null);
      setAudioSource(null);
      setIsPlaying(false);

      // Call togglePlayPause to start playing the new track
      await togglePlayPause();
   };

   useEffect(() => {
      if (isPlaying) {
         playNewTrack();
      } else {
      // Stop the current audio playback
         if (audioSource) {
            audioSource.stop();
         }

         // Reset the audio context, source and playback states
         setAudioContext(null);
         setAudioSource(null);
         setIsPlaying(false);
      }
   }, [trackInfo]);
  
   const togglePlayPause = async () => {
      if (!audioContext) {
         const res = await fetch(trackInfo.preview);
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
         <motion.div
            initial={{ opacity: 0, x: 200 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className={clsx(
               'relative flex h-full w-1/2 flex-col items-center justify-center rounded-lg bg-gray-400 p-16',
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
                  style={{ cursor: 'pointer'}}
                  onClick={() =>
                     togglePlayPause()}

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
         </motion.div>
      </>
   );
};

export default AudioPlayer;