import { z } from 'zod';

export const MusicScheme = z.object({
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
    explicit_content_cover: z.number(),
    preview: z.string(),
    md5_image: z.string(),
    time_add: z.number(),
    artist: z.object({
        id: z.number(),
        name: z.string(),
        link: z.string(),
        tracklist: z.string(),
        type: z.string(),
    }),
    album: z.object({
        id: z.number(),
        title: z.string(),
        cover: z.string(),
        cover_small: z.string(),
        cover_medium: z.string(),
        cover_big: z.string(),
        cover_xl: z.string(),
        md5_image: z.string(),
        tracklist: z.string(),
        type: z.string(),
    }),
    type: z.string(),
});

export const PlaylistDataSchema = z.object({
    tracks: z.object({
        data: z.array(MusicScheme),
    }),
});

export type MusicType = z.infer<typeof MusicScheme>;
export type PlaylistDataType = z.infer<typeof PlaylistDataSchema>;