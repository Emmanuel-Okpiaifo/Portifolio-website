import Introduction from "../components/introduction/Introduction";
import Profile from "../components/profile/Profile";
import Experience from "../components/experience/Experience";
import Portfolio from "../components/portfolio/Portfolio";
import Skills from "../components/skills/Skills";
import Profession from "../components/profession/Profession";
import Partners from "../components/testimonial/Testimonial";
import WorkTogether from "../components/workTogether/WorkTogether";
import Contact from "../components/contact/Contact";

const Home = () => {
  return (
    <div className="relative overflow-x-hidden">
      {/* Hero + About */}
      <div className="hero-shell">
        <div className="content px-4 sm:px-6">
          <Introduction />
        </div>
        <div className="content px-4 sm:px-6">
          <Profile />
        </div>
      </div>

      {/* Experience */}
      <Experience />

      {/* Portfolio */}
      <Portfolio />

      {/* Skills + Services */}
      <div className="bg-white">
        <Skills />
        <Profession />
      </div>

      {/* Partners */}
      <Partners />

      {/* CTA */}
      <div className="bg-edo-charcoal">
        <WorkTogether />
      </div>

      {/* Contact */}
      <div className="bg-edo-stone pb-16 sm:pb-20 md:pb-28">
        <Contact />
      </div>
    </div>
  );
};

export default Home;
