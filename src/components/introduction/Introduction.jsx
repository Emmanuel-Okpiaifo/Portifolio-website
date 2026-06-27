import profileImage from "../../assets/Emmanuel.jpg";
import Logo from "../common/logo/Logo";
import InformationSummary from "./InformationSummary";
import { profile } from "../../data/profile";

const Introduction = () => {
  const { intro, stats, brand } = profile;

  const bioParts = (() => {
    const [a, rest] = intro.bio.split(intro.bioHighlightTerms[0]);
    const [b, c] = (rest ?? "").split(intro.bioHighlightTerms[1]);
    return { a, b, c };
  })();

  return (
    <div
      className="flex flex-col lg:flex-row gap-10 lg:gap-16 pt-4 sm:pt-8 pb-14 sm:pb-20 md:pt-12 md:pb-28 lg:items-center min-w-0"
      id="introduction"
    >
      {/* Photo first on mobile for a cleaner fold */}
      <div className="w-full lg:w-1/2 order-1 lg:order-2 max-w-sm sm:max-w-md lg:max-w-none mx-auto animate-hero-img min-w-0">
        <div className="relative aspect-[4/5] max-h-[420px] sm:max-h-[480px] lg:max-h-[560px] mx-auto animate-hero-float overflow-hidden rounded-2xl">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-edo-sage/40 to-edo-gold/20 blur-sm scale-105" />
          <img
            className="relative w-full h-full object-cover rounded-2xl border border-edo-sage/30 shadow-2xl"
            src={profileImage}
            alt={intro.headline}
          />
        </div>
      </div>

      <div className="w-full lg:w-1/2 order-2 lg:order-1 flex flex-col text-center lg:text-left lg:pr-4 min-w-0">
        <div className="flex flex-col items-center lg:flex-row lg:items-center gap-3 sm:gap-4 mb-6 sm:mb-8 animate-hero-line animate-hero-line-1">
          <Logo badge glow className="h-14 w-14 sm:h-16 sm:w-16 lg:h-20 lg:w-20 shrink-0" />
          <div className="min-w-0">
            <p className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-edo-gold tracking-wide">
              {brand.monogram}
            </p>
            <p className="brand-title-line text-edo-cream/95 font-medium mt-1 whitespace-nowrap">
              {brand.title}
            </p>
          </div>
        </div>

        <h1 className="font-display text-[1.75rem] leading-tight sm:text-4xl lg:text-5xl xl:text-6xl font-semibold text-edo-cream lg:leading-[1.1]">
          <span className="block animate-hero-line animate-hero-line-2">{intro.greeting}</span>
          <span className="block text-edo-gold animate-hero-line animate-hero-line-3 mt-1">
            {intro.headline}
          </span>
        </h1>

        <p className="text-edo-cream/85 text-sm sm:text-base md:text-lg mt-4 sm:mt-6 max-w-xl mx-auto lg:mx-0 leading-relaxed animate-hero-line animate-hero-line-4 px-1 sm:px-0">
          {bioParts.a}
          <span className="text-edo-gold font-medium">{intro.bioHighlightTerms[0]}</span>
          {bioParts.b}
          <span className="text-edo-gold font-medium">{intro.bioHighlightTerms[1]}</span>
          {bioParts.c}
        </p>

        <div className="mt-6 sm:mt-8 animate-hero-line animate-hero-line-5 w-full min-w-0 max-w-sm mx-auto lg:mx-0 lg:max-w-none">
          <a
            className="btn btn-primary btn-touch btn-md sm:btn-lg px-6 sm:px-8 btn-section w-full sm:w-auto"
            href={`mailto:${intro.ctaEmail}`}
          >
            Say Hello
          </a>
        </div>

        <div className="grid grid-cols-3 gap-2 sm:gap-3 w-full max-w-sm sm:max-w-md mt-8 sm:mt-10 mx-auto lg:mx-0 min-w-0">
          {stats.map((item, i) => (
            <div key={item.id} className={`min-w-0 animate-hero-line animate-hero-line-${6 + i}`}>
              <InformationSummary item={item} dark />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Introduction;
