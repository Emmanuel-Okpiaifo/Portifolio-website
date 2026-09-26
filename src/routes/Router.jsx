import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import Loading from "../components/common/loading/Loading";
const Home = lazy(() => import("../pages/Home"));
const LeaveTestimonial = lazy(() => import("../pages/LeaveTestimonial"));
const ReviewTestimonials = lazy(() => import("../pages/ReviewTestimonials"));
const Main = lazy(() => import("../layouts/Main"));

const ghPages =
  import.meta.env.VITE_GH_PAGES === "true" && import.meta.env.VITE_REPO_NAME;
const basename = ghPages ? `/${import.meta.env.VITE_REPO_NAME}` : "";

export const router = createBrowserRouter(
  [
    {
      path: `/`,
      element: (
        <Suspense fallback={<Loading />}>
          <Main />
        </Suspense>
      ),
      children: [
        {
          path: "/",
          element: <Home></Home>,
        },
        {
          path: "/leave-a-testimonial",
          element: <LeaveTestimonial />,
        },
        {
          path: "/review-testimonials",
          element: <ReviewTestimonials />,
        },
      ],
    },
  ],
  { basename }
);
