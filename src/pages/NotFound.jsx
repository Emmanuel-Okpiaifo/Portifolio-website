import { Link, useRouteError } from "react-router-dom";
import { profile } from "../data/profile";

const homeHref = import.meta.env.BASE_URL || "/";

export const NotFound = () => {
  return (
    <section className="section-shell bg-edo-stone min-h-[70vh]">
      <div className="content px-4 sm:px-6 max-w-xl mx-auto text-center">
        <p className="section-eyebrow">404</p>
        <h1 className="font-display text-3xl sm:text-4xl font-semibold text-edo-charcoal text-balance">
          This page is not on the site
        </h1>
        <p className="mt-3 text-stone-600">
          The address does not match a page for {profile.name}.
        </p>
        <Link to="/" className="btn btn-primary btn-touch mt-8 w-full sm:w-auto">
          Back home
        </Link>
      </div>
    </section>
  );
};

export const RouteError = () => {
  const error = useRouteError();
  const message = error instanceof Error ? error.message : "Something went wrong while loading this page.";

  return (
    <main className="min-h-screen bg-edo-stone flex items-center justify-center px-4 py-16">
      <div className="max-w-xl text-center">
        <p className="text-edo-gold text-xs font-semibold uppercase tracking-[0.2em]">Emmanuel (Daniel) Okpiaifo</p>
        <h1 className="mt-3 font-display text-3xl sm:text-4xl font-semibold text-edo-charcoal">This page could not be loaded</h1>
        <p className="mt-3 text-stone-600 break-words">{message}</p>
        <a href={homeHref} className="btn btn-primary btn-touch mt-8 w-full sm:w-auto">
          Back home
        </a>
      </div>
    </main>
  );
};

export default NotFound;
