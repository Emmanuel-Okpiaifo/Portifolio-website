import edoLogo from "../../../assets/Logos/edo-logo.png";
import { profile } from "../../../data/profile";

const Loading = () => {
  return (
    <div
      className="flex flex-col justify-center items-center fixed inset-0 bg-edo-charcoal z-50"
      role="status"
      aria-label="Loading"
    >
      <div className="relative flex items-center justify-center w-24 h-24 sm:w-28 sm:h-28">
        <div className="absolute inset-0 rounded-full border-2 border-edo-sage/30 border-t-edo-gold animate-loader-spin" />
        <div className="absolute inset-2 rounded-full border border-edo-gold/20 animate-loader-spin-reverse" />
        <img
          src={edoLogo}
          alt={profile.brand?.monogram ?? "EDO"}
          className="relative w-16 h-16 sm:w-[4.5rem] sm:h-[4.5rem] object-contain brightness-0 invert opacity-90 animate-loader-pulse"
        />
      </div>
      <p className="mt-6 font-display text-edo-cream/80 text-sm tracking-[0.25em] uppercase animate-loader-fade">
        {profile.brand?.monogram ?? "EDO"}
      </p>
    </div>
  );
};

export default Loading;
