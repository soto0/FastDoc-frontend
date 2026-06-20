// hooks/useSearchParams.ts
import { useCallback, useEffect, useState } from 'react';

/**
 * Simple hook for managing all URL search parameters as a key-value object.
 * Automatically syncs state with URL and handles browser navigation.
 *
 * @returns params - Object containing all current URL parameters
 * @returns updateParams - Function to add/update parameters
 * @returns clearParams - Function to remove all parameters from URL
 *
 * @example
 * const { params, updateParams, clearParams } = useSearchParams();
 *
 * // Read: params.repo, params.owner, etc.
 * // Update: updateParams({ repo: "next.js", owner: "vercel" })
 * // Clear: clearParams()
 */

export const useSearchParams = () => {
    // Initialize state with all current URL parameters
    const [params, setParams] = useState<Record<string, string>>(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const result: Record<string, string> = {};

        // Convert URLSearchParams to plain object
        urlParams.forEach((value, key) => {
            result[key] = value;
        });

        return result;
    });

    /**
     * Merge new parameters with existing ones and update URL.
     * Empty/falsy values are automatically removed from URL.
     */
    const updateParams = useCallback((newParams: Record<string, string>) => {
        setParams((current) => {
            const updated = { ...current, ...newParams };

            const urlParams = new URLSearchParams();
            // Only include truthy values in URL
            Object.entries(updated).forEach(([key, value]) => {
                if (value) urlParams.set(key, value);
            });

            const newUrl = urlParams.toString() ? `?${urlParams.toString()}` : window.location.pathname;

            window.history.pushState({}, '', newUrl);

            return updated;
        });
    }, []);

    /**
     * Clear all parameters from state and URL.
     * Resets URL to just the pathname.
     */
    const clearParams = useCallback(() => {
        setParams({});
        window.history.pushState({}, '', window.location.pathname);
    }, []);

    /**
     * Handle browser back/forward navigation.
     * Re-reads all parameters from the current URL.
     */
    useEffect(() => {
        const handlePopState = () => {
            const urlParams = new URLSearchParams(window.location.search);
            const result: Record<string, string> = {};

            urlParams.forEach((value, key) => {
                result[key] = value;
            });

            setParams(result);
        };

        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, []);

    return { params, updateParams, clearParams };
};
