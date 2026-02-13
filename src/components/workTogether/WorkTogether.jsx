import { Link } from "react-scroll";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { profile } from "../../data/profile";

const WorkTogether = () => {
  const { workTogether } = profile;
  return (
    <div className="py-25 max-w-169 mx-auto px-2">
      <div className="text-center">
        <p className="text-white md:font-semibold text-2xl sm:text-3xl md:text-5xl pb-8">
          {workTogether.headline}
        </p>
        <p className="text-[#A5ACB5] text-xs sm:text-lg font-normal text-center pb-8">
          {workTogether.subtitle}
        </p>
        <Link
          to="contact"
          smooth
          duration={800}
          className="btn btn-primary px-4 md:px-6.5 py-3 md:py-6 text-[12px] md:text-[16px] btn-section inline-flex items-center gap-2 group"
        >
          Let's work Together
          <FontAwesomeIcon
            icon={faArrowRight}
            size="l"
            className="text-white ms-1 transition-transform duration-200 group-hover:translate-x-0.5"
          />
        </Link>
      </div>
    </div>
  );
};

export default WorkTogether;
