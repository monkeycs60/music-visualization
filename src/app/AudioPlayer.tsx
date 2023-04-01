import clsx from 'clsx';
import { useState, useEffect, useRef } from 'react';
import AudioVisualizer from './AudioVisualizer';

type MediaPlayerProps = {
    trackUrl: string;
};

const AudioPlayer = ({ trackUrl }: MediaPlayerProps) => {
  console.log('MediaPlayer', trackUrl);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      const loadAudioData = async () => {
        const audioContext = new AudioContext();
        const response = await fetch(trackUrl);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        setAudioBuffer(audioBuffer);
        console.log('audioBuffer', audioBuffer);
      };

      loadAudioData();
    }
  }, [trackUrl]);

  return (
    <>
      <audio
        ref={audioRef}
        src={trackUrl}
        controls
        className={clsx('mt-8 w-full')}
      />
      {/* {audioBuffer && <AudioVisualizer audioBuffer={audioBuffer} />} */}
    </>
  );
};

export default AudioPlayer;