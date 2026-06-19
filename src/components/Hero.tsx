import { Search } from "lucide-react";

const Hero = () => {
  return (
    <section className="hero-section">
      <div className="hero-badge animate-in fade-in duration-500 animate-slide-right">
        <Search
          className="size-3.5 shrink-0 text-muted-foreground"
          aria-hidden
          strokeWidth={2}
        />
        Powered by GitHub
      </div>
      <div className="animate-slide-left">
        <h1 className="hero-heading">Узнайте о любом пакете</h1>
        <p className="text-gray-400 text-sm">
          Получайте списки изменений, примечания к выпускам и обновления версий
          за считанные секунды.
        </p>
      </div>
    </section>
  );
};

export default Hero;
