import type { IReleases } from '@/types/IReleases';
import { act, renderHook, waitFor } from '@testing-library/react';
import { mockRelease } from '@tests/helpers/testHelper';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useReleases } from '@/hooks/useReleasesSelector';

const { getReleasesMock } = vi.hoisted(() => ({
    getReleasesMock: vi.fn()
}));

vi.mock('@/api/getReleases', () => ({
    getReleases: getReleasesMock
}));

const defaultProps = () => ({
    repo: 'next.js',
    owner: 'vercel',
    open: true,
    setOpen: vi.fn(),
    setTag: vi.fn(),
    tag: undefined as string | undefined
});

describe('useReleases', () => {
    beforeEach(() => {
        getReleasesMock.mockReset();
        vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
            cb(0);
            return 1;
        });
        vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {});
    });

    it('returns null selected when tag is not set', () => {
        const { result } = renderHook(() => useReleases({ ...defaultProps(), open: false }));

        expect(result.current.selected).toBeNull();
    });

    it('returns a virtual release when tag is set before data loads', async () => {
        getReleasesMock.mockResolvedValueOnce({ releases: [], hasMore: false });

        const { result } = renderHook(() => useReleases({ ...defaultProps(), tag: 'v14.0.0' }));

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
        });

        expect(result.current.selected).toEqual({ tag: 'v14.0.0', name: 'v14.0.0' });
    });

    it('returns the full release object when tag matches loaded data', async () => {
        const release = mockRelease({ id: 42, tag: 'v15.0.0', name: 'Release 15' });
        getReleasesMock.mockResolvedValueOnce({ releases: [release], hasMore: false });

        const { result } = renderHook(() => useReleases({ ...defaultProps(), tag: 'v15.0.0' }));

        await waitFor(() => {
            expect(result.current.releases).toHaveLength(1);
        });

        expect(result.current.selected).toEqual(release);
    });

    it('loads the first page when the popover opens', async () => {
        getReleasesMock.mockResolvedValueOnce({
            releases: [mockRelease()],
            hasMore: true
        });

        renderHook(() => useReleases(defaultProps()));

        await waitFor(() => {
            expect(getReleasesMock).toHaveBeenCalledWith({
                repo: 'next.js',
                owner: 'vercel',
                page: 1
            });
        });
    });

    it('resets releases when the repository changes', async () => {
        getReleasesMock
            .mockResolvedValueOnce({ releases: [mockRelease({ tag: 'v1.0.0' })], hasMore: false })
            .mockResolvedValueOnce({ releases: [mockRelease({ id: 2, tag: 'v2.0.0' })], hasMore: false });

        const { result, rerender } = renderHook((props) => useReleases(props), { initialProps: defaultProps() });

        await waitFor(() => {
            expect(result.current.releases).toHaveLength(1);
        });

        rerender({ ...defaultProps(), repo: 'react', owner: 'facebook' });

        await waitFor(() => {
            expect(result.current.releases).toEqual([expect.objectContaining({ tag: 'v2.0.0' })]);
        });
    });

    it('clears releases and stops pagination on fetch error', async () => {
        getReleasesMock.mockRejectedValueOnce(new Error('network'));

        const { result } = renderHook(() => useReleases(defaultProps()));

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
        });

        expect(result.current.releases).toEqual([]);
    });

    it('selects a release and closes the popover', async () => {
        getReleasesMock.mockResolvedValueOnce({
            releases: [mockRelease()],
            hasMore: false
        });

        const props = defaultProps();
        const { result } = renderHook(() => useReleases(props));

        await waitFor(() => {
            expect(result.current.releases).toHaveLength(1);
        });

        const release: IReleases = { id: 1, tag: 'v14.0.0', name: 'v14.0.0' };

        act(() => {
            result.current.selectRelease(release);
        });

        expect(props.setTag).toHaveBeenCalledWith('v14.0.0');
        expect(props.setOpen).toHaveBeenCalledWith(false);
    });
});
