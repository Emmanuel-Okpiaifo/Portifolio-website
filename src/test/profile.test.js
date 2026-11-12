import { describe, expect, it } from "vitest";
import { profile, resumeFile } from "../data/profile";

const skillNames = profile.skills.categories.flatMap((category) => category.items);

describe("profile content", () => {
  it("identifies Emmanuel and the public contact details", () => {
    expect(profile.name).toBe("Emmanuel Okpiaifo");
    expect(profile.email).toBe("emmaokpiaifo@gmail.com");
    expect(profile.location).toBe("Lagos, Nigeria");
    expect(profile.whatsappUrl).toBe("https://wa.me/2349160852509");
    expect(profile.social.map((item) => item.url)).toEqual([
      "https://github.com/Emmanuel-Okpiaifo",
      "https://www.linkedin.com/in/emmanuel-okpiaifo",
    ]);
  });

  it("counts nine key projects and twelve partners", () => {
    expect(profile.stats.find((item) => item.title === "Key Projects")?.description).toBe("9");
    expect(profile.portfolio.projects).toHaveLength(9);
    expect(profile.partners.organizations).toHaveLength(12);
    expect(profile.stats.find((item) => item.title === "Partners")?.description).toBe("12");
  });

  it("keeps the two Get Set 4 Business cards separate, with no Problem line", () => {
    const titles = profile.portfolio.projects.map((project) => project.title);
    expect(titles).toContain("Get Set 4 Business (Applicants)");
    expect(titles).toContain("Get Set 4 Business (Facilitators & Mentors)");
    expect(new Set(profile.portfolio.projects.map((project) => project.link)).size).toBe(9);
    for (const project of profile.portfolio.projects) {
      expect(project.built).toBeTruthy();
      expect(project.result).toBeTruthy();
      expect(project.link).toMatch(/^https:\/\//);
      expect(JSON.stringify(project)).not.toMatch(/Problem\./);
    }
  });

  it("does not list Supabase as a skill and spaces the Apache pill", () => {
    expect(skillNames.join(" ")).not.toMatch(/supabase/i);
    expect(skillNames).toContain("Apache shared hosting / DNS troubleshooting");
  });

  it("points the resume download at the full-stack PDF", () => {
    expect(resumeFile.href).toBe("/Emmanuel_Okpiaifo_Resume_Full_Stack.pdf?v=fullstack");
    expect(resumeFile.download).toBe("Emmanuel_Okpiaifo_Resume_Full_Stack.pdf");
  });
});
