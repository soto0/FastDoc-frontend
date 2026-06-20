import type { IReleasesPage, ReleasesResponse } from '@/types/IReleases';
import type { IRepo } from '@/types/IRepos';
import { apiClient } from '@/utils/apiClient';

export const getReleases = async (params: Pick<IRepo, 'repo' | 'owner'> & { page: number }): Promise<IReleasesPage> => {
    const response = await apiClient.get<ReleasesResponse>('/repos/releases', {
        params
    });

    return {
        releases: response.data.payload,
        hasMore: response.data.meta.hasMore as boolean
    };
};
