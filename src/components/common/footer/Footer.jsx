import { Link } from "react-router-dom";
import { profile } from "../../../data/profile";
import Logo from "../logo/Logo";
import SocialMedia from "../socialMedia/SocialMedia";

const navItems = [
  { id: 1, name: "Home", url: "introduction" },
  { id: 2, name: "About", url: "profile" },
  { id: 3, name: "Experience", url: "experience" },
  { id: 4, name: "Portfolio", url: "portfolio" },
  { id: 5, name: "Contact", url: "contact" },
];

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-edo-charcoal text-edo-cream">
      <div className="content px-4 sm:px-6 pt-16 pb-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 sm:gap-8 text-center md:text-left">
          <Link to="/#introduction" className="flex items-center gap-3 sm:gap-3.5 max-w-full">
            <Logo badge className="h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 shrink-0" />
            <span className="flex flex-col leading-tight text-left min-w-0">
              <span className="font-display text-base sm:text-lg md:text-xl font-bold text-edo-gold tracking-wide">
                {profile.brand.monogram}
              </span>
              <span className="text-edo-cream/70 text-[0.65rem] xs:text-xs sm:text-sm font-medium line-clamp-2 sm:line-clamp-none">
                {profile.brand.title}
              </span>
            </span>
          </Link>

          <nav className="flex flex-wrap justify-center gap-x-5 gap-y-2">
            {navItems.map((item) => (
              <Link
                key={item.id}
                to={`/#${item.url}`}
                className="text-sm text-edo-cream/70 hover:text-edo-gold transition-colors"
              >
                {item.name}
              </Link>
            ))}
            <Link
              to="/leave-a-testimonial"
              className="text-sm text-edo-cream/70 hover:text-edo-gold transition-colors"
            >
              Leave a testimonial
            </Link>
          </nav>

          <SocialMedia variant="dark" />
        </div>

        <p className="text-center text-edo-cream/50 text-sm mt-12">
          &copy; {year} {profile.name}. {profile.footer.credit}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
