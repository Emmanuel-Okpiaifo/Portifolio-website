import AnimateOnScroll from "../common/animate/AnimateOnScroll";
import { profile } from "../../data/profile";

const Skills = () => {
  const { skills } = profile;

  return (
    <section className="section-shell border-t border-stone-100" id="skills">
      <div className="content px-4 sm:px-6">
        <AnimateOnScroll animation="fade-up" className="section-header">
          <p className="section-eyebrow">Expertise</p>
          <h2 className="section-title">{skills.sectionTitle}</h2>
          <p className="section-subtitle">{skills.sectionSubtitle}</p>
        </AnimateOnScroll>
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
          {skills.categories.map((category, index) => (
            <AnimateOnScroll
              key={category.id}
              animation="fade-up"
              delay={index * 80}
              className="p-6 rounded-2xl bg-edo-stone border border-stone-200/60 hover:border-edo-sage-dark/50 hover:shadow-md transition-shadow duration-300"
            >
              <h3 className="font-display text-lg font-semibold text-edo-charcoal mb-4">
                {category.title}
              </h3>
              <div className="flex flex-wrap gap-2">
                {category.items.map((item) => (
                  <span
                    key={item}
                    className="text-xs sm:text-sm px-3 py-1.5 bg-white text-stone-700 rounded-full border border-stone-200"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
