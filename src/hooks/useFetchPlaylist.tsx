import { useQuery } from '@tanstack/react-query';
import { fetchPlaylist } from '@/services/fetchPlaylist';
import { MusicType } from '@/services/types';

const useFetchPlaylist = () => {
    const { data, error, isLoading } = useQuery<MusicType[]>(
        ['playlist'],
        fetchPlaylist,
        );

    return {
        data,
        error,
        isLoading,
    };
};

export default useFetchPlaylist;