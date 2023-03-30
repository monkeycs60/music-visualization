'use client';

import useFetchPlaylist from '@/hooks/useFetchPlaylist';

export const MusicPlayer = () => {
    useFetchPlaylist();
  return (
    <div>MusicPlayer</div>
  );
};
