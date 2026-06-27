import AnimateOnScroll from "../common/animate/AnimateOnScroll";
import { profile } from "../../data/profile";

const Experience = () => {
  const { experience } = profile;

  return (
    <section className="section-shell bg-white" id="experience">
      <div className="content px-4 sm:px-6">
        <AnimateOnScroll animation="fade-up" className="section-header">
          <p className="section-eyebrow">Career</p>
          <h2 className="section-title">{experience.sectionTitle}</h2>
          <p className="section-subtitle">{experience.sectionSubtitle}</p>
        </AnimateOnScroll>

        <div className="relative max-w-3xl mx-auto">
          <div
            className="hidden md:block absolute left-[7px] top-3 bottom-3 w-px bg-stone-200"
            aria-hidden="true"
          />
          <ol className="flex flex-col gap-8">
            {experience.items.map((job, index) => (
              <AnimateOnScroll
                key={job.id}
                animation="slide-right"
                delay={index * 100}
                as="li"
                className="relative md:pl-10 p-6 rounded-2xl bg-edo-stone/50 border border-stone-100 md:bg-transparent md:border-0 md:p-0 list-none"
              >
                <span
                  className="hidden md:block absolute left-0 top-7 size-4 rounded-full bg-edo-gold ring-4 ring-white"
                  aria-hidden="true"
                />
                <div className="flex flex-col md:flex-row md:justify-between md:items-baseline gap-1 min-w-0">
                  <h3 className="font-display text-lg sm:text-xl font-semibold text-edo-charcoal min-w-0">
                    {job.title}
                  </h3>
                  <p className="text-sm text-stone-500 md:shrink-0">{job.dates}</p>
                </div>
                <p className="mt-1 text-sm font-medium text-edo-gold">
                  {job.company} — {job.location}
                </p>
                <ul className="mt-3 list-disc ps-5 text-sm text-stone-600 space-y-2 leading-relaxed">
                  {job.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              </AnimateOnScroll>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
};

export default Experience;
