'use client';

import clsx from 'clsx';
import { useState, useEffect, useCallback } from 'react';
import debounce from 'lodash.debounce';

declare global {
  interface Window {
    DZ: any;
  }
}

const SearchDeezer = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [trackUrl, setTrackUrl] = useState<string | null>(null);

  const search = useCallback((searchQuery: string) => {
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
    <div>
      <input
        type="text"
        value={searchQuery}
        onChange={handleInputChange}
        className={clsx(
          'h-10 rounded-lg border-2 border-gray-300 bg-white px-5 pr-16 text-sm focus:outline-none',
          'focus:border-blue-500',
        )}
      />
    </div>
  );
};

export default SearchDeezer;