import Projects from "./Projects";
import card1 from "../../assets/images/portfolio-images/card-1.png";
import card2 from "../../assets/images/portfolio-images/card-2.png";
import card3 from "../../assets/images/portfolio-images/card-3.png";
import card4 from "../../assets/images/portfolio-images/card-4.png";
import card5 from "../../assets/images/portfolio-images/card-5.png";
import card6 from "../../assets/images/portfolio-images/card-6.png";
import { profile } from "../../data/profile";

const imageMap = { card1, card2, card3, card4, card5, card6 };

const Portfolio = () => {
  const { portfolio } = profile;
  const projectData = portfolio.projects.map((p) => ({
    ...p,
    image: imageMap[p.imageKey],
  }));

  return (
    <div
      className="content mt-10 md:mt-15 xl:mt-25 mb-10 md:mb-25 max-xxl:p-2"
      id="portfolio"
    >
      <div className="xl:mb-17.5 mb-5">
        <div className="max-sm:px-2 text-center mx-auto max-w-144.25">
          <p className="section-title ">{portfolio.sectionTitle}</p>
          <p className="font-normal text-[18px] max-sm:text-[14px] pt-6 text-gray-400">
            {portfolio.sectionSubtitle}
          </p>
        </div>
      </div>
      <div className="mx-auto flex justify-center">
        <div className="grid xl:grid-cols-3 md:grid-cols-2 gap-6">
          {projectData.map((data) => (
            <Projects data={data} key={data.id} />
          ))}
        </div>
      </div>
      <div className="text-center">
        <a
          href={portfolio.moreProjectsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary py-3 px-6 mt-12.5 text-center text-[16px] font-semibold"
        >
          {portfolio.moreProjectsLabel}
        </a>
      </div>
    </div>
  );
};

export default Portfolio;
