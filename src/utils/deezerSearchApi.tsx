type deezerSearchApiType = {
    searchQuery: string;
    setTrackUrl: (trackUrl: string) => void;
}

export const deezerSearchApi = ({ searchQuery, setTrackUrl }: deezerSearchApiType) => {
     if (window.DZ && searchQuery) {
      window.DZ.api(`search?q=${searchQuery}`, (response: any) => {
        console.log(response);
        if (response.data && response.data.length > 0) {
          const trackId = response.data[0].id;
          window.DZ.api(`track/${trackId}`, (trackResponse: any) => {
            console.log(trackResponse);
            setTrackUrl(trackResponse.preview);
          });
        }
      });
    }
};