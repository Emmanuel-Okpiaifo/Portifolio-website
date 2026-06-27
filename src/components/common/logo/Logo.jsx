import edoLogo from "../../../assets/Logos/edo-logo.png";
import { profile } from "../../../data/profile";

/**
 * Transparent crest — optional sage badge keeps it identical on every background.
 * badge: fixed tile + gold ring (navbar, hero, footer)
 * glow: subtle pulse so the mark draws the eye without changing on scroll
 */
const Logo = ({
  variant = "onLight",
  badge = false,
  glow = false,
  className = "h-12 w-12 sm:h-14 sm:w-14",
  alt = profile.brand?.displayName ?? "EDO — The Emmanuel Daniel Okpiaifo",
  ...props
}) => {
  const imgClass = badge
    ? "h-[88%] w-[88%] object-contain"
    : `object-contain shrink-0 ${
        variant === "onDark" ? "brightness-0 invert opacity-95" : ""
      } ${className}`;

  const img = (
    <img
      src={edoLogo}
      alt={alt}
      className={imgClass}
      loading="eager"
      {...props}
    />
  );

  if (badge) {
    return (
      <span
        className={`logo-badge inline-flex shrink-0 items-center justify-center ${
          glow ? "logo-badge-glow" : ""
        } ${className}`}
        aria-hidden={alt ? undefined : true}
      >
        {img}
      </span>
    );
  }

  return img;
};

export default Logo;
