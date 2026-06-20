import type { IReleases } from '@/types/IReleases';
import type { IRepo } from '@/types/IRepos';

export const mockRepo = (overrides: Partial<IRepo> = {}): IRepo => ({
    id: 1,
    repo: 'next.js',
    owner: 'vercel',
    ...overrides
});

export const mockRelease = (overrides: Partial<IReleases> = {}): IReleases => ({
    id: 10,
    tag: 'v14.0.0',
    name: 'v14.0.0',
    ...overrides
});

export const setLocationSearch = (search: string) => {
    window.history.pushState({}, '', search ? `/?${search.replace(/^\?/, '')}` : '/');
    window.dispatchEvent(new PopStateEvent('popstate'));
};
