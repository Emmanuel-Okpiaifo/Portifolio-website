import { Outlet } from "react-router-dom";
import NavBar from "../components/common/navbar/NavBar";
import Footer from "../components/common/footer/Footer";
import ScrollToTop from "../components/common/scrollToTop/ScrollToTop";

const Main = () => {
  return (
    <div data-theme={"light"} className="relative overflow-x-hidden min-w-0">
      <NavBar />
      <Outlet />
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default Main;
