import clsx from 'clsx';

type MusicListType = {
    searchResults: any;
}

const MusicList = ({searchResults}: MusicListType) => {
   return (
      <div className={clsx(
         'flex h-[80vh] w-1/3 flex-col items-start justify-start'
      )}>
         {
            searchResults.map((result: any) => (
               <div key={result.id} className={
                  clsx(
                     'flex w-full items-center justify-between'
                  )
               }>
                  <img src={result.album.cover_medium} alt={result.title} />
                  <p>{result.title}</p>
               </div>
            ))
         }
      </div>
   );
};

export default MusicList;