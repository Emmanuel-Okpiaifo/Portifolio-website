/**
 * Emmanuel Okpiaifo logo – uses assets from logos folder.
 * variant: "default" (full color) | "transparent" | "grayscale" | "grayscaleTransparent"
 */
import logoFull from "../../../assets/Logos/emmanuel-okpiaifo-high-resolution-logo.png";
import logoTransparent from "../../../assets/Logos/emmanuel-okpiaifo-high-resolution-logo-transparent.png";
import logoGrayscale from "../../../assets/Logos/emmanuel-okpiaifo-high-resolution-logo-grayscale.png";
import logoGrayscaleTransparent from "../../../assets/Logos/emmanuel-okpiaifo-high-resolution-logo-grayscale-transparent.png";

const variants = {
  default: logoFull,
  transparent: logoTransparent,
  grayscale: logoGrayscale,
  grayscaleTransparent: logoGrayscaleTransparent,
};

const Logo = ({ variant = "default", className = "h-8 w-8 sm:h-10 sm:w-10", alt = "Emmanuel Okpiaifo", ...props }) => {
  const src = variants[variant] ?? variants.default;
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading="eager"
      {...props}
    />
  );
};

export default Logo;
