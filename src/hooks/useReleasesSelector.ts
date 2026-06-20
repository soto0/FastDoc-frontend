import type { UIEvent } from 'react';
import type { IReleases } from '@/types/IReleases';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { getReleases } from '@/api/getReleases';

const BOTTOM_OFFSET = 40;
const OVERFLOW_TOLERANCE = 1;

interface ReleasesState {
    releases: IReleases[];
    page: number;
    hasMore: boolean;
    isLoading: boolean;
}

interface UseReleasesParams {
    repo?: string;
    owner?: string;
    open: boolean;
    setOpen: (open: boolean) => void;
    setTag: (tag: string | undefined) => void;
    tag?: string;
}

export const useReleases = ({ repo, owner, open, setOpen, setTag, tag }: UseReleasesParams) => {
    const [state, setState] = useState<ReleasesState>({
        releases: [],
        page: 1,
        hasMore: true,
        isLoading: false
    });

    const listRef = useRef<HTMLDivElement>(null);

    /**
     * Compute selected release:
     * - If tag exists, try to find full release object in loaded releases
     * - If not found, create virtual release with tag as name
     * - If no tag, selected is null
     */
    const selected = useMemo<IReleases | null>(() => {
        if (tag == null) return null;

        // Try to find full release object from API
        const found = state.releases.find((release) => release.tag === tag);
        if (found != null) return found;

        // Create virtual release — use tag as name until real data loads
        return { tag, name: tag } as IReleases;
    }, [tag, state.releases]);

    const loadNextPage = useCallback(() => {
        setState((current) => {
            if (!current.hasMore || current.isLoading) return current;
            return { ...current, page: current.page + 1, isLoading: true };
        });
    }, []);

    /**
     * Reset state when the repository changes
     */
    useEffect(() => {
        setState({
            releases: [],
            page: 1,
            hasMore: true,
            isLoading: repo != null && owner != null
        });
    }, [owner, repo]);

    /**
     * Fetch data from the API
     */
    useEffect(() => {
        if (open) {
            if (repo == null || owner == null || !state.isLoading) return;

            let ignore = false;

            getReleases({ repo, owner, page: state.page })
                .then(({ releases: batch, hasMore }) => {
                    if (ignore) return;

                    setState((current) => ({
                        releases: state.page === 1 ? batch : [...current.releases, ...batch],
                        page: current.page,
                        hasMore,
                        isLoading: false
                    }));
                })
                .catch(() => {
                    if (ignore) return;

                    setState((current) => ({
                        ...current,
                        releases: state.page === 1 ? [] : current.releases,
                        hasMore: false,
                        isLoading: false
                    }));
                });

            return () => {
                ignore = true;
            };
        }
    }, [owner, repo, state.isLoading, state.page, open]);

    const loadMore = useCallback(
        (list: HTMLDivElement) => {
            const doesNotOverflow = list.scrollHeight <= list.clientHeight + OVERFLOW_TOLERANCE;

            const isNearBottom = list.scrollTop + list.clientHeight >= list.scrollHeight - BOTTOM_OFFSET;

            if (doesNotOverflow || isNearBottom) loadNextPage();
        },
        [loadNextPage]
    );

    useEffect(() => {
        if (!open || !state.hasMore || state.isLoading) return;

        const frameId = window.requestAnimationFrame(() => {
            const list = listRef.current;
            if (list != null) loadMore(list);
        });

        return () => window.cancelAnimationFrame(frameId);
    }, [open, state.releases.length, state.hasMore, state.isLoading, loadMore]);

    const handleScroll = useCallback((event: UIEvent<HTMLDivElement>) => loadMore(event.currentTarget), [loadMore]);

    const selectRelease = useCallback(
        (release: IReleases) => {
            setTag(release.tag);
            setOpen(false);
        },
        [setOpen, setTag]
    );

    return {
        selected,
        releases: state.releases,
        isLoading: state.isLoading,
        listRef,
        handleScroll,
        selectRelease
    };
};
