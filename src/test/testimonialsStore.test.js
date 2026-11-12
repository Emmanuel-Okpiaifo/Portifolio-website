import { afterEach, describe, expect, it, vi } from "vitest";
import { loadApprovedTestimonials, submitTestimonial } from "../lib/testimonialsStore";

const csv = [
  "status,sort_order,created_at,first_name,last_name,role,company,relationship,linkedin_url,message,photo_url",
  'approved,2,2026-10-27,Eniola,Oyewole,Content and Editorial Supervisor,NerdzFactory Company,,,"Working with him.",',
  "pending,3,2026-11-12,Form,Check,Tester,Portfolio,Other,,Hidden note,",
  'approved,1,2026-10-25,Adeola,Ayanda,"Brand, Marketing and Communications Lead",NerdzFactory Company Limited,,,"He takes ownership.",http://insecure.example/photo.jpg',
].join("\n");

const entry = {
  firstName: "Ada",
  lastName: "Okonkwo",
  message: "A useful note.",
  role: "Designer",
  company: "Studio",
  relationship: "Colleague",
  linkedinUrl: "",
  photoUrl: "",
  consent: true,
};

describe("testimonials store", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("reads approved rows in sort order and drops insecure photos", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response(csv, { status: 200 })));

    const result = await loadApprovedTestimonials();

    expect(result.source).toBe("sheet");
    expect(result.items.map((item) => item.firstName)).toEqual(["Adeola", "Eniola"]);
    expect(result.items[0].photo).toBe("");
    expect(result.items[0].createdAt).toBe("2026-10-25T12:00:00");
    expect(result.items.some((item) => item.firstName === "Form")).toBe(false);
  });

  it("falls back when the sheet cannot be read", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response("", { status: 403 })));

    const result = await loadApprovedTestimonials();

    expect(result.source).toBe("saved");
    expect(result.items.map((item) => `${item.firstName} ${item.lastName}`)).toEqual([
      "Adeola Ayanda",
      "Eniola Oyewole",
    ]);
  });

  it("posts a pending-ready payload and rejects a private email-style link", async () => {
    const fetchMock = vi.fn(async () => new Response(""));
    vi.stubGlobal("fetch", fetchMock);

    await submitTestimonial({ ...entry, photoUrl: "https://images.example/ada.jpg" });

    const [url, options] = fetchMock.mock.calls[0];
    expect(url).toContain("script.google.com/macros/s/");
    expect(options.method).toBe("POST");
    expect(options.mode).toBe("no-cors");
    expect(JSON.parse(options.body)).toMatchObject({
      firstName: "Ada",
      lastName: "Okonkwo",
      photoUrl: "https://images.example/ada.jpg",
    });
    expect(options.body).not.toMatch(/email/i);

    await expect(submitTestimonial({ ...entry, linkedinUrl: "http://linkedin.com/in/ada" })).rejects.toThrow(/https:\/\//);
    await expect(submitTestimonial({ ...entry, consent: false })).rejects.toThrow(/Consent/);
    await expect(submitTestimonial({ ...entry, relationship: "Friend" })).rejects.toThrow(/required field/);
  });
});
