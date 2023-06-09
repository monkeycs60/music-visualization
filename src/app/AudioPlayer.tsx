import clsx from 'clsx';
import { arc } from 'd3';
import { useState, useRef, useEffect } from 'react';
import ProgressBar from '@/components/ProgressBar';
import AudioBars from './AudioBars';
import ThreeDAudioVisualizer from './ThreeDAudioVisualizer';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { setDuration, setQuerySearch, setTrackInfo, setCurrentTime, setArcRadius, setRawData, setIsPlaying, setAudioSource, setAudioContext } from '@/redux/audioSlice';
import { audioSliceProps } from '@/redux/types';
import debounce from 'lodash.debounce';

const arcBuilder = arc();

type MediaPlayerProps = {
   trackInfo: any;
};

const AudioPlayer = () => {
   const feTurbulenceRef = useRef<SVGFETurbulenceElement>(null);
   const dispatch = useDispatch();

   // (redux store) The 8 tracks infos returned by the Deezer API
   const trackInfo = useSelector((state: audioSliceProps) => state.audio.trackInfo);
   // (redux store) The duration of the audio track
   const durationRedux = useSelector((state: audioSliceProps) => state.audio.duration);
   // (redux store) The raw datas of the audio track (used to draw the audio visualizer)
   const rawData = useSelector((state: audioSliceProps) => state.audio.rawData);
   // (redux store) The current clicked track
   const clickedTrack = useSelector((state: audioSliceProps) => state.audio.clickedTrack);
   // (redux store) The current time of the audio track
   const currentTimeRedux = useSelector((state: audioSliceProps) => state.audio.currentTime);
   const arcRadiusRedux = useSelector((state: audioSliceProps) => state.audio.arcRadius);
   const isPlayingRedux = useSelector((state: audioSliceProps) => state.audio.isPlaying);
   const audioSourceRedux = useSelector((state: audioSliceProps) => state.audio.audioSource);
   const audioContextRedux = useSelector((state: audioSliceProps) => state.audio.audioContext);
  
   const togglePlayPause = async () => {
      if (!audioContextRedux) {
         const res = await fetch(clickedTrack.preview);
         const byteArray = await res.arrayBuffer();

         const context = new AudioContext();
         const audioBuffer = await context.decodeAudioData(byteArray);

         const source = context.createBufferSource();
         source.buffer = audioBuffer;
         dispatch(setDuration(audioBuffer.duration));

         const analyzer = context.createAnalyser();
         analyzer.fftSize = 512;

         source.connect(analyzer);
         analyzer.connect(context.destination);
         source.start();

         const bufferLength = analyzer.frequencyBinCount;
         const dataArray = new Uint8Array(bufferLength);

         // realtime update of the current time
         const updateCurrentTime = () => {
            const trackCurrentTime = context.currentTime;
            dispatch(setCurrentTime(trackCurrentTime));
         };

         const updateBaseFrequency = () => {
            if (rawData.length === 0) {
               return;
            }
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
            dispatch(setArcRadius(newArcRadius));
         };

         const update = () => {
            analyzer.getByteFrequencyData(dataArray);
            const numberArray = Array.from(dataArray);
            dispatch(setRawData(numberArray));
            updateBaseFrequency();
            const avgFreq = dataArray.reduce((acc, val) => acc + val, 0) / bufferLength;
            requestAnimationFrame(update);
            updateCurrentTime();
         };
         requestAnimationFrame(update);

         source.onended = () => {
            dispatch(setIsPlaying(false));
            dispatch(setAudioContext(null));
            dispatch(setAudioSource(null));
            dispatch(setArcRadius(80));
         };

         dispatch(setAudioContext(context));
         dispatch(setAudioSource(source));
         dispatch(setIsPlaying(true));
      } else {
         if (isPlayingRedux) {
            audioContextRedux.suspend().then(() => {
               dispatch(setIsPlaying(false));
            });
         } else {
            audioContextRedux.resume().then(() => {
               dispatch(setIsPlaying(true));
            });
         }
      }
   };

   // const playNewTrack = async () => {
   // // Stop the current audio playback
   //    if (audioSource) {
   //       audioSource.stop();
   //    }

   //    // Reset the audio context, source and playback states
   //    setAudioContext(null);
   //    setAudioSource(null);
   //    setIsPlaying(false);

   //    // Call togglePlayPause to start playing the new track
   //    await togglePlayPause();
   // };

   // useEffect(() => {
   //    if (isPlaying) {
   //       playNewTrack();
   //    } else {
   //    // Stop the current audio playback
   //       if (audioSource) {
   //          audioSource.stop();
   //       }

   //       // Reset the audio context, source and playback states
   //       setAudioContext(null);
   //       setAudioSource(null);
   //       setIsPlaying(false);
   //    }
   // }, [trackInfo]);

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
                           innerRadius: arcRadiusRedux - 2,
                           outerRadius: arcRadiusRedux + 5,
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
                  {
                     isPlayingRedux ? 'Play' : '▶'}
               </text>
            </svg>
            <AudioBars width={400} />
            <ThreeDAudioVisualizer />
            <ProgressBar width={200} />
            <div>
               {formatTime(durationRedux - currentTimeRedux) < '0:00'
                  ? '0:00'
                  : formatTime(durationRedux - currentTimeRedux)}
            </div>
         </motion.div>
      </>
   );
};

export default AudioPlayer;