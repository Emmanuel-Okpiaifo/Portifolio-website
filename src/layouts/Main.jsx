import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import NavBar from "../components/common/navbar/NavBar";
import Footer from "../components/common/footer/Footer";
import ScrollToTop from "../components/common/scrollToTop/ScrollToTop";
import Loading from "../components/common/loading/Loading";

const LOADER_VISIBLE_MS = 1500;
const LOADER_FADE_MS = 500;

const Main = () => {
  // "visible" → "fading" → "hidden"; site renders underneath the overlay
  const [loaderPhase, setLoaderPhase] = useState("visible");

  useEffect(() => {
    const fadeTimer = setTimeout(() => setLoaderPhase("fading"), LOADER_VISIBLE_MS);
    const hideTimer = setTimeout(
      () => setLoaderPhase("hidden"),
      LOADER_VISIBLE_MS + LOADER_FADE_MS
    );
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  return (
    <div data-theme={"light"} className="relative overflow-x-hidden min-w-0">
      {loaderPhase !== "hidden" && <Loading fading={loaderPhase === "fading"} />}
      <NavBar />
      <Outlet />
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default Main;
