import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useSearchParams } from '@/hooks/useSearchParams';

describe('useSearchParams', () => {
    it('reads initial params from the URL', () => {
        window.history.pushState({}, '', '/?repo=next.js&owner=vercel');

        const { result } = renderHook(() => useSearchParams());

        expect(result.current.params).toEqual({
            repo: 'next.js',
            owner: 'vercel'
        });
    });

    it('updates params and writes them to the URL', () => {
        const pushStateSpy = vi.spyOn(window.history, 'pushState');
        const { result } = renderHook(() => useSearchParams());

        act(() => {
            result.current.updateParams({ repo: 'react', owner: 'facebook' });
        });

        expect(result.current.params).toEqual({
            repo: 'react',
            owner: 'facebook'
        });
        expect(pushStateSpy).toHaveBeenCalledWith({}, '', '?repo=react&owner=facebook');
    });

    it('removes falsy values from the URL', () => {
        const { result } = renderHook(() => useSearchParams());

        act(() => {
            result.current.updateParams({ repo: 'next.js', owner: 'vercel', tag: '' });
        });

        expect(result.current.params.tag).toBe('');
        expect(window.location.search).toBe('?repo=next.js&owner=vercel');
    });

    it('clears all params from state and URL', () => {
        window.history.pushState({}, '', '/?repo=next.js&owner=vercel');
        const { result } = renderHook(() => useSearchParams());

        act(() => {
            result.current.clearParams();
        });

        expect(result.current.params).toEqual({});
        expect(window.location.pathname + window.location.search).toBe('/');
    });

    it('syncs state on browser popstate navigation', () => {
        window.history.pushState({}, '', '/?repo=vue');
        const { result } = renderHook(() => useSearchParams());

        act(() => {
            window.history.pushState({}, '', '/?repo=react&owner=facebook');
            window.dispatchEvent(new PopStateEvent('popstate'));
        });

        expect(result.current.params).toEqual({
            repo: 'react',
            owner: 'facebook'
        });
    });
});
