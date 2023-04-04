'use client';

import clsx from 'clsx';
import { useState, useEffect, useCallback } from 'react';
import debounce from 'lodash.debounce';
import AudioPlayer from './AudioPlayer';
import MusicList from './MusicList';
import { useDispatch, useSelector } from 'react-redux';
import { audioSliceProps } from '@/app/redux/types';
import { setQuerySearch, setTrackInfo, resetStore } from '@/app/redux/audioSlice';

declare global {
  interface Window {
    DZ: any;
  }
}

const SearchDeezer = () => {
   const dispatch = useDispatch();
   const reduxLog = useSelector((state: audioSliceProps) => state);
   console.log('trackInfo REDUX', reduxLog);

   // reset the redux store on refresh
   useEffect(() => {
      dispatch(resetStore());
   }, [dispatch]);

   // (redux store) The search query user types in the input
   const QuerySearch = useSelector((state: audioSliceProps) => state.audio.QuerySearch);

   // (redux store) The 8 tracks infos returned by the Deezer API
   const trackInfo = useSelector((state: audioSliceProps) => state.audio.trackInfo);

   // Handle the input change
   const handleInputChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
         dispatch(setQuerySearch(e.target.value));
      },
      [dispatch],
   );

   // Debounce the search query to avoid too many API calls
   useEffect(() => {
      const debouncedSearch = debounce(() => {
         if (window.DZ) {
            // API call to Deezer - search for 8 tracks matching the search query
            window.DZ.api(`search?q=${QuerySearch}`, (response: any) => {
               if (response.data && response.data.length > 0) {
               // put the 8 tracks infos in the redux store
                  dispatch(setTrackInfo(response.data.slice(0, 8)));
               }
            });
         }
      }, 500);

      debouncedSearch();
      return () => {
         debouncedSearch.cancel(); // Cancel the debounced function when the component unmounts or QuerySearch changes
      };
   }, [QuerySearch, dispatch, handleInputChange]);

   //if window reloads, clean the redux store

   return (
      <div className={clsx(
         'z-10 mt-12 flex h-[85%] w-full items-center justify-between',
      )}>
         <div className='flex h-full w-1/2 flex-col items-start justify-start'>
            <input
               type="text"
               value={QuerySearch}
               onChange={handleInputChange}
               className={clsx(
                  'font-xl h-10 w-2/3 border-2 border-gray-300 bg-yellow-50 p-8 text-xl placeholder:text-2xl placeholder:text-black focus:outline-none',
                  'focus:border-fuchsia-400',
               )}
               placeholder='Search for a song'
            />
            {
               
               trackInfo && (
                  <MusicList />
               )

            }
         </div>
         {/* {QuerySearch && (
            <AudioPlayer trackInfo={selectedTrack}  />
         )} */}

      </div>
   );
};

export default SearchDeezer;