import { useEffect, useState } from "react";
import { faAngleUp } from "@fortawesome/free-solid-svg-icons";
import { animateScroll } from "react-scroll";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const options = { duration: 500, smooth: true };

const ScrollToTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <button
      type="button"
      aria-label="Scroll to top"
      onClick={() => animateScroll.scrollToTop(options)}
      className={`fixed bottom-5 right-4 sm:bottom-8 sm:right-6 z-50 w-11 h-11 sm:w-12 sm:h-12 flex justify-center items-center rounded-full bg-edo-gold text-edo-charcoal shadow-lg hover:bg-edo-gold-dark hover:scale-110 transition-all duration-300 mb-[env(safe-area-inset-bottom)] mr-[env(safe-area-inset-right)] ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      <FontAwesomeIcon icon={faAngleUp} />
    </button>
  );
};

export default ScrollToTop;
