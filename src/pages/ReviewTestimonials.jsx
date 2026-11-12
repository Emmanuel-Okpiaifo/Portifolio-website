import { useEffect, useState } from "react";
import { profile } from "../data/profile";
import { loadApprovedTestimonials, TESTIMONIALS_SHEET_URL } from "../lib/testimonialsStore";

const ReviewTestimonials = () => {
  const [items, setItems] = useState([]);
  const [source, setSource] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
    const previous = document.title;
    document.title = `Review testimonials | ${profile.name}`;
    let robots = document.querySelector('meta[name="robots"]');
    const createdRobots = !robots;
    if (!robots) {
      robots = document.createElement("meta");
      robots.setAttribute("name", "robots");
      document.head.appendChild(robots);
    }
    const previousRobots = robots.getAttribute("content");
    robots.setAttribute("content", "noindex");

    let active = true;
    loadApprovedTestimonials().then((next) => {
      if (!active) return;
      setItems(next.items);
      setSource(next.source);
    });

    return () => {
      active = false;
      document.title = previous;
      if (createdRobots) robots.remove();
      else if (previousRobots == null) robots.removeAttribute("content");
      else robots.setAttribute("content", previousRobots);
    };
  }, []);

  return (
    <section className="section-shell bg-edo-stone min-h-[70vh] relative z-40">
      <div className="content px-4 sm:px-6">
        <div className="max-w-3xl mx-auto min-w-0 bg-white rounded-2xl border border-stone-200 p-5 sm:p-8">
          <p className="section-eyebrow">Private</p>
          <h1 className="font-display text-[1.75rem] sm:text-4xl font-semibold text-edo-charcoal text-balance leading-tight">
            Review testimonials
          </h1>
          <p className="mt-3 text-stone-600 leading-relaxed">
            New notes from the form arrive with status pending and stay off the homepage. Change status to approved to publish one. A lower sort_order appears first. Leave photo_url empty to show initials. Leave email addresses out of this sheet.
          </p>

          {source === "empty" && (
            <p className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900" role="status">
              The sheet is connected and empty, so the homepage is showing the copy of Adeola Ayanda’s note saved with the site. Add a header row of status, sort_order, created_at, first_name, last_name, role, company, message, photo_url, then her note on the next row with status set to approved. Leave email addresses out of this sheet.
            </p>
          )}

          {source === "saved" && (
            <p className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900" role="status">
              Visitors cannot read the sheet yet, so the homepage is showing the copy saved with the site. In Google Sheets, open Share and set General access to Anyone with the link, Viewer. Leave email addresses out of this sheet.
            </p>
          )}

          <a
            href={TESTIMONIALS_SHEET_URL}
            target="_blank"
            rel="noreferrer"
            className="btn btn-primary btn-touch mt-6 w-full sm:w-auto"
          >
            Open the sheet
          </a>

          <h2 className="mt-8 font-semibold text-edo-charcoal">Showing on the homepage</h2>
          {items.length === 0 ? (
            <p className="mt-3 text-stone-600">No approved notes yet.</p>
          ) : (
            <ul className="mt-3 flex flex-col gap-3">
              {items.map((item) => (
                <li key={item.id} className="rounded-xl border border-stone-200 px-4 py-3 min-w-0">
                  <p className="font-semibold text-edo-charcoal break-words">
                    {item.firstName} {item.lastName}
                  </p>
                  <p className="text-sm text-stone-600 break-words">
                    {[item.role, item.company].filter(Boolean).join(", ")}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
};

export default ReviewTestimonials;
