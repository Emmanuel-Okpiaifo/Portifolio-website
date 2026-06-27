import { Link } from "react-scroll";
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
        <Link
          to="contact"
          smooth
          duration={800}
          className="btn btn-primary btn-touch mt-10 px-8 py-3 text-base font-semibold btn-section inline-flex items-center justify-center gap-2 group w-full sm:w-auto max-w-md sm:max-w-none mx-auto"
        >
          Let&apos;s work together
          <FontAwesomeIcon
            icon={faArrowRight}
            className="transition-transform group-hover:translate-x-1"
          />
        </Link>
      </AnimateOnScroll>
    </div>
  );
};

export default WorkTogether;
