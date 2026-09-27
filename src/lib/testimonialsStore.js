import { getSupabase, isSupabaseConfigured } from "./supabaseClient";

const BUCKET = "testimonial-photos";
const MAX_NAME = 40;
const MAX_MESSAGE = 600;

const cleanText = (value, max) =>
  String(value ?? "")
    .replace(/[\u0000-\u001F\u007F]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);

const requireClient = () => {
  const supabase = getSupabase();
  if (!supabase) {
    throw new Error("Testimonials are not connected yet. Add the Supabase keys and try again.");
  }
  return supabase;
};

const friendlyError = (error, fallback) => {
  const message = error?.message || "";
  if (/row-level security|permission|not authorized/i.test(message)) {
    return "That action is not allowed.";
  }
  if (/payload too large|exceeded|file size/i.test(message)) {
    return "That photo is larger than 2 MB after it is prepared. Choose a smaller one.";
  }
  if (/sort_order/i.test(message)) {
    return "Run the updated supabase/setup-testimonials.sql once so the order can be saved.";
  }
  return fallback;
};

export const photoUrl = (path) => {
  const supabase = getSupabase();
  if (!supabase || !path) return "";
  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
};

const toCard = (row) => ({
  id: row.id,
  firstName: row.first_name,
  lastName: row.last_name,
  message: row.message,
  photo: photoUrl(row.photo_path),
  photoPath: row.photo_path,
  status: row.status,
  sortOrder: row.sort_order ?? 0,
  createdAt: row.created_at,
  role: row.role || "",
  company: row.company || "",
  relationship: row.relationship || "",
  linkedinUrl: row.linkedin_url || "",
  email: row.email || "",
  consent: row.consent === true,
});

export const loadApprovedTestimonials = async () => {
  if (!isSupabaseConfigured()) return [];
  const supabase = requireClient();
  const { data, error } = await supabase
    .from("testimonials_public")
    .select("id, first_name, last_name, message, photo_path, status, sort_order, created_at, role, company, relationship, linkedin_url")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) throw new Error(friendlyError(error, "Testimonials could not be loaded."));
  return (data ?? []).map(toCard);
};

const RELATIONSHIPS = new Set(["Colleague", "Manager", "Client", "Mentee", "Other"]);

export const submitTestimonial = async ({
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
}) => {
  const supabase = requireClient();
  const entry = {
    firstName: cleanText(firstName, MAX_NAME),
    lastName: cleanText(lastName, MAX_NAME),
    message: cleanText(message, MAX_MESSAGE),
    role: cleanText(role, 80),
    company: cleanText(company, 80),
    relationship: cleanText(relationship, 40),
    linkedinUrl: cleanText(linkedinUrl, 200),
    email: cleanText(email, 120),
  };

  if (!entry.firstName || !entry.lastName || !entry.message || !entry.role || !entry.company || !RELATIONSHIPS.has(entry.relationship)) {
    throw new Error("Please complete every required field before submitting.");
  }
  if (!consent) {
    throw new Error("Consent is required before this note can be sent.");
  }
  if (entry.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(entry.email)) {
    throw new Error("That email address does not look valid.");
  }

  let photoPath = null;
  if (photoBlob) {
    if (photoBlob.size > 2 * 1024 * 1024) {
      throw new Error("That photo is larger than 2 MB after it is prepared. Choose a smaller one.");
    }
    photoPath = `${crypto.randomUUID()}.jpg`;
    const { error: uploadError } = await supabase.storage.from(BUCKET).upload(photoPath, photoBlob, {
      contentType: "image/jpeg",
      upsert: false,
    });
    if (uploadError) {
      throw new Error(friendlyError(uploadError, "The profile photo could not be uploaded."));
    }
  }

  const { error } = await supabase.from("testimonials").insert({
    first_name: entry.firstName,
    last_name: entry.lastName,
    message: entry.message,
    photo_path: photoPath,
    status: "pending",
    role: entry.role,
    company: entry.company,
    relationship: entry.relationship,
    linkedin_url: entry.linkedinUrl || null,
    email: entry.email || null,
    consent: true,
  });

  if (error) {
    if (photoPath) await supabase.storage.from(BUCKET).remove([photoPath]);
    throw new Error(friendlyError(error, "Your testimonial could not be sent."));
  }
};

export const loadReviewTestimonials = async () => {
  const supabase = requireClient();
  const { data, error } = await supabase
    .from("testimonials")
    .select("id, first_name, last_name, message, photo_path, status, sort_order, created_at, role, company, relationship, linkedin_url, email, consent")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) throw new Error(friendlyError(error, "Testimonials could not be loaded."));
  return (data ?? []).map(toCard);
};

export const setTestimonialStatus = async (id, status) => {
  const supabase = requireClient();
  const { error } = await supabase.from("testimonials").update({ status }).eq("id", id);
  if (error) throw new Error(friendlyError(error, "That testimonial could not be updated."));
};

export const saveTestimonialOrder = async (orderedIds) => {
  const supabase = requireClient();
  const results = await Promise.all(
    orderedIds.map((id, index) =>
      supabase.from("testimonials").update({ sort_order: index + 1 }).eq("id", id)
    )
  );
  const failed = results.find((result) => result.error);
  if (failed?.error) throw new Error(friendlyError(failed.error, "The order could not be saved."));
};

export const deleteTestimonial = async (id, photoPath) => {
  const supabase = requireClient();
  const { error } = await supabase.from("testimonials").delete().eq("id", id);
  if (error) throw new Error(friendlyError(error, "That testimonial could not be removed."));
  if (photoPath) await supabase.storage.from(BUCKET).remove([photoPath]);
};

export const compressProfileImage = (file) =>
  new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error("Add a profile photo."));
      return;
    }
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      reject(new Error("Use a JPG, PNG, or WEBP photo."));
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      reject(new Error("That photo is too large to prepare. Choose one under 10 MB; it is saved at 2 MB or less."));
      return;
    }

    const image = new Image();
    const objectUrl = URL.createObjectURL(file);
    image.onload = () => {
      const maxEdge = 480;
      const scale = Math.min(1, maxEdge / Math.max(image.width, image.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(image.width * scale));
      canvas.height = Math.max(1, Math.round(image.height * scale));
      const context = canvas.getContext("2d");
      if (!context) {
        URL.revokeObjectURL(objectUrl);
        reject(new Error("This photo could not be prepared. Try another one."));
        return;
      }
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(objectUrl);
      const toJpeg = (quality, done) => {
        canvas.toBlob((blob) => done(blob), "image/jpeg", quality);
      };
      toJpeg(0.82, (blob) => {
        if (!blob) {
          reject(new Error("This photo could not be prepared. Try another one."));
          return;
        }
        if (blob.size <= 900 * 1024) {
          resolve(blob);
          return;
        }
        toJpeg(0.6, (smaller) => {
          if (!smaller) {
            reject(new Error("This photo could not be prepared. Try another one."));
            return;
          }
          resolve(smaller);
        });
      });
    };
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("This photo could not be opened. Try another one."));
    };
    image.src = objectUrl;
  });
