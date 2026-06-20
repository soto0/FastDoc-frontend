import type { ReactNode } from "react";
import type { DARK, LIGHT } from "@/constants/theme";
import { createContext, useContext } from "react";
import { useTheme } from "@/hooks/useTheme";

type Theme = typeof DARK | typeof LIGHT;

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const { theme, toggleTheme, setTheme, isDark } = useTheme();

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context == null) {
    throw new Error("useThemeContext must be used within a ThemeProvider");
  }
  return context;
};
