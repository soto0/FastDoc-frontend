import { Toaster } from "sonner";
import MainPage from "@/pages/Main";
import Header from "./components/layout/header";
import { useThemeContext } from "./components/providers/ThemeProvider";

const App = () => {
  const { theme } = useThemeContext();

  return (
    <div className="app-shell">
      <div className="app-container">
        <Header />
        <main className="app-main">
          <MainPage />
        </main>
      </div>
      <Toaster position="top-center" theme={theme} />
    </div>
  );
};

export default App;
