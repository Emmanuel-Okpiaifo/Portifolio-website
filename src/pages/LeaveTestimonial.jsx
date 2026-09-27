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
  const [role, setRole] = useState("");
  const [company, setCompany] = useState("");
  const [relationship, setRelationship] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const [photoBlob, setPhotoBlob] = useState(null);
  const [notice, setNotice] = useState(null);
  const [working, setWorking] = useState("");
  const closeNotice = useCallback(() => setNotice(null), []);

  useEffect(() => {
    window.scrollTo(0, 0);
    const previous = document.title;
    document.title = "Leave a testimonial | Emmanuel (Daniel) Okpiaifo";
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
    if (!consent) {
      setNotice({
        tone: "error",
        title: "Consent needed",
        message: "Tick the box if you're happy for Emmanuel to quote this on his website and LinkedIn.",
      });
      return;
    }
    const form = event.currentTarget;
    setWorking(photoBlob ? "Uploading your photo" : "Sending your note");
    try {
      await submitTestimonial({
        firstName,
        lastName,
        message,
        role,
        company,
        relationship,
        linkedinUrl,
        email,
        consent,
        photoBlob,
      });
      setFirstName("");
      setLastName("");
      setMessage("");
      setRole("");
      setCompany("");
      setRelationship("");
      setLinkedinUrl("");
      setEmail("");
      setConsent(false);
      setPhotoBlob(null);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl("");
      form.reset();
      setNotice({
        tone: "success",
        title: "Thank you",
        message: "Your note was received. It will appear on the homepage after Emmanuel accepts it. Your email, if you left one, stays private.",
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
            What did we work on, and what did Emmanuel do that made a difference? Emmanuel reviews each note before it appears on the homepage. A photo is optional.
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <label className="block min-w-0">
                <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">Role</span>
                <input name="role" value={role} onChange={(e) => setRole(e.target.value)} maxLength={80} required autoComplete="organization-title" className={INPUT_CLASS} placeholder="Product designer" />
              </label>
              <label className="block min-w-0">
                <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">Company</span>
                <input name="company" value={company} onChange={(e) => setCompany(e.target.value)} maxLength={80} required autoComplete="organization" className={INPUT_CLASS} placeholder="Company name" />
              </label>
            </div>

            <label className="block min-w-0">
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">How do you know Emmanuel?</span>
              <select name="relationship" value={relationship} onChange={(e) => setRelationship(e.target.value)} required className={`${INPUT_CLASS} bg-white`}>
                <option value="">Choose one</option>
                <option>Colleague</option>
                <option>Manager</option>
                <option>Client</option>
                <option>Mentee</option>
                <option>Other</option>
              </select>
            </label>

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
                placeholder="What did we work on, and what did Emmanuel do that made a difference?"
              />
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <label className="block min-w-0">
                <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">LinkedIn URL <span className="normal-case tracking-normal text-stone-400">(optional)</span></span>
                <input name="linkedinUrl" value={linkedinUrl} onChange={(e) => setLinkedinUrl(e.target.value)} maxLength={200} inputMode="url" className={INPUT_CLASS} placeholder="https://www.linkedin.com/in/..." />
              </label>
              <label className="block min-w-0">
                <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">Email <span className="normal-case tracking-normal text-stone-400">(optional, kept private)</span></span>
                <input name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} maxLength={120} autoComplete="email" className={INPUT_CLASS} placeholder="you@example.com" />
              </label>
            </div>

            <div className="min-w-0">
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">Profile photo <span className="normal-case tracking-normal text-stone-400">(optional)</span></span>
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
                  <span className="block text-xs text-stone-500 mt-0.5">JPG, PNG, or WEBP. Saved at 2 MB or less. An initials avatar is used if you skip this.</span>
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

            <label className="flex items-start gap-3 text-sm text-stone-700 leading-relaxed">
              <input
                type="checkbox"
                name="consent"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                required
                className="mt-1 h-4 w-4 shrink-0 accent-edo-gold"
              />
              <span>I&apos;m happy for Emmanuel to quote this on his website and LinkedIn.</span>
            </label>

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
