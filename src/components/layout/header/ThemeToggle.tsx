import { Moon, Sun } from "lucide-react";
import { useThemeContext } from "@/components/providers/ThemeProvider";
import { Button } from "@/components/ui/button";

const ThemeToggle = () => {
  const { toggleTheme, isDark } = useThemeContext();

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className="theme-toggle"
      aria-label={isDark ? "Включить светлую тему" : "Включить тёмную тему"}
      onClick={toggleTheme}
    >
      {isDark && <Sun className="theme-toggle-icon" aria-hidden />}
      {!isDark && <Moon className="theme-toggle-icon" aria-hidden />}
    </Button>
  );
};

export default ThemeToggle;
