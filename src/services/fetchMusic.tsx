import { z } from 'zod';

// {"id":115195420,"readable":true,"title":"Move on Up (Single Edit)","title_short":"Move on Up","title_version":"(Single Edit)","link":"https:\/\/www.deezer.com\/track\/115195420","duration":165,"rank":659983,"explicit_lyrics":false,"explicit_content_lyrics":6,"explicit_content_cover":2,"preview":"https:\/\/cdns-preview-9.dzcdn.net\/stream\/c-92db1a86df405d599f8d6c9223895654-7.mp3","md5_image":"93637763db9f47b7a8f8c1e31ff11c0e","time_add":1680195089,"artist":{"id":2027,"name":"Curtis Mayfield","link":"https:\/\/www.deezer.com\/artist\/2027","tracklist":"https:\/\/api.deezer.com\/artist\/2027\/top?limit=50","type":"artist"},"album":{"id":11936982,"title":"Move on Up (Single Edit)","cover":"https:\/\/api.deezer.com\/album\/11936982\/image","cover_small":"https:\/\/e-cdns-images.dzcdn.net\/images\/cover\/93637763db9f47b7a8f8c1e31ff11c0e\/56x56-000000-80-0-0.jpg","cover_medium":"https:\/\/e-cdns-images.dzcdn.net\/images\/cover\/93637763db9f47b7a8f8c1e31ff11c0e\/250x250-000000-80-0-0.jpg","cover_big":"https:\/\/e-cdns-images.dzcdn.net\/images\/cover\/93637763db9f47b7a8f8c1e31ff11c0e\/500x500-000000-80-0-0.jpg","cover_xl":"https:\/\/e-cdns-images.dzcdn.net\/images\/cover\/93637763db9f47b7a8f8c1e31ff11c0e\/1000x1000-000000-80-0-0.jpg","md5_image":"93637763db9f47b7a8f8c1e31ff11c0e","tracklist":"https:\/\/api.deezer.com\/album\/11936982\/tracks","type":"album"},"type":"track"},

const MusicScheme = z.object({
    id: z.number(),
    readable: z.boolean(),
    title: z.string(),
    title_short: z.string(),
    title_version: z.string(),
    link: z.string(),
    duration: z.number(),
    rank: z.number(),
    explicit_lyrics: z.boolean(),
    explicit_content_lyrics: z.number(),
});

type MusicType = z.infer<typeof MusicScheme>;

const fetchPlaylist = async () => {
  const playlistUrl = 'https://api.deezer.com/playlist/11240287344';
  const response = await fetch(playlistUrl);
  const data = await response.json();
  const playlist: MusicType[] = data.tracks.data;
  return playlist;
};