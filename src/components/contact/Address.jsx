import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { useState } from "react";
import { profile } from "../../data/profile";

const Address = ({ item }) => {
  const [hover, setHover] = useState(false);
  const isPhone = item?.whatsapp;

  const content = (
  <>
      <div
        className={`h-10 md:h-12 aspect-square shrink-0 ${
          hover ? "bg-edo-gold" : "bg-edo-sage/50"
        } center rounded-lg transition-colors duration-300`}
      >
        <FontAwesomeIcon
          icon={item?.icon}
          className={`text-lg md:text-xl ${hover ? "text-edo-charcoal" : "text-edo-gold"}`}
        />
      </div>
      <div className="ms-3 min-w-0 flex-1">
        <p className="text-xs md:text-sm text-stone-500 font-normal">{item?.title}</p>
        <p className="text-sm md:text-base text-edo-charcoal font-medium break-words">
          {item?.description}
        </p>
        {isPhone && (
          <a
            href={profile.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center justify-center gap-2 mt-2 w-full sm:w-auto px-3 py-2.5 rounded-lg bg-[#25D366] text-white text-sm font-semibold hover:bg-[#1ebe57] transition-colors"
          >
            <FontAwesomeIcon icon={faWhatsapp} />
            Chat on WhatsApp
          </a>
        )}
      </div>
    </>
  );

  const cardClass =
    "max-w-full p-4 md:p-5 flex rounded-xl bg-edo-stone/80 border border-stone-200/80 hover:border-edo-gold/40 hover:shadow-md transition-all duration-300";

  if (item?.href) {
    return (
      <a
        href={item.href}
        className={`${cardClass} no-underline text-inherit`}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        {content}
      </a>
    );
  }

  return (
    <div
      className={cardClass}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {content}
    </div>
  );
};

export default Address;
