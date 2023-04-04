type deezerSearchApiType = {
    searchQuery: string;
    setSearchResults: (searchResults: any) => void;
    setTrackUrl: (trackUrl: string) => void;
}

export const deezerSearchApi = ({ searchQuery, setSearchResults, setTrackUrl }: deezerSearchApiType) => {
   if (window.DZ && searchQuery) {
      window.DZ.api(`search?q=${searchQuery}`, (response: any) => {
         if (response.data && response.data.length > 0) {
            setSearchResults(response.data.slice(0, 8));
            console.log(response.data.slice(0, 8));
            
            const trackId = response.data[0].id;
            window.DZ.api(`track/${trackId}`, (trackResponse: any) => {
               setTrackUrl(trackResponse.preview);
            });
         }
      });
   }
};