import AnimateOnScroll from "../common/animate/AnimateOnScroll";
import { profile } from "../../data/profile";

const Partners = () => {
  const { partners } = profile;

  return (
    <section className="section-shell bg-white border-t border-stone-100" id="partners">
      <div className="content px-4 sm:px-6">
        <AnimateOnScroll animation="fade-up" className="section-header">
          <p className="section-eyebrow">Collaborations</p>
          <h2 className="section-title">{partners.sectionTitle}</h2>
        </AnimateOnScroll>
        <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
          {partners.organizations.map((org, index) => (
            <AnimateOnScroll
              key={org}
              animation="scale-in"
              delay={index * 60}
              as="span"
              className="px-5 py-2.5 rounded-full border border-stone-200 bg-edo-sage/30 text-sm sm:text-base font-medium text-edo-charcoal hover:bg-edo-sage/60 hover:border-edo-sage-dark transition-colors duration-300"
            >
              {org}
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Partners;
