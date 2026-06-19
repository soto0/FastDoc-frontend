import ThemeToggle from "@/components/layout/header/ThemeToggle";

const Header = () => {
  return (
    <header className="header">
      <div className="header-row">
        <div className="header-content">
          <p className="header-title">FastDoc</p>
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
};

export default Header;
