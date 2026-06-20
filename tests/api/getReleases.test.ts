import { mockRelease } from '@tests/helpers/testHelper';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { getReleases } from '@/api/getReleases';

const { getMock } = vi.hoisted(() => ({
    getMock: vi.fn()
}));

vi.mock('@/utils/apiClient', () => ({
    apiClient: {
        get: getMock
    }
}));

describe('getReleases', () => {
    beforeEach(() => {
        getMock.mockReset();
    });

    it('returns releases and hasMore from the API response', async () => {
        const releases = [mockRelease()];
        getMock.mockResolvedValueOnce({
            data: {
                payload: releases,
                meta: { success: true, hasMore: true }
            }
        });

        const result = await getReleases({ repo: 'next.js', owner: 'vercel', page: 1 });

        expect(result).toEqual({ releases, hasMore: true });
        expect(getMock).toHaveBeenCalledWith('/repos/releases', {
            params: { repo: 'next.js', owner: 'vercel', page: 1 }
        });
    });
});
