import type { UIEvent } from "react";
import type { IReleases } from "@/types/IReleases";
import { useCallback, useEffect, useRef, useState } from "react";
import { getReleases } from "@/api/getReleases";

// Distance from the bottom (in pixels) at which the next page starts loading
const BOTTOM_OFFSET = 40;
// Tolerance for overflow checks (needed because browsers sometimes return fractional pixels)
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
  open: boolean; // Flag indicating whether the dropdown/modal is open
  setOpen: (open: boolean) => void;
  setTag: (tag: string | undefined) => void;
}

/**
  Hook that manages a paginated list of releases with infinite scroll.
  Automatically loads the next page when the user scrolls near the bottom
  or when the content doesn't fill the container.
*/
export const useReleases = ({
  repo,
  owner,
  open,
  setOpen,
  setTag,
}: UseReleasesParams) => {
  // Currently selected release (local UI state)
  const [selected, setSelected] = useState<IReleases | null>(null);

  // Main state: list of releases, current page, and loading/pagination flags
  const [state, setState] = useState<ReleasesState>({
    releases: [],
    page: 1,
    hasMore: true,
    isLoading: false,
  });

  // Ref to the scrollable list DOM element (used for measuring scroll position)
  const listRef = useRef<HTMLDivElement>(null);

  /**
    Request the next page.
    Uses the functional form of setState to avoid stale closure issues.
  */
  const loadNextPage = useCallback(() => {
    setState((current) => {
      // Do nothing if there are no more pages or a request is already in flight
      if (!current.hasMore || current.isLoading) return current;

      // Bump the page number and mark as loading
      return { ...current, page: current.page + 1, isLoading: true };
    });
  }, []);

  /**
    Reset state when the repository changes
  */
  useEffect(() => {
    setSelected(null);
    setTag(undefined);
    setState({
      releases: [],
      page: 1,
      hasMore: true,
      isLoading: repo != null && owner != null,
    });
  }, [owner, repo, setTag]);

  /**
    Fetch data from the API
  */
  useEffect(() => {
    // Skip if we don't have the required params or no load is pending
    if (repo == null || owner == null || !state.isLoading) return;

    // Flag to ignore the response if the component unmounts
    // or a newer effect runs before this one finishes (prevents race conditions)
    let ignore = false;

    getReleases({ repo, owner, page: state.page })
      .then(({ releases: batch, hasMore }) => {
        if (ignore) return;

        setState((current) => ({
          // Replace the list on the first page, otherwise append the new batch
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
          // On error: clear the list on the first page, keep existing items otherwise
          releases: state.page === 1 ? [] : current.releases,
          hasMore: false,
          isLoading: false,
        }));
      });

    // Cleanup: mark the request as stale on unmount or before the next effect run
    return () => {
      ignore = true;
    };
  }, [owner, repo, state.isLoading, state.page]);

  /**
    Infinite scroll logic
  */
  const loadMore = useCallback(
    (list: HTMLDivElement) => {
      // Check whether all content fits inside the container (no scrollbar)
      const doesNotOverflow =
        list.scrollHeight <= list.clientHeight + OVERFLOW_TOLERANCE;

      // Check whether the user has scrolled close to the bottom
      const isNearBottom =
        list.scrollTop + list.clientHeight >= list.scrollHeight - BOTTOM_OFFSET;

      // Load more if there's little content OR the user is near the bottom
      if (doesNotOverflow || isNearBottom) loadNextPage();
    },
    [loadNextPage],
  );

  /**
    Auto-load when the list is opened
  */
  useEffect(() => {
    // Only run when the list is open, more pages exist, and we're not already loading
    if (!open || !state.hasMore || state.isLoading) return;

    // Use requestAnimationFrame to wait for the DOM to update after rendering new items.
    // Otherwise scrollHeight / clientHeight may still reflect the previous layout.
    const frameId = window.requestAnimationFrame(() => {
      const list = listRef.current;

      if (list != null) loadMore(list);
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [open, state.releases.length, state.hasMore, state.isLoading, loadMore]);

  // Handler for the native scroll event on the list DOM element
  const handleScroll = useCallback(
    (event: UIEvent<HTMLDivElement>) => loadMore(event.currentTarget),
    [loadMore],
  );

  // Handler for selecting a specific release from the list
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
