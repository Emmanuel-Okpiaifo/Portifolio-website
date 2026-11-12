import { useEffect, useState } from "react";
import AnimateOnScroll from "../common/animate/AnimateOnScroll";
import { profile } from "../../data/profile";

const PARTNER_BASE = "https://ik.imagekit.io/emmzy26/portfolio/partners/";

// Same order as profile.partners.organizations.
// dark: white file when one exists, otherwise the same colour file.
// chip: no white version, so it sits on a light chip in dark mode.
const PARTNER_LOGOS = [
  { file: "nerdzfactory", dark: "nerdzfactory-white", width: 732, height: 244 },
  { file: "google-deepmind", dark: "google-deepmind-white", width: 144, height: 20 },
  { file: "raspberry-pi-foundation", dark: "raspberry-pi-foundation-white", width: 165, height: 50 },
  { file: "meta", chip: true, width: 948, height: 191 },
  { file: "mtn-nigeria", dark: "mtn-nigeria", width: 567, height: 284 },
  { file: "british-council", chip: true, width: 108, height: 31 },
  { file: "kings-trust-international", dark: "kings-trust-international-white", width: 242, height: 60 },
  { file: "mastercard-foundation", dark: "mastercard-foundation-white", width: 381, height: 361 },
  { file: "dot", chip: true, width: 351, height: 75 },
  { file: "giz", dark: "giz", width: 307, height: 80 },
  { pngOnly: "lsetf.png", chip: true, width: 600, height: 189 },
  { file: "undp", dark: "undp", tall: true, width: 238, height: 482 },
];

const svgUrl = (file) => `${PARTNER_BASE}${file}.svg?tr=orig`;
const pngUrl = (file) => `${PARTNER_BASE}${file}.png`;

const useSiteDark = () => {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const root = document.querySelector("[data-theme]");
    if (!root) return undefined;
    const read = () => setDark(root.getAttribute("data-theme") === "dark");
    read();
    const observer = new MutationObserver(read);
    observer.observe(root, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);

  return dark;
};

const PartnerLogo = ({ org, logo, dark }) => {
  const darkFile = dark && logo.dark ? logo.dark : null;
  const file = darkFile || logo.file;
  const primary = logo.pngOnly
    ? `${PARTNER_BASE}${logo.pngOnly}`
    : svgUrl(file);
  const fallback = logo.pngOnly
    ? null
    : darkFile
      ? pngUrl(darkFile)
      : pngUrl(logo.file);

  return (
    <img
      key={primary}
      src={primary}
      alt={`${org} logo`}
      width={logo.width}
      height={logo.height}
      loading="lazy"
      decoding="async"
      draggable="false"
      data-fallback={fallback || ""}
      onError={(event) => {
        const img = event.currentTarget;
        const next = img.dataset.fallback;
        if (next && img.src !== next) img.src = next;
      }}
      className="partner-logo h-12 w-auto max-w-[calc(100vw-3rem)] object-contain sm:h-14 sm:max-w-72"
    />
  );
};

const Partners = () => {
  const { partners } = profile;
  const dark = useSiteDark();

  return (
    <section className="section-shell bg-white border-t border-stone-100" id="partners">
      <div className="content px-4 sm:px-6">
        <AnimateOnScroll animation="fade-up" className="section-header">
          <p className="section-eyebrow">{partners.sectionEyebrow}</p>
          <h2 className="section-title">{partners.sectionTitle}</h2>
        </AnimateOnScroll>
        <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-8 sm:gap-x-12 sm:gap-y-10 max-w-5xl mx-auto list-none p-0">
          {partners.organizations.map((org, index) => {
            const logo = PARTNER_LOGOS[index];
            if (!logo) return null;
            const chip = dark && logo.chip;
            return (
              <AnimateOnScroll
                key={org}
                animation="scale-in"
                delay={index * 60}
                as="li"
                className="partner-item group flex max-w-full flex-col items-center min-w-0"
              >
                <div
                  className={`flex h-12 items-center justify-center sm:h-14 max-w-full ${
                    chip ? "rounded-xl bg-edo-stone px-3" : ""
                  }`}
                >
                  <PartnerLogo org={org} logo={logo} dark={dark} />
                </div>
                <p className="partner-caption mt-2 text-center text-[11px] sm:text-xs leading-snug text-stone-500">
                  {org}
                </p>
              </AnimateOnScroll>
            );
          })}
        </ul>
      </div>
    </section>
  );
};

export default Partners;
