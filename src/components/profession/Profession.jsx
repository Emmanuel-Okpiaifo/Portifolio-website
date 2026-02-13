import Roles from "./Roles";
import { profile } from "../../data/profile";

const Profession = () => {
  const { profession } = profile;
  return (
    <div
      className="content grid md:grid-cols-2 max-xxl:px-4 xxl:px-2 py-10 md:py-15 lg:py-37.5"
      id="services"
    >
      <div className="flex flex-col justify-between h-fit md:pe-8 lg:pe-35.75 max-md:text-center my-auto">
        <p className="section-title max-md:text-center">{profession.title}</p>
        <div className="mt-6 text-[14px]">
          <p className="text-xs sm:text-lg font-normal text-gray-400 mb-4">
            {profession.intro}
          </p>
          <p className="text-xs sm:text-lg font-normal text-gray-400">
            {profession.intro2}
          </p>
        </div>
        <a
          href={`mailto:${profession.ctaEmail}`}
          className="mt-5 md:mt-12.5 btn btn-primary text-white w-fit md:py-3 md:px-6 text-[12px] sm:text-[16px] font-semibold max-md:mx-auto max-md:mb-5 btn-section"
        >
          Say Hello!
        </a>
      </div>
      <div className="">
        {profession.roles.map((role) => (
          <Roles role={role} key={role.id} />
        ))}
      </div>
    </div>
  );
};

export default Profession;
