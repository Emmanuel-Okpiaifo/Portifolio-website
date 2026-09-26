import { useEffect, useState } from "react";
import { getSupabase, isSupabaseConfigured } from "../lib/supabaseClient";
import {
  deleteTestimonial,
  loadReviewTestimonials,
  setTestimonialStatus,
} from "../lib/testimonialsStore";

const INPUT_CLASS =
  "w-full min-w-0 border-0 border-b-2 border-stone-200 bg-transparent py-3 text-base text-edo-charcoal placeholder:text-stone-400 focus:border-edo-gold focus:outline-none transition-colors";

const ReviewTestimonials = () => {
  const [session, setSession] = useState(null);
  const [ready, setReady] = useState(false);
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState("");
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
        if (active) setError(err instanceof Error ? err.message : "Testimonials could not be loaded.");
      });
    return () => {
      active = false;
    };
  }, [session]);

  const signIn = async (event) => {
    event.preventDefault();
    setError("");
    setSigningIn(true);
    try {
      const { error: signInError } = await getSupabase().auth.signInWithPassword({ email, password });
      if (signInError) setError("That email or password was not accepted.");
    } finally {
      setSigningIn(false);
    }
  };

  const updateStatus = async (id, status) => {
    setError("");
    setBusyId(id);
    try {
      await setTestimonialStatus(id, status);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "That testimonial could not be updated.");
    } finally {
      setBusyId("");
    }
  };

  const remove = async (item) => {
    setError("");
    setBusyId(item.id);
    try {
      await deleteTestimonial(item.id, item.photoPath);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "That testimonial could not be removed.");
    } finally {
      setBusyId("");
    }
  };

  return (
    <section className="section-shell bg-edo-stone min-h-[70vh]">
      <div className="content px-4 sm:px-6">
        <div className="max-w-3xl mx-auto min-w-0">
          <p className="section-eyebrow">Private</p>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold text-edo-charcoal">
            Review testimonials
          </h1>
          <p className="mt-3 text-stone-600">
            Accept a note to show it on the homepage. The photo is stored with the note.
          </p>

          {!isSupabaseConfigured() && (
            <p className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              Add your Supabase URL and anon key before reviewing notes.
            </p>
          )}

          {error && (
            <p className="mt-6 text-sm font-medium text-red-700" role="alert">
              {error}
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
              <button type="submit" disabled={signingIn} className="btn btn-primary btn-touch w-full sm:w-auto">
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
              {items.map((item) => (
                <li key={item.id} className="bg-white rounded-2xl border border-stone-200 p-4 sm:p-5 min-w-0">
                  <div className="flex flex-col sm:flex-row gap-4 min-w-0">
                    <img
                      src={item.photo}
                      alt={`${item.firstName} ${item.lastName}`}
                      className="h-16 w-16 shrink-0 rounded-full object-cover border-2 border-edo-gold/40"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold text-edo-charcoal break-words">
                          {item.firstName} {item.lastName}
                        </p>
                        <span className="text-xs uppercase tracking-wide font-semibold text-edo-gold-dark">
                          {item.status}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-stone-700 leading-relaxed break-words">{item.message}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-col sm:flex-row gap-2">
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
    </section>
  );
};

export default ReviewTestimonials;
