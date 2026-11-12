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

const imageKitSrc = (url, width) => `${url}?tr=w-${width}`;

const Projects = ({ data }) => {
  const [imageFailed, setImageFailed] = useState(false);
  const preview = data?.preview ?? {};
  const remoteImage = data?.imageUrl || "";
  const showImage = (remoteImage || data?.image) && !imageFailed;
  const host = preview.host || getHostname(data?.link);
  const imageAlt = data?.imageAlt || `${data?.title} preview`;
  const imageWidth = data?.imageWidth || 1600;
  const imageHeight = data?.imageHeight || 1000;

  return (
    <article className="group flex flex-col rounded-2xl bg-white border border-stone-200/80 overflow-hidden shadow-sm hover:shadow-xl hover:border-edo-gold/30 hover:-translate-y-1 transition-all duration-300">
      <div
        className="relative aspect-[16/10] overflow-hidden"
        style={{
          background: `linear-gradient(145deg, ${preview.from ?? "#1c1c1c"}, ${preview.to ?? "#3d3d3d"})`,
        }}
      >
        {showImage ? (
          <img
            src={remoteImage ? imageKitSrc(remoteImage, 800) : data.image}
            srcSet={
              remoteImage
                ? [400, 800, 1400].map((width) => `${imageKitSrc(remoteImage, width)} ${width}w`).join(", ")
                : undefined
            }
            sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
            alt={imageAlt}
            width={remoteImage ? imageWidth : 1600}
            height={remoteImage ? imageHeight : 1000}
            loading="lazy"
            decoding="async"
            className={`absolute inset-0 h-full w-full transition-transform duration-300 group-hover:scale-[1.03] ${
              !remoteImage && preview.fit === "contain" ? "object-contain p-6" : "object-cover object-top"
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

      <div className="flex flex-col p-5 sm:p-6">
        <p className="text-edo-gold-ink text-xs font-semibold uppercase tracking-wider break-words">
          {data?.category}
        </p>
        <h3 className="font-display text-xl font-semibold text-edo-charcoal pt-2 mb-3 break-words">
          {data?.title}
        </h3>
        <div className="text-stone-600 text-sm leading-relaxed space-y-2">
          <p><span className="font-semibold text-edo-charcoal">What I built. </span>{data?.built}</p>
          <p><span className="font-semibold text-edo-charcoal">Result. </span>{data?.result}</p>
        </div>
        {data?.link ? (
          <div className="mt-5">
            <a
              href={data.link}
              target="_blank"
              rel="noopener noreferrer"
              className="btn bg-edo-charcoal text-edo-cream hover:bg-edo-gold hover:text-edo-charcoal border-0 text-sm font-semibold gap-2 w-full sm:w-fit"
            >
              View Project
              <FontAwesomeIcon icon={faArrowRight} className="text-sm" />
            </a>
          </div>
        ) : null}
      </div>
    </article>
  );
};

export default Projects;
