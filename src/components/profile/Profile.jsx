import { Link } from "react-scroll";
import resumePdf from "../../assets/Emmanuel_Okpiaifo-Resume.pdf";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import SocialMedia from "../common/socialMedia/SocialMedia";
import AnimateOnScroll from "../common/animate/AnimateOnScroll";
import { profile } from "../../data/profile";

const Profile = () => {
  const { about } = profile;

  return (
    <div className="profile-card px-4 sm:px-6 md:px-10 lg:px-16 py-8 sm:py-10 lg:py-14 mb-6 sm:mb-8" id="profile">
      <AnimateOnScroll animation="scale-in" className="max-w-3xl mx-auto text-center">
        <p className="section-eyebrow">About</p>
        <h2 className="font-display text-3xl sm:text-4xl font-semibold text-edo-charcoal mb-6">
          {about.headline}
        </h2>
        <div className="space-y-4 text-stone-600 text-base sm:text-lg leading-relaxed">
          {about.paragraphs.map((p, i) => (
            <AnimateOnScroll key={i} animation="fade-up" delay={i * 80} as="p">
              {p}
            </AnimateOnScroll>
          ))}
        </div>
        <AnimateOnScroll animation="fade-up" delay={280} className="mt-8 flex flex-col sm:flex-row flex-wrap justify-center gap-3 w-full min-w-0 px-1 sm:px-0">
          <Link
            to="portfolio"
            smooth
            duration={800}
            className="btn btn-primary btn-touch px-6 py-3 btn-section w-full sm:w-auto"
          >
            View Projects
          </Link>
          <a
            className="btn bg-white border border-stone-300 hover:border-edo-gold hover:text-edo-gold btn-touch px-6 py-3 btn-section w-full sm:w-auto"
            href={resumePdf}
            target="_blank"
            rel="noopener noreferrer"
            download
          >
            <FontAwesomeIcon icon={faDownload} /> Download CV
          </a>
        </AnimateOnScroll>
        <AnimateOnScroll animation="fade-up" delay={280} className="mt-8 flex justify-center">
          <SocialMedia />
        </AnimateOnScroll>
      </AnimateOnScroll>
    </div>
  );
};

export default Profile;
