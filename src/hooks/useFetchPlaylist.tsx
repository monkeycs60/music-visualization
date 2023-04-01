import { useQuery } from '@tanstack/react-query';
import { fetchPlaylist } from '@/app/api/deezer/fetchPlaylist';
import { MusicType } from '@/app/api/deezer/types';

const useFetchPlaylist = (searchTerm: string) => {
    const { data, error, isLoading } = useQuery<MusicType[]>(
        ['playlist', searchTerm],
        () => fetchPlaylist(searchTerm),
        );

    return {
        data,
        error,
        isLoading,
    };
};

export default useFetchPlaylist;