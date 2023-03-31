import { MusicType, PlaylistDataSchema } from './types';

// DEEZER CALL WITH SDK !!

// DEEZER CALL AVOIDING CARS ISSUE WITH GPT MAGIC !!

export const fetchPlaylist = async (): Promise<MusicType[]> => {
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
    script.src = `${playlistUrl}?output=jsonp&callback=${callbackName}`;
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

// FIRST CALL TO DEEZER BUT CORS ISSUE !!

// export const fetchPlaylist = async () => {
//   const playlistUrl = 'https://api.deezer.com/playlist/11240287344';
//   const response = await fetch(playlistUrl, {
//      mode: 'cors',
//   });
//   const data: unknown = await response.json();
//   const parsedData = PlaylistDataSchema.parse(data);
//   const playlist: MusicType[] = parsedData.tracks.data;
//   return playlist;
// };