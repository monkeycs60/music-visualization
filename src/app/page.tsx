import clsx from 'clsx';
import DeezerSDK from './DeezerSDK';
import SearchDeezer from './SearchDeezer';

export default function Home() {
   return (
      <div className='m-auto h-[100vh] w-[90vw] py-12'>
         <h1 className={clsx(
            'font-futuristic text-4xl font-bold text-yellow-600',
            'sm:text-2xl sm:font-light',
        		'lg:text-7xl lg:font-bold lg:text-pink-600',
         )} >Tunescape</h1>
		 <DeezerSDK />
		 <SearchDeezer />
         {/* <MusicPlayer /> */}
      </div>
   );
}
