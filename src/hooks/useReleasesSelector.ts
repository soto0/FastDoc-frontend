import type { UIEvent } from "react";
import type { IReleases } from "@/types/IReleases";
import { useCallback, useEffect, useRef, useState } from "react";
import { getReleases } from "@/api/getReleases";

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

export const useReleases = ({
  repo,
  owner,
  open,
  setOpen,
  setTag,
  tag,
}: UseReleasesParams) => {
  const [selected, setSelected] = useState<IReleases | null>(null);

  const [state, setState] = useState<ReleasesState>({
    releases: [],
    page: 1,
    hasMore: true,
    isLoading: false,
  });

  const listRef = useRef<HTMLDivElement>(null);

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
      isLoading: repo != null && owner != null,
    });
  }, [owner, repo]);

  /**
   * If tag comes from URL, create a virtual release object immediately.
   * No need to load pages from API just to find the tag.
   */
  useEffect(() => {
    if (tag != null) {
      // Create a minimal release object with just the tag
      setSelected({ tag } as IReleases);
    } else {
      setSelected(null);
    }
  }, [tag]);

  /**
   * Fetch data from the API
   */
  useEffect(() => {
    if (repo == null || owner == null || !state.isLoading) return;

    let ignore = false;

    getReleases({ repo, owner, page: state.page })
      .then(({ releases: batch, hasMore }) => {
        if (ignore) return;

        setState((current) => ({
          releases: state.page === 1 ? batch : [...current.releases, ...batch],
          page: current.page,
          hasMore,
          isLoading: false,
        }));
      })
      .catch(() => {
        if (ignore) return;

        setState((current) => ({
          ...current,
          releases: state.page === 1 ? [] : current.releases,
          hasMore: false,
          isLoading: false,
        }));
      });

    return () => {
      ignore = true;
    };
  }, [owner, repo, state.isLoading, state.page]);

  /**
   * When releases are loaded, try to find the full release object for the selected tag.
   * This enriches the virtual release with complete data (date, description, etc.)
   */
  useEffect(() => {
    if (tag == null || state.isLoading) return;

    const found = state.releases.find((release) => release.tag === tag);
    if (found) {
      setSelected(found);
    }
  }, [tag, state.releases, state.isLoading]);

  const loadMore = useCallback(
    (list: HTMLDivElement) => {
      const doesNotOverflow =
        list.scrollHeight <= list.clientHeight + OVERFLOW_TOLERANCE;

      const isNearBottom =
        list.scrollTop + list.clientHeight >= list.scrollHeight - BOTTOM_OFFSET;

      if (doesNotOverflow || isNearBottom) loadNextPage();
    },
    [loadNextPage],
  );

  useEffect(() => {
    if (!open || !state.hasMore || state.isLoading) return;

    const frameId = window.requestAnimationFrame(() => {
      const list = listRef.current;
      if (list != null) loadMore(list);
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [open, state.releases.length, state.hasMore, state.isLoading, loadMore]);

  const handleScroll = useCallback(
    (event: UIEvent<HTMLDivElement>) => loadMore(event.currentTarget),
    [loadMore],
  );

  const selectRelease = useCallback(
    (release: IReleases) => {
      setSelected(release);
      setTag(release.tag);
      setOpen(false);
    },
    [setOpen, setTag],
  );

  return {
    selected,
    releases: state.releases,
    isLoading: state.isLoading,
    listRef,
    handleScroll,
    selectRelease,
  };
};
