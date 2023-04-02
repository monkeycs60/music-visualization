'use client';

import DeezerSDK from './DeezerSDK';
import SearchDeezer from './SearchDeezer';

export const MusicPlayer = () => {
   return (
      <div>
         <h1 className='text-4xl text-blue-900'>Music Player</h1>
         <p>coucou</p>
         <DeezerSDK />
         <SearchDeezer />
      
      </div>
   );
};
