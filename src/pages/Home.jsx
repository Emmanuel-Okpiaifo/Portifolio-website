import Introduction from "../components/introduction/Introduction";
import Profile from "../components/profile/Profile";
import WorkProcess from "../components/workProcess/WorkProcess";
import Portfolio from "../components/portfolio/Portfolio";
import WorkTogether from "../components/workTogether/WorkTogether";
import Profession from "../components/profession/Profession";
import Testimonial from "../components/testimonial/Testimonial";
import Contact from "../components/contact/Contact";

const Home = () => {
  return (
    <div className="relative">
      <div className="introduction-profile-background">
        <div className="content">
          <Introduction />
          <Profile />
        </div>
      </div>
      <div className="bg-soft-white pt-30">
        <WorkProcess />
      </div>
      <Portfolio />
      <div className="bg-gray-900">
        <WorkTogether />
      </div>
      <div className="bg-soft-white">
        <Profession />
      </div>
      <div className="mt-12 md:mt-16">
        <Testimonial />
      </div>
      <Contact />
    </div>
  );
};

export default Home;
