import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AnimateOnScroll from "../common/animate/AnimateOnScroll";
import { loadApprovedTestimonials } from "../../lib/testimonialsStore";

const formatDate = (iso) => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const Testimonials = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    loadApprovedTestimonials()
      .then((next) => {
        if (active) setItems(next.source === "sheet" ? next.items : []);
      })
      .catch(() => {
        if (active) setItems([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (loading || window.location.hash !== "#testimonials") return undefined;
    const timer = window.setTimeout(() => {
      document.getElementById("testimonials")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
    return () => window.clearTimeout(timer);
  }, [loading, items.length]);

  const gridClass =
    items.length >= 3
      ? "md:grid-cols-2 xl:grid-cols-3"
      : items.length === 2
        ? "md:grid-cols-2 max-w-4xl mx-auto"
        : "max-w-xl mx-auto";

  return (
    <section className="section-shell bg-white border-t border-stone-100" id="testimonials">
      <div className="content px-4 sm:px-6">
        <AnimateOnScroll animation="fade-up" className="section-header">
          <p className="section-eyebrow">Testimonials</p>
          <h2 className="section-title">Kind words</h2>
          <p className="section-subtitle">
            Notes from people who have worked with Emmanuel.
          </p>
        </AnimateOnScroll>

        {loading && (
          <p className="text-center text-stone-500" role="status">
            Loading notes…
          </p>
        )}

        {!loading && items.length === 0 && (
          <div className="text-center">
            <p className="text-stone-600 text-balance">No testimonials to show yet.</p>
            <Link
              to="/leave-a-testimonial"
              className="btn bg-white border border-stone-300 hover:border-edo-gold hover:text-edo-gold btn-touch px-6 py-3 mt-6 w-full sm:w-auto relative z-40"
            >
              Leave a testimonial
            </Link>
          </div>
        )}

        {!loading && items.length > 0 && (
          <>
            <div className={`grid grid-cols-1 items-start gap-4 sm:gap-6 ${gridClass}`}>
              {items.map((item, index) => (
                <AnimateOnScroll key={item.id} animation="fade-up" delay={index * 70} className="min-w-0 w-full">
                  <article className="min-w-0 w-full rounded-2xl border border-stone-200/80 bg-edo-stone/40 p-5 sm:p-6 overflow-hidden">
                    <p className="font-display text-4xl sm:text-5xl leading-none text-edo-gold/80" aria-hidden="true">
                      “
                    </p>
                    <p className="mt-3 text-stone-700 leading-relaxed break-words">
                      {item.message}
                    </p>
                    <div className="mt-5 flex items-center gap-3 min-w-0">
                      {item.photo ? (
                        <img
                          src={item.photo}
                          alt=""
                          className="h-12 w-12 shrink-0 rounded-full object-cover border-2 border-edo-gold/50"
                        />
                      ) : (
                        <span className="h-12 w-12 shrink-0 rounded-full border-2 border-edo-gold/50 bg-edo-sage text-edo-charcoal text-sm font-semibold inline-flex items-center justify-center" aria-hidden="true">
                          {(item.firstName?.[0] || "").toUpperCase()}{(item.lastName?.[0] || "").toUpperCase()}
                        </span>
                      )}
                      <div className="min-w-0">
                        <p className="font-semibold text-edo-charcoal break-words">
                          {item.firstName} {item.lastName}
                        </p>
                        {(item.role || item.company) && (
                          <p className="text-xs text-stone-600 break-words">
                            {[item.role, item.company].filter(Boolean).join(", ")}
                          </p>
                        )}
                        <p className="text-xs text-stone-500">{formatDate(item.createdAt)}</p>
                      </div>
                    </div>
                  </article>
                </AnimateOnScroll>
              ))}
            </div>
            <div className="text-center mt-8 sm:mt-10 px-1">
              <Link
                to="/leave-a-testimonial"
                className="btn bg-white border border-stone-300 hover:border-edo-gold hover:text-edo-gold btn-touch px-6 py-3 w-full sm:w-auto relative z-40"
              >
                Leave a testimonial
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Testimonials;
