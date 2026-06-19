import { Search } from "lucide-react";

const Hero = () => {
  return (
    <section className="hero-section">
      <div className="hero-badge">
        <Search
          className="size-3.5 shrink-0 text-muted-foreground"
          aria-hidden
          strokeWidth={2}
        />
        Powered by npm & GitHub
      </div>
      <h1 className="hero-heading">Узнайте о любом пакете</h1>
      <p className="text-gray-400 text-sm">
        Получайте списки изменений, примечания к выпускам и обновления версий за
        считанные секунды.
      </p>
    </section>
  );
};

export default Hero;
