import { useCallback, useEffect, useState } from "react";
import Notice from "../components/common/notice/Notice";
import { getSupabase, isSupabaseConfigured } from "../lib/supabaseClient";
import {
  deleteTestimonial,
  loadReviewTestimonials,
  saveTestimonialOrder,
  setTestimonialStatus,
} from "../lib/testimonialsStore";

const STATUS_LABEL = {
  pending: "Pending",
  approved: "On the site",
  hidden: "Hidden",
};

const INPUT_CLASS =
  "w-full min-w-0 border-0 border-b-2 border-stone-200 bg-transparent py-3 text-base text-edo-charcoal placeholder:text-stone-400 focus:border-edo-gold focus:outline-none transition-colors";

const moveButtonClass =
  "btn btn-touch bg-white border border-stone-300 w-full px-3 text-sm disabled:opacity-40";

const ReviewTestimonials = () => {
  const [session, setSession] = useState(null);
  const [ready, setReady] = useState(false);
  const [items, setItems] = useState([]);
  const [notice, setNotice] = useState(null);
  const closeNotice = useCallback(() => setNotice(null), []);
  const showError = (message) => setNotice({ tone: "error", title: "Could not finish", message });
  const showSuccess = (title, message) => setNotice({ tone: "success", title, message });
  const [busyId, setBusyId] = useState("");
  const [savingOrder, setSavingOrder] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signingIn, setSigningIn] = useState(false);

  const refresh = async () => {
    const next = await loadReviewTestimonials();
    setItems(next);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    const previous = document.title;
    document.title = "Review testimonials — EDO";
    const supabase = getSupabase();
    if (!supabase) {
      setReady(true);
      return undefined;
    }

    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setSession(data.session);
      setReady(true);
    });
    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
    });

    return () => {
      active = false;
      data.subscription.unsubscribe();
      document.title = previous;
    };
  }, []);

  useEffect(() => {
    if (!session) {
      setItems([]);
      return undefined;
    }
    let active = true;
    refresh()
      .catch((err) => {
        if (active) showError(err instanceof Error ? err.message : "Testimonials could not be loaded.");
      });
    return () => {
      active = false;
    };
  }, [session]);

  const signIn = async (event) => {
    event.preventDefault();
    setNotice(null);
    setSigningIn(true);
    try {
      const { error: signInError } = await getSupabase().auth.signInWithPassword({ email, password });
      if (signInError) showError("That email or password was not accepted.");
    } finally {
      setSigningIn(false);
    }
  };

  const updateStatus = async (id, status) => {
    setNotice(null);
    setBusyId(id);
    try {
      await setTestimonialStatus(id, status);
      await refresh();
      showSuccess(
        status === "approved" ? "Now on the site" : "Hidden",
        status === "approved"
          ? "This note is showing on the homepage."
          : "This note is hidden from the homepage."
      );
    } catch (err) {
      showError(err instanceof Error ? err.message : "That testimonial could not be updated.");
    } finally {
      setBusyId("");
    }
  };

  const move = async (index, direction) => {
    const target = index + direction;
    if (target < 0 || target >= items.length || savingOrder) return;
    const previous = items;
    const reordered = [...items];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(target, 0, moved);
    setItems(reordered);
    setNotice(null);
    setSavingOrder(true);
    try {
      await saveTestimonialOrder(reordered.map((item) => item.id));
    } catch (err) {
      setItems(previous);
      showError(err instanceof Error ? err.message : "The order could not be saved.");
    } finally {
      setSavingOrder(false);
    }
  };

  const remove = async (item) => {
    setNotice(null);
    setBusyId(item.id);
    try {
      await deleteTestimonial(item.id, item.photoPath);
      await refresh();
      showSuccess("Deleted", "This note and its photo were removed.");
    } catch (err) {
      showError(err instanceof Error ? err.message : "That testimonial could not be removed.");
    } finally {
      setBusyId("");
    }
  };

  return (
    <section className="section-shell bg-edo-stone min-h-[70vh]">
      <div className="content px-4 sm:px-6">
        <div className="max-w-3xl mx-auto min-w-0">
          <p className="section-eyebrow">Private</p>
          <h1 className="font-display text-[1.75rem] sm:text-4xl font-semibold text-edo-charcoal text-balance leading-tight">
            Review testimonials
          </h1>
          <p className="mt-3 text-stone-600">
            Show, hide, delete, or move every note. The order here is the order on the homepage.
          </p>

          {!isSupabaseConfigured() && (
            <p className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              Add your Supabase URL and anon key before reviewing notes.
            </p>
          )}

          {ready && isSupabaseConfigured() && !session && (
            <form className="mt-8 bg-white rounded-2xl border border-stone-200 p-5 sm:p-8 flex flex-col gap-5" onSubmit={signIn}>
              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">Email</span>
                <input type="email" required autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} className={INPUT_CLASS} />
              </label>
              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">Password</span>
                <input type="password" required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} className={INPUT_CLASS} />
              </label>
              <button type="submit" disabled={signingIn} className="btn btn-primary btn-touch w-full sm:w-auto sm:self-start">
                {signingIn ? "Signing in…" : "Sign in"}
              </button>
            </form>
          )}

          {session && (
            <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <p className="text-sm text-stone-600 break-all">{session.user.email}</p>
              <button
                type="button"
                className="btn btn-ghost border border-stone-300 btn-touch w-full sm:w-auto"
                onClick={() => getSupabase().auth.signOut()}
              >
                Sign out
              </button>
            </div>
          )}

          {session && items.length === 0 && (
            <p className="mt-8 text-stone-600">No testimonials have been sent yet.</p>
          )}

          {session && items.length > 0 && (
            <ul className="mt-8 flex flex-col gap-4">
              {items.map((item, index) => (
                <li key={item.id} className="bg-white rounded-2xl border border-stone-200 p-4 sm:p-5 min-w-0">
                  <div className="flex gap-3 sm:gap-4 min-w-0">
                    <div className="hidden sm:flex flex-col gap-2 shrink-0">
                      <button type="button" aria-label={`Move ${item.firstName} ${item.lastName} up`} disabled={savingOrder || index === 0} onClick={() => move(index, -1)} className={moveButtonClass}>Up</button>
                      <button type="button" aria-label={`Move ${item.firstName} ${item.lastName} down`} disabled={savingOrder || index === items.length - 1} onClick={() => move(index, 1)} className={moveButtonClass}>Down</button>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex gap-3 min-w-0">
                        <img
                          src={item.photo}
                          alt=""
                          className="h-14 w-14 sm:h-16 sm:w-16 shrink-0 rounded-full object-cover border-2 border-edo-gold/40"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-edo-charcoal break-words">
                            {index + 1}. {item.firstName} {item.lastName}
                          </p>
                          <p className="mt-1 text-xs uppercase tracking-wide font-semibold text-edo-gold-dark">
                            {STATUS_LABEL[item.status] ?? item.status}
                          </p>
                        </div>
                      </div>
                      <p className="mt-3 text-sm text-stone-700 leading-relaxed break-words">{item.message}</p>
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-2 sm:hidden">
                    <button type="button" aria-label={`Move ${item.firstName} ${item.lastName} up`} disabled={savingOrder || index === 0} onClick={() => move(index, -1)} className={moveButtonClass}>Up</button>
                    <button type="button" aria-label={`Move ${item.firstName} ${item.lastName} down`} disabled={savingOrder || index === items.length - 1} onClick={() => move(index, 1)} className={moveButtonClass}>Down</button>
                  </div>
                  <div className="mt-2 sm:mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <button
                      type="button"
                      disabled={busyId === item.id || item.status === "approved"}
                      onClick={() => updateStatus(item.id, "approved")}
                      className="btn btn-primary btn-touch w-full text-sm"
                    >
                      Show on site
                    </button>
                    <button
                      type="button"
                      disabled={busyId === item.id || item.status === "hidden"}
                      onClick={() => updateStatus(item.id, "hidden")}
                      className="btn bg-white border border-stone-300 btn-touch w-full text-sm"
                    >
                      Hide
                    </button>
                    <button
                      type="button"
                      disabled={busyId === item.id}
                      onClick={() => remove(item)}
                      className="btn bg-white border border-red-200 text-red-700 btn-touch w-full text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <Notice notice={notice} onClose={closeNotice} />
    </section>
  );
};

export default ReviewTestimonials;
