import { useState } from "react";
import { faArrowRight, faGlobe } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const getHostname = (url) => {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
};

const Projects = ({ data }) => {
  const [imageFailed, setImageFailed] = useState(false);
  const preview = data?.preview ?? {};
  const showImage = data?.image && !imageFailed;
  const host = preview.host || getHostname(data?.link);

  return (
    <article className="group flex flex-col h-full rounded-2xl bg-white border border-stone-200/80 overflow-hidden shadow-sm hover:shadow-xl hover:border-edo-gold/30 hover:-translate-y-1 transition-all duration-300">
      <div
        className="relative h-48 sm:h-52 overflow-hidden"
        style={{
          background: `linear-gradient(145deg, ${preview.from ?? "#1c1c1c"}, ${preview.to ?? "#3d3d3d"})`,
        }}
      >
        {showImage ? (
          <img
            src={data.image}
            alt={`${data?.title} preview`}
            className={`absolute inset-0 w-full h-full ${
              preview.fit === "contain" ? "object-contain p-6" : "object-cover object-top"
            }`}
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 text-edo-cream">
            <FontAwesomeIcon icon={faGlobe} className="text-edo-gold/80 text-2xl mb-3" />
            <p className="font-display text-xl sm:text-2xl font-semibold leading-tight">
              {data?.title}
            </p>
            {host && (
              <p className="mt-2 text-xs sm:text-sm text-edo-cream/70 tracking-wide">
                {host}
              </p>
            )}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <div className="flex flex-col flex-1 p-5 sm:p-6">
        <p className="text-edo-gold text-xs font-semibold uppercase tracking-wider">
          {data?.category}
        </p>
        <h3 className="font-display text-xl font-semibold text-edo-charcoal pt-2 mb-3">
          {data?.title}
        </h3>
        <p className="text-stone-600 text-sm leading-relaxed flex-1">
          {data?.description}
        </p>
        <a
          href={data?.link}
          target="_blank"
          rel="noopener noreferrer"
          className="btn mt-5 bg-edo-charcoal text-edo-cream hover:bg-edo-gold hover:text-edo-charcoal border-0 text-sm font-semibold gap-2 w-full sm:w-fit"
        >
          View Project
          <FontAwesomeIcon icon={faArrowRight} className="text-sm" />
        </a>
      </div>
    </article>
  );
};

export default Projects;
