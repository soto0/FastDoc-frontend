import MainPage from "@/pages/Main";
import Header from "./components/layout/header";

const App = () => {
  return (
    <div className="app-shell">
      <div className="app-container">
        <Header />
        <main className="app-main">
          <MainPage />
        </main>
      </div>
    </div>
  );
};

export default App;
