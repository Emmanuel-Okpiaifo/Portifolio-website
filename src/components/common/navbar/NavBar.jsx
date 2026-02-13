import { useEffect, useState } from "react";
import { Link } from "react-scroll";
import { profile } from "../../../data/profile";
import Logo from "../logo/Logo";

const navItems = [
  { id: 1, name: "Home", url: "introduction" },
  { id: 2, name: "About", url: "profile" },
  { id: 3, name: "Process", url: "work-process" },
  { id: 4, name: "Portfolio", url: "portfolio" },
  { id: 5, name: "Services", url: "services" },
];

const handleMenuClick = (closeMenu) => {
  if (document.activeElement instanceof HTMLElement) {
    document.activeElement.blur();
  }
  closeMenu?.();
};

const NavBar = () => {
  const [position, setPosition] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setPosition(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const menu = navItems.map((item) => (
    <li key={item.id} onMouseDown={(e) => e.preventDefault()}>
      <Link
        onClick={() => handleMenuClick(setMenuOpen)}
        to={item.url.toLowerCase()}
        smooth={true}
        duration={800}
        spy={true}
        offset={-140}
        activeStyle={{
          backgroundColor: "#9929fb",
          color: "white",
        }}
        className="hover:text-picto-primary px-5 py-3 mx-1 transition-colors duration-200"
      >
        {item.name}
      </Link>
    </li>
  ));

  return (
    <div
      className={`sticky top-0 ${
        position > 50
          ? "bg-soft-white border-b border-gray-300"
          : "bg-white border-white"
      } z-50 transition-all duration-300`}
    >
      <div className="navbar flex justify-between mx-auto content min-h-16 py-2">
        <div className="flex items-center justify-between gap-2 min-h-12">
          {/* Animated hamburger – mobile only */}
          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            className="btn btn-ghost btn-sm lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <div className="w-6 h-5 flex flex-col justify-between items-center">
              <span
                className={`block h-0.5 w-full bg-slate-700 rounded-full origin-center transition-all duration-300 ease-out ${
                  menuOpen ? "rotate-45 translate-y-[5px]" : ""
                }`}
              />
              <span
                className={`block h-0.5 w-full bg-slate-700 rounded-full transition-all duration-200 ${
                  menuOpen ? "opacity-0 scale-x-0" : "opacity-100"
                }`}
              />
              <span
                className={`block h-0.5 w-full bg-slate-700 rounded-full origin-center transition-all duration-300 ease-out ${
                  menuOpen ? "-rotate-45 -translate-y-[5px]" : ""
                }`}
              />
            </div>
          </button>

          {/* Mobile menu panel */}
          {menuOpen && (
            <div
              className="fixed inset-0 top-[57px] lg:hidden z-40 bg-white/95 backdrop-blur-sm"
              aria-hidden={!menuOpen}
            >
              <ul className="animate-menu-in p-4 flex flex-col gap-1 font-semibold text-slate-800">
                {menu}
                <li className="pt-4">
                  <Link
                    to="contact"
                    smooth
                    duration={800}
                    onClick={() => handleMenuClick(setMenuOpen)}
                    className="btn btn-primary btn-block btn-section"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
          )}

          <Link
            href="#introduction"
            to="introduction"
            smooth={true}
            duration={800}
            className="flex items-center gap-3 border-0 lg:max-xxl:ps-5 min-w-0"
          >
            <Logo
              variant="transparent"
              className="h-12 w-auto max-h-14 sm:h-14 sm:max-h-16 object-contain object-left shrink-0"
            />
            <span className="text-xl sm:text-2xl font-semibold text-slate-800 truncate">
              {profile.shortName}
            </span>
          </Link>
        </div>

        <div className="lg:flex items-center">
          <ul className="hidden lg:flex menu menu-horizontal text-[16px] font-medium md:shrink-0">
            {menu}
          </ul>
          <Link
            to="contact"
            smooth
            duration={800}
            className="btn btn-sm xs:btn-md sm:btn-lg btn-primary btn-section hidden lg:inline-flex"
          >
            Contact
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
