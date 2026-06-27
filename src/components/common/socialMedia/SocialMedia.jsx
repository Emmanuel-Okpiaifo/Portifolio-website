import { useState, useRef, useEffect } from "react";
import { faLinkedin, faGithub, faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope, faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { profile } from "../../../data/profile";

const socialLinks = [
  {
    name: "GitHub",
    url: profile.social.find((s) => s.icon === "github")?.url,
    icon: faGithub,
  },
  {
    name: "LinkedIn",
    url: profile.social.find((s) => s.icon === "linkedin")?.url,
    icon: faLinkedin,
  },
  {
    name: "WhatsApp",
    url: profile.whatsappUrl,
    icon: faWhatsapp,
  },
  {
    name: "Email",
    url: `mailto:${profile.email}`,
    icon: faEnvelope,
  },
].filter((item) => item.url);

const SocialMedia = ({ className = "", variant = "light", menuAlign = "right", fullWidth = false }) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const triggerClass =
    variant === "dark"
      ? "bg-edo-cream/10 text-edo-cream hover:bg-edo-gold hover:text-edo-charcoal border-edo-cream/20"
      : "bg-edo-charcoal text-edo-cream hover:bg-edo-gold hover:text-edo-charcoal border-edo-charcoal/10";

  return (
    <div ref={menuRef} className={`relative ${fullWidth ? "w-full" : ""} ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="true"
        aria-label={open ? "Close social links" : "Open social links"}
        className={`inline-flex items-center justify-center gap-2 border px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors duration-200 ${fullWidth ? "w-full min-h-12" : ""} ${triggerClass}`}
      >
        Connect
        <FontAwesomeIcon
          icon={open ? faChevronUp : faChevronDown}
          className="text-xs"
        />
      </button>

      {open && (
        <div
          className={`absolute ${menuAlign === "left" ? "left-0 right-auto" : "right-0 left-auto"} mt-2 min-w-44 max-w-[calc(100vw-2rem)] z-50 flex flex-col gap-1 p-1.5 bg-white rounded-xl shadow-xl border border-stone-200 animate-menu-in`}
        >
          {socialLinks.map((item) => (
            <a
              key={item.name}
              href={item.url}
              target={item.name === "Email" ? undefined : "_blank"}
              rel={item.name === "Email" ? undefined : "noopener noreferrer"}
              onClick={() => setOpen(false)}
              className="inline-flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-edo-charcoal hover:bg-edo-stone transition-colors"
            >
              <FontAwesomeIcon
                icon={item.icon}
                className={`w-4 ${item.name === "WhatsApp" ? "text-[#25D366]" : "text-edo-gold"}`}
              />
              {item.name}
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default SocialMedia;
