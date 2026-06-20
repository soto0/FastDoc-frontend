import type { IRepo, ReposResponse } from '@/types/IRepos';
import { apiClient } from '@/utils/apiClient';

let controller: AbortController | null = null;

export const getRepos = async (query: string): Promise<IRepo[]> => {
    controller?.abort();
    controller = new AbortController();

    const response = await apiClient.get<ReposResponse>('/repos/search', {
        params: { query },
        signal: controller.signal
    });

    return response.data.payload;
};
