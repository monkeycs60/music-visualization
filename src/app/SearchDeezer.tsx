'use client';

import clsx from 'clsx';
import { useState, useEffect, useCallback } from 'react';
import debounce from 'lodash.debounce';
import { deezerSearchApi } from '@/utils/deezerSearchApi';
import AudioPlayer from './AudioPlayer';
import MusicList from './MusicList';

declare global {
  interface Window {
    DZ: any;
  }
}

const SearchDeezer = () => {
   const [searchQuery, setSearchQuery] = useState('');
   const [searchResults, setSearchResults] = useState([]);
   const [trackUrl, setTrackUrl] = useState<string | null>(null);
   const [selectedTrack, setSelectedTrack] = useState<any | null>(null);

   const search = useCallback((searchQuery: string) => {
      deezerSearchApi({ searchQuery, setSearchResults, setTrackUrl });
   }, [setTrackUrl]);

   useEffect(() => {
      const debouncedSearch = debounce((searchQuery: string) => search(searchQuery), 500);
      debouncedSearch(searchQuery);
      return () => debouncedSearch.cancel();
   }, [searchQuery, search]);

   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
   };

   const handleResultClick = (trackInfo: any) => {
      setSelectedTrack(trackInfo);
   };

   return (
      <div className={clsx(
         'z-10 mt-12 flex h-[85%] w-full items-center justify-between',
      )}>
         <div className='flex h-full w-1/2 flex-col items-start justify-start'>
            <input
               type="text"
               value={searchQuery}
               onChange={handleInputChange}
               className={clsx(
                  'font-xl h-10 w-2/3 border-2 border-gray-300 bg-yellow-50 p-8 text-xl placeholder:text-2xl placeholder:text-black focus:outline-none',
                  'focus:border-fuchsia-400',
               )}
               placeholder='Search for a song'
            />
            {
               searchResults && (
                  <MusicList searchResults={searchResults} onResultClick={handleResultClick}  />
               )

            }
         </div>
         {selectedTrack && (
            <AudioPlayer trackInfo={selectedTrack}  />
         )}

      </div>
   );
};

export default SearchDeezer;