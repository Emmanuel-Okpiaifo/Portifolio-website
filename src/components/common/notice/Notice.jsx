import { useEffect, useRef } from "react";

const Notice = ({ notice, onClose }) => {
  const closeRef = useRef(null);

  useEffect(() => {
    if (!notice) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (event) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
    };
  }, [notice, onClose]);

  if (!notice) return null;

  const success = notice.tone === "success";

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-edo-charcoal/70"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="notice-title"
        className="w-full max-w-md bg-white rounded-2xl border border-stone-200 shadow-xl p-5 sm:p-8 min-w-0"
        onClick={(event) => event.stopPropagation()}
      >
        <p className={`text-xs font-semibold uppercase tracking-[0.2em] ${success ? "text-edo-gold" : "text-red-700"}`}>
          {success ? "Success" : "Error"}
        </p>
        <h2 id="notice-title" className="mt-3 font-display text-2xl sm:text-3xl font-semibold text-edo-charcoal text-balance leading-tight">
          {notice.title}
        </h2>
        {notice.message && (
          <p className="mt-3 text-stone-600 leading-relaxed break-words">{notice.message}</p>
        )}
        <button
          ref={closeRef}
          type="button"
          className="btn btn-primary btn-touch mt-6 w-full sm:w-auto"
          onClick={onClose}
        >
          OK
        </button>
      </div>
    </div>
  );
};

export default Notice;
