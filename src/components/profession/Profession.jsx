import Roles from "./Roles";
import AnimateOnScroll from "../common/animate/AnimateOnScroll";
import { profile } from "../../data/profile";

const Profession = () => {
  const { profession } = profile;

  return (
    <section className="section-shell bg-edo-stone/50 border-t border-stone-100" id="services">
      <div className="content px-4 sm:px-6 grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
        <AnimateOnScroll animation="slide-left" className="max-lg:text-center">
          <p className="section-eyebrow">Services</p>
          <h2 className="section-title text-left max-lg:text-center">{profession.title}</h2>
          <div className="mt-6 space-y-4 text-stone-600 leading-relaxed">
            <p>{profession.intro}</p>
            <p>{profession.intro2}</p>
          </div>
          <a
            href={`mailto:${profession.ctaEmail}`}
            className="btn btn-primary btn-touch mt-8 px-6 py-3 btn-section max-lg:mx-auto inline-flex w-full sm:w-auto justify-center"
          >
            Say Hello
          </a>
        </AnimateOnScroll>
        <div className="space-y-4">
          {profession.roles.map((role, index) => (
            <AnimateOnScroll key={role.id} animation="slide-right" delay={index * 100}>
              <Roles role={role} />
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Profession;
