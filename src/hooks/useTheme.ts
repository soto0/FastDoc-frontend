import { useCallback, useEffect, useState } from 'react';
import { DARK, LIGHT, STORAGE_KEY } from '@/constants/theme';

type Theme = typeof DARK | typeof LIGHT;

const getInitialTheme = (): Theme => {
    if (typeof window === 'undefined') return DARK;

    const savedTheme = localStorage.getItem(STORAGE_KEY);
    if (savedTheme === DARK || savedTheme === LIGHT) return savedTheme;

    return document.documentElement.classList.contains(DARK) ? DARK : LIGHT;
};

export const useTheme = () => {
    const [theme, setThemeState] = useState<Theme>(getInitialTheme);

    useEffect(() => {
        document.documentElement.classList.toggle(DARK, theme === DARK);
        localStorage.setItem(STORAGE_KEY, theme);
    }, [theme]);

    useEffect(() => {
        const onStorage = (e: StorageEvent) => {
            if (e.key !== STORAGE_KEY || e.newValue == null) return;
            if (e.newValue === DARK || e.newValue === LIGHT) {
                setThemeState(e.newValue);
            }
        };

        window.addEventListener('storage', onStorage);
        return () => window.removeEventListener('storage', onStorage);
    }, []);

    const toggleTheme = useCallback((): void => {
        setThemeState((current) => (current === DARK ? LIGHT : DARK));
    }, []);

    const setTheme = useCallback((newTheme: Theme): void => {
        setThemeState(newTheme);
    }, []);

    return {
        theme,
        toggleTheme,
        setTheme,
        isDark: theme === DARK
    };
};
