import { useEffect, useState } from "react";
import { compressProfileImage, submitTestimonial } from "../lib/testimonialsStore";
import { isSupabaseConfigured } from "../lib/supabaseClient";

const INPUT_CLASS =
  "w-full min-w-0 max-w-full box-border border-0 border-b-2 border-stone-200 bg-transparent py-3 text-base text-edo-charcoal placeholder:text-stone-400 focus:border-edo-gold focus:outline-none transition-colors";

const LeaveTestimonial = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [message, setMessage] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [photoBlob, setPhotoBlob] = useState(null);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const previous = document.title;
    document.title = "Leave a testimonial — EDO";
    return () => {
      document.title = previous;
    };
  }, []);

  useEffect(() => () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  const onPhoto = async (event) => {
    const file = event.target.files?.[0];
    setError("");
    setSaved(false);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (!file) {
      setPreviewUrl("");
      setPhotoBlob(null);
      return;
    }
    try {
      const blob = await compressProfileImage(file);
      setPhotoBlob(blob);
      setPreviewUrl(URL.createObjectURL(blob));
    } catch (err) {
      setPreviewUrl("");
      setPhotoBlob(null);
      event.target.value = "";
      setError(err instanceof Error ? err.message : "That photo could not be used.");
    }
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setError("");
    if (!photoBlob) {
      setError("Add a profile photo.");
      return;
    }
    setBusy(true);
    try {
      await submitTestimonial({ firstName, lastName, message, photoBlob });
      setSaved(true);
      setFirstName("");
      setLastName("");
      setMessage("");
      setPhotoBlob(null);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl("");
      event.currentTarget.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Your testimonial could not be sent.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="section-shell bg-edo-stone min-h-[70vh]">
      <div className="content px-4 sm:px-6">
        <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-stone-200 shadow-xl p-5 sm:p-10 min-w-0">
          <p className="section-eyebrow">Testimonials</p>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold text-edo-charcoal text-balance">
            Share your experience
          </h1>
          <p className="mt-3 text-stone-600 leading-relaxed">
            Leave a short note and a photo. Emmanuel reviews each one before it appears on the homepage.
          </p>

          {!isSupabaseConfigured() && (
            <p className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900" role="status">
              This form is not connected to Supabase yet.
            </p>
          )}

          {saved && (
            <div className="mt-6 rounded-xl border border-edo-sage bg-edo-sage/30 px-4 py-3 text-sm text-edo-charcoal" role="status">
              Thank you. Your note and photo were received. They will appear on the homepage after they are accepted.
            </div>
          )}

          {error && (
            <p className="mt-6 text-sm font-medium text-red-700" role="alert">
              {error}
            </p>
          )}

          <form className="mt-8 flex flex-col gap-5" onSubmit={onSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <label className="block min-w-0">
                <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">First name</span>
                <input
                  name="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  maxLength={40}
                  required
                  autoComplete="given-name"
                  className={INPUT_CLASS}
                  placeholder="Ada"
                />
              </label>
              <label className="block min-w-0">
                <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">Last name</span>
                <input
                  name="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  maxLength={40}
                  required
                  autoComplete="family-name"
                  className={INPUT_CLASS}
                  placeholder="Okonkwo"
                />
              </label>
            </div>

            <label className="block min-w-0">
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">Testimonial</span>
              <textarea
                name="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                maxLength={600}
                required
                rows={5}
                className={`${INPUT_CLASS} resize-y min-h-[8rem]`}
                placeholder="What was it like working together?"
              />
            </label>

            <div className="min-w-0">
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">Profile photo</span>
              <label className="mt-3 flex items-center gap-4 min-w-0 cursor-pointer">
                {previewUrl ? (
                  <img src={previewUrl} alt="" className="h-16 w-16 shrink-0 rounded-full object-cover border-2 border-edo-gold/50" />
                ) : (
                  <span className="h-16 w-16 shrink-0 rounded-full bg-edo-stone border border-dashed border-stone-300" />
                )}
                <span className="text-sm text-stone-600 break-words min-w-0">
                  {previewUrl ? "Change photo" : "Upload a JPG, PNG, or WEBP"}
                  <input
                    type="file"
                    name="photo"
                    accept="image/jpeg,image/png,image/webp"
                    required={!photoBlob}
                    className="sr-only"
                    onChange={onPhoto}
                  />
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={busy || !isSupabaseConfigured()}
              className="btn btn-primary btn-touch btn-section w-full sm:w-auto mt-2"
            >
              {busy ? "Sending…" : "Send testimonial"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default LeaveTestimonial;
