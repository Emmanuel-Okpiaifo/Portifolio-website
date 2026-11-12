import AnimateOnScroll from "../common/animate/AnimateOnScroll";
import { profile } from "../../data/profile";

const SkillPill = ({ item }) => {
  const splitAt = item.indexOf(" / ");
  const shared =
    "max-w-full bg-white text-stone-700 border border-stone-200 px-3 py-1.5 text-xs leading-snug @[24rem]:text-sm @[24rem]:leading-normal";

  if (splitAt === -1) {
    return <span className={`${shared} rounded-full`}>{item}</span>;
  }

  const lead = item.slice(0, splitAt);
  const rest = item.slice(splitAt + 3);

  return (
    <span
      className={`${shared} inline-flex w-fit flex-col items-start rounded-2xl @[20rem]:flex-row @[20rem]:items-center @[20rem]:rounded-full`}
    >
      <span>{lead} /</span>
      <span className="@[20rem]:before:content-['_']">{rest}</span>
    </span>
  );
};

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
              <div className="@container flex flex-wrap gap-2">
                {category.items.map((item) => (
                  <SkillPill key={item} item={item} />
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
