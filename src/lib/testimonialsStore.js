export const TESTIMONIALS_SHEET_ID = "1gp6ye5d8zjqAIXkHqXMJlOXphTy-Rz9NAskGUU--4gU";
export const TESTIMONIALS_SHEET_URL = `https://docs.google.com/spreadsheets/d/${TESTIMONIALS_SHEET_ID}/edit?gid=916104802#gid=916104802`;

const SHEET_CSV_URL = `https://docs.google.com/spreadsheets/d/${TESTIMONIALS_SHEET_ID}/gviz/tq?tqx=out:csv&gid=916104802`;
const SHEET_WEBAPP_URL = "https://script.google.com/macros/s/AKfycbz-SsTMrsyrUBaRh-4dxOh4kibkshIuPDvx6H5yrEKBXPB2k54YB8hklCGqab8rpiQ4/exec";

const MAX_NAME = 40;
const MAX_MESSAGE = 600;
const RELATIONSHIPS = new Set(["Colleague", "Manager", "Client", "Mentee", "Other"]);

const SAVED_TESTIMONIALS = [
  {
    id: "adeola-ayanda-2026-10-25",
    firstName: "Adeola",
    lastName: "Ayanda",
    message:
      "Emmanuel thinks ahead and takes initiative without always needing to be asked. He is quick to identify potential problems and find creative, practical ways to solve them. He is reliable, resourceful, and always willing to step up when the team needs support. Working with him has shown me how much of a difference it makes to have someone who takes ownership of his work and is always looking for better ways to get things done.",
    photo: "",
    status: "approved",
    sortOrder: 1,
    createdAt: "2026-10-25T12:00:00",
    role: "Brand, Marketing and Communications Lead",
    company: "NerdzFactory Company Limited",
  },
  {
    id: "eniola-oyewole-2026-10-27",
    firstName: "Eniola",
    lastName: "Oyewole",
    message:
      "Working with him on website projects has been a good experience. He is smart, creative, and always brings useful ideas to the table. I appreciate how he approaches his work and finds ways to make things better.",
    photo: "",
    status: "approved",
    sortOrder: 2,
    createdAt: "2026-10-27T12:00:00",
    role: "Content and Editorial Supervisor",
    company: "NerdzFactory Company",
  },
];

const cleanText = (value, max) =>
  String(value ?? "")
    .replace(/[\u0000-\u001F\u007F]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);

const parseCsv = (text) => {
  const rows = [];
  let row = [];
  let cell = "";
  let quoted = false;
  const source = String(text ?? "").replace(/^\uFEFF/, "");

  for (let i = 0; i < source.length; i += 1) {
    const char = source[i];
    if (quoted) {
      if (char === '"') {
        if (source[i + 1] === '"') {
          cell += '"';
          i += 1;
        } else {
          quoted = false;
        }
      } else {
        cell += char;
      }
      continue;
    }
    if (char === '"') {
      quoted = true;
    } else if (char === ",") {
      row.push(cell);
      cell = "";
    } else if (char === "\n") {
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
    } else if (char !== "\r") {
      cell += char;
    }
  }

  if (cell || row.length) {
    row.push(cell);
    rows.push(row);
  }

  return rows.filter((entry) => entry.some((value) => value.trim()));
};

const createdAtValue = (value) => {
  const raw = String(value ?? "").trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return `${raw}T12:00:00`;
  return raw;
};

const rowsToCards = (text) => {
  const table = parseCsv(text);
  const headers = (table[0] ?? []).map((header) => header.trim().toLowerCase());
  if (!headers.includes("status") || !headers.includes("message")) {
    throw new Error("The testimonials sheet could not be read.");
  }

  const indexOf = (name) => headers.indexOf(name);
  const cell = (row, name) => row[indexOf(name)]?.trim() ?? "";

  return table
    .slice(1)
    .map((row) => {
      const firstName = cell(row, "first_name");
      const lastName = cell(row, "last_name");
      const createdAt = createdAtValue(cell(row, "created_at"));
      const photo = cell(row, "photo_url");
      return {
        id: `${firstName}-${lastName}-${createdAt}`.toLowerCase().replace(/\s+/g, "-"),
        firstName,
        lastName,
        message: cell(row, "message"),
        photo: /^https:\/\//i.test(photo) ? photo : "",
        status: cell(row, "status").toLowerCase(),
        sortOrder: Number(cell(row, "sort_order")) || 0,
        createdAt,
        role: cell(row, "role"),
        company: cell(row, "company"),
      };
    })
    .filter((item) => item.status === "approved" && item.firstName && item.lastName && item.message)
    .sort((a, b) => a.sortOrder - b.sortOrder || String(a.createdAt).localeCompare(String(b.createdAt)));
};

export const loadApprovedTestimonials = async () => {
  try {
    const response = await fetch(SHEET_CSV_URL, { cache: "no-store" });
    if (!response.ok) throw new Error("The testimonials sheet could not be read.");
    const text = await response.text();
    if (!text.trim()) return { items: SAVED_TESTIMONIALS, source: "empty" };
    const items = rowsToCards(text);
    return { items, source: "sheet" };
  } catch {
    return { items: SAVED_TESTIMONIALS, source: "saved" };
  }
};

const httpsUrl = (value, max) => {
  const text = cleanText(value, max);
  if (!text) return "";
  if (!text.startsWith("https://")) {
    throw new Error("Optional links need to start with https://.");
  }
  return text;
};

export const submitTestimonial = async ({
  firstName,
  lastName,
  message,
  role,
  company,
  relationship,
  linkedinUrl,
  photoUrl,
  consent,
}) => {
  const entry = {
    firstName: cleanText(firstName, MAX_NAME),
    lastName: cleanText(lastName, MAX_NAME),
    message: cleanText(message, MAX_MESSAGE),
    role: cleanText(role, 80),
    company: cleanText(company, 80),
    relationship: cleanText(relationship, 40),
    linkedinUrl: httpsUrl(linkedinUrl, 200),
    photoUrl: httpsUrl(photoUrl, 300),
  };

  if (!entry.firstName || !entry.lastName || !entry.message || !entry.role || !entry.company || !RELATIONSHIPS.has(entry.relationship)) {
    throw new Error("Please complete every required field before submitting.");
  }
  if (!consent) {
    throw new Error("Consent is required before this note can be sent.");
  }

  await fetch(SHEET_WEBAPP_URL, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(entry),
  });
};
