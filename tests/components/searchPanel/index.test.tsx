import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import SearchPanel from '@/components/searchPanel';

const { getChangelogMock } = vi.hoisted(() => ({
    getChangelogMock: vi.fn()
}));

vi.mock('@/api/getChangelog', () => ({
    getChangelog: getChangelogMock
}));

describe('searchPanel', () => {
    beforeEach(() => {
        getChangelogMock.mockReset();
        window.history.pushState({}, '', '/');
    });

    it('shows empty state when no changelog is loaded', () => {
        render(<SearchPanel />);

        expect(screen.getByText('Пока ничего не искали')).toBeInTheDocument();
    });

    it('loads changelog from URL params on mount', async () => {
        window.history.pushState({}, '', '/?repo=next.js&owner=vercel&tag=v14.0.0');
        getChangelogMock.mockResolvedValue({ changelog: '## Bug Fixes' });

        render(<SearchPanel />);

        await waitFor(() => {
            expect(getChangelogMock).toHaveBeenCalledWith({
                repo: 'next.js',
                owner: 'vercel',
                tag: 'v14.0.0'
            });
        });

        expect(await screen.findByText('Bug Fixes')).toBeInTheDocument();
    });

    it('disables submit until repository and tag are selected', () => {
        render(<SearchPanel />);

        expect(screen.getByRole('button', { name: /поиск/i })).toBeDisabled();
    });

    it('updates URL params on submit when selections are present', async () => {
        const pushStateSpy = vi.spyOn(window.history, 'pushState');
        window.history.pushState({}, '', '/?repo=next.js&owner=vercel&tag=v14.0.0');
        getChangelogMock.mockResolvedValue({ changelog: 'ready' });

        const user = userEvent.setup();
        render(<SearchPanel />);

        await waitFor(() => {
            expect(getChangelogMock).toHaveBeenCalled();
        });

        pushStateSpy.mockClear();
        await user.click(screen.getByRole('button', { name: /поиск/i }));

        expect(pushStateSpy).toHaveBeenCalledWith({}, '', '?repo=next.js&owner=vercel&tag=v14.0.0');
    });
});
