import { MusicType, PlaylistDataSchema } from './types';

// DEEZER CALL AVOIDING CARS ISSUE WITH GPT MAGIC !!

export const fetchPlaylist = async (searchTerm: string): Promise<MusicType[]> => {
  //Search songs in deezer database following the search term
  const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
  const searchUrl = `${proxyUrl}https://api.deezer.com/search?q=${encodeURIComponent(searchTerm)}`;
  //Call my playlist on deezer
  const playlistUrl = 'https://api.deezer.com/playlist/11240287344';

  // Generate a random callback name
  const callbackName = `jsonpCallback_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

  return new Promise((resolve, reject) => {
    // Register the callback function in the global scope
    (window as any)[callbackName] = (data: unknown) => {
      const parsedData = PlaylistDataSchema.parse(data);
      const playlist: MusicType[] = parsedData.tracks.data;
      resolve(playlist);
    };

    // Create a script tag and set its source to the API URL with the output and callback parameters
    const script = document.createElement('script');
    script.src = `${searchUrl}?output=jsonp&callback=${callbackName}`;
    document.body.appendChild(script);

    // Clean up after the script is loaded and executed
    script.onload = () => {
      document.body.removeChild(script);
      delete (window as any)[callbackName];
    };

    script.onerror = () => {
      document.body.removeChild(script);
      delete (window as any)[callbackName];
      reject(new Error('Failed to load JSONP script'));
    };
  });
};

export function jsonpCallback(callbackName: string, data: unknown) {
  (window as any)[callbackName](data);
}
