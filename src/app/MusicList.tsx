import clsx from 'clsx';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { audioSliceProps } from '@/redux/types';
import { setQuerySearch, setTrackInfo } from '@/redux/audioSlice';

const MusicList = () => {
   const dispatch = useDispatch();
   // (redux store) The 8 tracks infos returned by the Deezer API
   const trackInfo = useSelector((state: audioSliceProps) => state.audio.trackInfo);

   const convertDuration = (duration: number) => {
      const minutes = Math.floor(duration / 60);
      const seconds = Math.floor(duration % 60);
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
   };
   
   return (
      <motion.div
         initial={{ opacity: 0 }}
         animate={{ opacity: 1, y: 0 }}
         exit={{ opacity: 0 }}
         transition={{ duration: 2 }}
         className={clsx(
            'flex h-full w-2/3 flex-col items-start justify-start gap-1'
         )}>
         {
            trackInfo
               .map((result: any) => (
                  <div key={result.id} className={
                     clsx(
                        'flex h-full w-full cursor-pointer items-center justify-between bg-yellow-50 p-4 text-xl font-bold text-black',
                        'hover:bg-yellow-100',
                     )
                  }
                  // onClick={() => onResultClick(result)}
                  >
                     <div className={clsx(
                        'flex items-center gap-12 '
                     )}>
                        <img src={result.album.cover_medium} alt={result.title} className={clsx(
                           'max-w-16 max-h-16 rounded-lg'
                        )} />
                        <div className='font-futuristic'>
                           <p>{result.title}</p>
                           <p className='font-thin text-black/60'>
                              {result.artist.name}
                           </p>
                        </div>
                     </div>
                     <p>
                        {convertDuration(result.duration)}
                     </p>
                  </div>
               ))
         }
      </motion.div>
   );
};

export default MusicList;