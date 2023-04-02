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

   return (
      <div className={clsx(
         'mt-12 flex h-full w-full flex-col items-start justify-start gap-12',
      )}>
         <input
            type="text"
            value={searchQuery}
            onChange={handleInputChange}
            className={clsx(
               'h-10 w-1/5 rounded-lg border-2 border-gray-300 bg-white px-5 pr-16 text-sm focus:outline-none',
               'focus:border-blue-500',
            )}
         />
         {
            searchResults && (
               <MusicList searchResults={searchResults}  />
            )

         }
         {/* {trackUrl && (
            <AudioPlayer trackUrl={trackUrl} />
         )} */}

      </div>
   );
};

export default SearchDeezer;