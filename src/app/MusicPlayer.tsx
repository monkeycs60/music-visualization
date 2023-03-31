'use client';

import useFetchPlaylist from '@/hooks/useFetchPlaylist';

export const MusicPlayer = () => {
    const { data, error, isLoading } = useFetchPlaylist();
    console.log(data);
    
  return (
    <div>
        <h1 className='text-4xl text-blue-900'>Music Player</h1>
        <p>coucou</p>
        { data &&  <audio controls loop src={data[2].preview}></audio>}
 
    </div>
  );
};
