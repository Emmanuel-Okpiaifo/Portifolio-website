import profileImage from "../../assets/Emmanuel.jpg";
import "./introduction.css";
import InformationSummary from "./InformationSummary";
import { profile } from "../../data/profile";

const Introduction = () => {
  const { intro, stats } = profile;
  return (
    <div
      className="flex max-lg:flex-col-reverse sm:justify-between pt-10 lg:pt-12 lg:mb-27.5 max-xl:gap-2 p-2 max-xxl:px-4"
      id="introduction"
    >
      <div className="w-full flex flex-col justify-between max-lg:text-center">
        <div className="pt-13 me-31.5 w-full lg:w-auto transition-all duration-500">
          <p className="text-3xl xxs:text-4xl sm:max-xl:text-5xl xl:text-6xl font-semibold w-full">
            <span className="animate-hero-line animate-hero-line-1 inline-block">{intro.greeting}</span>
            <span className="text-nowrap shrink-0 inline-block w-full animate-hero-line animate-hero-line-2">
              {intro.headline}
            </span>
          </p>
          <p className="text-xs xxs:text-lg lg:text-[18px] my-6 animate-hero-line animate-hero-line-3">
            {intro.bio.split(intro.bioHighlightTerms[0])[0]}
            <span className="bg-highlight">{intro.bioHighlightTerms[0]}</span>
            {intro.bio.split(intro.bioHighlightTerms[0])[1]?.split(intro.bioHighlightTerms[1])[0]}
            <span className="bg-highlight">{intro.bioHighlightTerms[1]}</span>
            {intro.bio.split(intro.bioHighlightTerms[0])[1]?.split(intro.bioHighlightTerms[1])[1]}
          </p>
          <p className="text-center lg:text-start animate-hero-line animate-hero-line-4">
            <a
              className="btn-primary btn btn-xs xxs:btn-lg text-white btn-section"
              href={`mailto:${intro.ctaEmail}`}
            >
              Say Hello!
            </a>
          </p>
        </div>
        <div className="mx-auto lg:mx-0 relative">
          <div className="grid max-xxs:grid-flow-col grid-cols-3 w-fit mt-10 gap-1">
            {stats.map((item, i) => (
              <div key={item.id} className={`animate-hero-line animate-hero-line-${5 + i}`}>
                <InformationSummary item={item} />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div
        className={`max-w-134 w-full h-full max-lg:mx-auto aspect-[536/636] relative`}
      >
        <img
          className={`shadow-2xl shadow-gray-200 w-full h-full absolute bottom-0 object-cover bg-white rounded-3xl animate-hero-img`}
          src={profileImage}
          alt={intro.headline}
        />
      </div>
    </div>
  );
};

export default Introduction;
