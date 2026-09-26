import { useEffect, useState, useCallback } from "react";
import { Link as ScrollLink } from "react-scroll";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { profile } from "../../../data/profile";
import Logo from "../logo/Logo";
import SocialMedia from "../socialMedia/SocialMedia";

const navItems = [
  { id: 1, name: "Home", url: "introduction" },
  { id: 2, name: "About", url: "profile" },
  { id: 3, name: "Experience", url: "experience" },
  { id: 4, name: "Portfolio", url: "portfolio" },
  { id: 5, name: "Skills", url: "skills" },
  { id: 6, name: "Services", url: "services" },
  { id: 7, name: "Testimonials", url: "testimonials" },
];

const SectionLink = ({ to, className, onClick, children, spy = false }) => {
  const { pathname } = useLocation();

  if (pathname === "/") {
    return (
      <ScrollLink
        to={to}
        smooth
        duration={800}
        spy={spy}
        offset={-72}
        activeClass={spy ? "!text-edo-gold" : undefined}
        className={className}
        onClick={onClick}
      >
        {children}
      </ScrollLink>
    );
  }

  return (
    <RouterLink to={`/#${to}`} className={className} onClick={onClick}>
      {children}
    </RouterLink>
  );
};

const MENU_ANIM_MS = 280;

const NavBar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuState, setMenuState] = useState("closed");

  const { pathname } = useLocation();
  const menuOpen = menuState === "open";
  const menuClosing = menuState === "closing";
  const menuVisible = menuOpen || menuClosing;
  const solidBar = scrolled || menuVisible || pathname !== "/";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuVisible ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuVisible]);

  const closeMenu = useCallback(() => {
    setMenuState((current) => {
      if (current === "open") return "closing";
      return current;
    });
  }, []);

  const openMenu = useCallback(() => {
    setMenuState("open");
  }, []);

  const toggleMenu = useCallback(() => {
    if (menuState === "open") closeMenu();
    else if (menuState === "closed") openMenu();
  }, [menuState, closeMenu, openMenu]);

  useEffect(() => {
    if (menuState !== "closing") return undefined;
    const timer = window.setTimeout(() => setMenuState("closed"), MENU_ANIM_MS);
    return () => window.clearTimeout(timer);
  }, [menuState]);

  const handleNavClick = () => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    closeMenu();
  };

  return (
    <header
      className={`sticky top-0 z-50 animate-nav-in transition-all duration-300 ${
        solidBar
          ? "bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="navbar content w-full min-w-0 min-h-16 py-2 px-4 sm:px-6 flex justify-between items-center gap-3">
        <SectionLink
          to="introduction"
          className="group flex items-center gap-2 sm:gap-2.5 min-w-0 animate-nav-brand"
        >
          <Logo badge glow className="h-9 w-9 xs:h-10 xs:w-10 sm:h-11 sm:w-11 shrink-0" />
          <span className="flex flex-col min-w-0 leading-tight">
            <span className="font-display text-sm xs:text-base sm:text-lg font-bold text-edo-gold tracking-wide">
              {profile.brand.monogram}
            </span>
            <span className="hidden lg:block whitespace-nowrap text-sm font-semibold text-edo-charcoal">
              {profile.brand.title}
            </span>
          </span>
        </SectionLink>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <ul className="hidden lg:flex items-center">
            {navItems.map((item) => (
              <li key={item.id} onMouseDown={(e) => e.preventDefault()}>
                <SectionLink
                  to={item.url}
                  spy
                  className="text-stone-600 hover:text-edo-charcoal px-3 py-2 text-sm font-medium transition-colors"
                >
                  {item.name}
                </SectionLink>
              </li>
            ))}
          </ul>
          <div className="hidden lg:block">
            <SocialMedia />
          </div>
          <SectionLink
            to="contact"
            className="btn btn-primary btn-sm sm:btn-md hidden sm:inline-flex"
          >
            Contact
          </SectionLink>
          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            className="btn btn-ghost btn-sm lg:hidden p-2 shrink-0"
            onClick={toggleMenu}
          >
            <div className="w-6 h-5 flex flex-col justify-between">
              <span
                className={`block h-0.5 w-full rounded origin-center transition-all duration-300 ease-in-out ${
                  solidBar ? "bg-edo-charcoal" : "bg-edo-cream"
                } ${menuOpen ? "rotate-45 translate-y-[9px]" : ""}`}
              />
              <span
                className={`block h-0.5 w-full rounded origin-center transition-all duration-300 ease-in-out ${
                  solidBar ? "bg-edo-charcoal" : "bg-edo-cream"
                } ${menuOpen ? "opacity-0 scale-x-0" : "opacity-100 scale-x-100"}`}
              />
              <span
                className={`block h-0.5 w-full rounded origin-center transition-all duration-300 ease-in-out ${
                  solidBar ? "bg-edo-charcoal" : "bg-edo-cream"
                } ${menuOpen ? "-rotate-45 -translate-y-[9px]" : ""}`}
              />
            </div>
          </button>
        </div>
      </div>

      {menuVisible && (
        <div
          className={`lg:hidden fixed inset-x-0 top-16 z-40 h-[calc(100dvh-4rem)] overflow-y-auto overscroll-contain bg-white/98 backdrop-blur-sm pb-[max(2rem,env(safe-area-inset-bottom))] ${
            menuClosing ? "animate-mobile-menu-panel-out" : "animate-mobile-menu-panel"
          }`}
        >
          <ul className="p-4 sm:p-6 flex flex-col gap-0.5">
            {navItems.map((item, index) => (
              <li
                key={item.id}
                className={menuClosing ? "animate-mobile-nav-item-out" : "animate-mobile-nav-item opacity-0"}
                style={
                  menuClosing
                    ? { animationDelay: `${index * 35}ms` }
                    : { animationDelay: `${80 + index * 55}ms` }
                }
                onMouseDown={(e) => e.preventDefault()}
              >
                <SectionLink
                  onClick={handleNavClick}
                  to={item.url}
                  spy
                  className="text-stone-700 hover:text-edo-charcoal px-3 py-3.5 text-base font-medium transition-colors block rounded-lg hover:bg-edo-stone/80"
                >
                  {item.name}
                </SectionLink>
              </li>
            ))}
          </ul>
          <div
            className={`px-4 sm:px-6 pb-6 flex flex-col gap-4 items-stretch ${
              menuClosing ? "animate-mobile-nav-item-out" : "animate-mobile-nav-item opacity-0"
            }`}
            style={
              menuClosing
                ? { animationDelay: `${navItems.length * 35}ms` }
                : { animationDelay: `${80 + navItems.length * 55}ms` }
            }
          >
            <SocialMedia menuAlign="left" fullWidth />
            <SectionLink
              to="contact"
              onClick={handleNavClick}
              className="btn btn-primary btn-touch w-full"
            >
              Contact
            </SectionLink>
          </div>
        </div>
      )}
    </header>
  );
};

export default NavBar;
