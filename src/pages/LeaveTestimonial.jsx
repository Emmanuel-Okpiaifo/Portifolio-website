import { useCallback, useEffect, useState } from "react";
import Loading from "../components/common/loading/Loading";
import Notice from "../components/common/notice/Notice";
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
  const [notice, setNotice] = useState(null);
  const [working, setWorking] = useState("");
  const closeNotice = useCallback(() => setNotice(null), []);

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
    setNotice(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (!file) {
      setPreviewUrl("");
      setPhotoBlob(null);
      return;
    }
    if (file.size > 2 * 1024 * 1024) setWorking("Preparing your photo");
    try {
      const blob = await compressProfileImage(file);
      setPhotoBlob(blob);
      setPreviewUrl(URL.createObjectURL(blob));
    } catch (err) {
      setPreviewUrl("");
      setPhotoBlob(null);
      event.target.value = "";
      setNotice({
        tone: "error",
        title: "Photo not added",
        message: err instanceof Error ? err.message : "That photo could not be used.",
      });
    } finally {
      setWorking("");
    }
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setNotice(null);
    if (!photoBlob) {
      setNotice({
        tone: "error",
        title: "Photo missing",
        message: "Add a profile photo.",
      });
      return;
    }
    const form = event.currentTarget;
    setWorking("Uploading your photo");
    try {
      await submitTestimonial({ firstName, lastName, message, photoBlob });
      setFirstName("");
      setLastName("");
      setMessage("");
      setPhotoBlob(null);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl("");
      form.reset();
      setNotice({
        tone: "success",
        title: "Thank you",
        message: "Your note and photo were received. They will appear on the homepage after they are accepted.",
      });
    } catch (err) {
      setNotice({
        tone: "error",
        title: "Could not send",
        message: err instanceof Error ? err.message : "Your testimonial could not be sent.",
      });
    } finally {
      setWorking("");
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
              <label className="mt-3 flex items-center gap-3 sm:gap-4 min-w-0 cursor-pointer">
                {previewUrl ? (
                  <img src={previewUrl} alt="" className="h-16 w-16 shrink-0 rounded-full object-cover border-2 border-edo-gold/50" />
                ) : (
                  <span className="h-16 w-16 shrink-0 rounded-full bg-edo-stone border border-dashed border-stone-300" />
                )}
                <span className="min-w-0">
                  <span className="block text-sm font-medium text-edo-charcoal">
                    {previewUrl ? "Change photo" : "Choose a photo"}
                  </span>
                  <span className="block text-xs text-stone-500 mt-0.5">JPG, PNG, or WEBP, up to 10 MB</span>
                  <input
                    type="file"
                    name="photo"
                    accept="image/jpeg,image/png,image/webp"
                    className="sr-only"
                    onChange={onPhoto}
                  />
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={Boolean(working) || !isSupabaseConfigured()}
              className="btn btn-primary btn-touch btn-section w-full sm:w-auto sm:self-start mt-2"
            >
              Send testimonial
            </button>
          </form>
        </div>
      </div>
      {working && <Loading label={working} />}
      <Notice notice={notice} onClose={closeNotice} />
    </section>
  );
};

export default LeaveTestimonial;
