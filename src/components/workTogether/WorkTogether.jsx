import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AnimateOnScroll from "../common/animate/AnimateOnScroll";
import { profile } from "../../data/profile";

const WorkTogether = () => {
  const { workTogether } = profile;

  return (
    <div className="section-shell">
      <AnimateOnScroll animation="fade-up" className="content px-4 sm:px-6 text-center max-w-3xl mx-auto">
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold text-edo-cream leading-tight">
          {workTogether.headline}
        </h2>
        <p className="text-edo-cream/70 text-base sm:text-lg mt-6 leading-relaxed">
          {workTogether.subtitle}
        </p>
        <div className="mt-10 flex flex-col sm:flex-row flex-wrap justify-center gap-3">
          <a
            href="#contact"
            className="btn btn-primary btn-touch px-8 py-3 text-base font-semibold btn-section inline-flex items-center justify-center gap-2 group w-[calc(100%-6.5rem)] sm:w-auto mx-auto"
            onClick={(event) => {
              event.preventDefault();
              document.getElementById("contact")?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
          >
            Let&apos;s work together
            <FontAwesomeIcon
              icon={faArrowRight}
              className="transition-transform group-hover:translate-x-1"
            />
          </a>
          <a
            href={`mailto:${profile.email}`}
            className="btn bg-white/10 border border-edo-cream/30 text-edo-cream hover:bg-edo-gold hover:text-edo-charcoal hover:border-edo-gold btn-touch px-8 py-3 w-[calc(100%-6.5rem)] sm:w-auto mx-auto"
          >
            Email me
          </a>
          <a
            href={profile.social.find((item) => item.name === "LinkedIn")?.url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn bg-transparent border border-edo-gold/60 text-edo-gold hover:bg-edo-gold hover:text-edo-charcoal btn-touch px-8 py-3 w-[calc(100%-6.5rem)] sm:w-auto mx-auto"
          >
            LinkedIn
          </a>
        </div>
      </AnimateOnScroll>
    </div>
  );
};

export default WorkTogether;
