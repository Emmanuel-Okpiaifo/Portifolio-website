import Projects from "./Projects";
import AnimateOnScroll from "../common/animate/AnimateOnScroll";
import bizgrowthAfrica from "../../assets/images/portfolio-images/bizgrowth-africa.png";
import { profile } from "../../data/profile";

const localImages = {
  bizgrowthAfrica,
};

const Portfolio = () => {
  const { portfolio } = profile;
  const projectData = portfolio.projects.map((p) => ({
    ...p,
    image: p.imageKey ? localImages[p.imageKey] : null,
  }));

  return (
    <section className="section-shell bg-edo-stone" id="portfolio">
      <div className="content px-4 sm:px-6">
        <AnimateOnScroll animation="fade-up" className="section-header">
          <p className="section-eyebrow">Portfolio</p>
          <h2 className="section-title">{portfolio.sectionTitle}</h2>
          <p className="section-subtitle">{portfolio.sectionSubtitle}</p>
        </AnimateOnScroll>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8 items-start">
          {projectData.map((data, index) => (
            <AnimateOnScroll
              key={data.id}
              animation="fade-up"
              delay={index * 90}
              className={data.id === 7 ? "md:order-1 xl:order-none" : ""}
            >
              <Projects data={data} />
            </AnimateOnScroll>
          ))}
        </div>

        <AnimateOnScroll animation="fade-up" delay={200} className="text-center mt-12">
          <a
            href={portfolio.moreProjectsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary btn-touch px-8 py-3 text-base font-semibold btn-section w-full sm:w-auto max-w-md sm:max-w-none mx-auto"
          >
            {portfolio.moreProjectsLabel}
          </a>
        </AnimateOnScroll>
      </div>
    </section>
  );
};

export default Portfolio;
