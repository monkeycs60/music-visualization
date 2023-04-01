import clsx from 'clsx';

type MediaPlayerProps = {
    trackUrl: string;
};

const MediaPlayer = ({trackUrl}: MediaPlayerProps) => {
    console.log('MediaPlayer', trackUrl);
    
    console.log('MediaPlayer', trackUrl);
    return (
         <audio
          src={trackUrl}
          controls
          className={clsx(
            'mt-8 w-full',
          )}
        />
        );
          };

export default MediaPlayer;