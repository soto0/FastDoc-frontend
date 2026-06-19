import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { DARK, LIGHT, STORAGE_KEY } from "@/constants/theme";

type Theme = typeof DARK | typeof LIGHT;

const getInitialTheme = (): Theme => {
  if (typeof document === "undefined") return DARK;

  const savedTheme = localStorage.getItem(STORAGE_KEY);
  if (savedTheme === DARK || savedTheme === LIGHT) return savedTheme;

  return document.documentElement.classList.contains(DARK) ? DARK : LIGHT;
};

const ThemeToggle = () => {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    document.documentElement.classList.toggle(DARK, theme === DARK);
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== STORAGE_KEY || e.newValue == null) return;

      if (e.newValue === DARK || e.newValue === LIGHT) {
        setTheme(e.newValue);
      }
    };

    window.addEventListener("storage", onStorage);

    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className="theme-toggle"
      aria-label={
        theme === DARK ? "Включить светлую тему" : "Включить тёмную тему"
      }
      onClick={() => setTheme((current) => (current === DARK ? LIGHT : DARK))}
    >
      {theme === DARK && <Sun className="theme-toggle-icon" aria-hidden />}
      {theme === LIGHT && <Moon className="theme-toggle-icon" aria-hidden />}
    </Button>
  );
};

export default ThemeToggle;
