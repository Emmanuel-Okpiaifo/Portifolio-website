import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryRouter, MemoryRouter, RouterProvider } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Contact from "../components/contact/Contact";
import LeaveTestimonial from "../pages/LeaveTestimonial";
import { NotFound } from "../pages/NotFound";
import ReviewTestimonials from "../pages/ReviewTestimonials";
import { appRoutes } from "../routes/Router";

const sheetCsv = [
  "status,sort_order,created_at,first_name,last_name,role,company,message,photo_url",
  'approved,1,2026-10-25,Adeola,Ayanda,Lead,NerdzFactory Company Limited,"He takes ownership.",',
  'approved,2,2026-10-27,Eniola,Oyewole,Supervisor,NerdzFactory Company,"He brings useful ideas.",',
].join("\n");

const renderAt = (path) => {
  const memoryRouter = createMemoryRouter(appRoutes, { initialEntries: [path] });
  return render(<RouterProvider router={memoryRouter} />);
};

describe("website", () => {
  afterEach(() => {
    cleanup();
  });

  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response(sheetCsv, { status: 200, headers: { "Content-Type": "text/csv" } }))
    );
  });

  it("renders every homepage section with working actions", async () => {
    renderAt("/");

    expect(await screen.findByRole("link", { name: "Skip to content" }, { timeout: 8000 })).toHaveAttribute("href", "#main-content");
    expect(document.getElementById("main-content")).toBeTruthy();

    const hero = document.getElementById("introduction");
    expect(await screen.findByRole("heading", { name: /Emmanuel Okpiaifo/ })).toBeInTheDocument();
    expect(within(hero).getByRole("link", { name: /Download Resume/ })).toHaveAttribute("download", "Emmanuel_Okpiaifo_Resume_Full_Stack.pdf");
    expect(within(hero).getByRole("link", { name: "LinkedIn" })).toHaveAttribute("href", "https://www.linkedin.com/in/emmanuel-okpiaifo");
    expect(within(hero).getByRole("link", { name: "GitHub" })).toHaveAttribute("href", "https://github.com/Emmanuel-Okpiaifo");
    expect(within(hero).getByText("9")).toBeInTheDocument();
    expect(within(hero).getByText("Key Projects")).toBeInTheDocument();

    for (const id of ["introduction", "profile", "experience", "portfolio", "skills", "services", "testimonials", "contact"]) {
      expect(document.getElementById(id)).toBeTruthy();
    }

    expect(screen.getByRole("heading", { name: "Technology Associate" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Technology and Design Intern" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Web Developer Intern" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Project Manager" })).toBeInTheDocument();
    expect(screen.getByText("NerdzFactory Company, Lagos, Nigeria (Hybrid)")).toBeInTheDocument();
    expect(screen.getByText("Crawford University, Ogun State, Nigeria")).toBeInTheDocument();
    expect(screen.getByText("Second Class Upper · Nov 2020 – Nov 2024")).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: "View Project" })).toHaveLength(9);
    expect(screen.queryByText(/Problem\./)).not.toBeInTheDocument();
    expect(document.querySelectorAll("#contact")).toHaveLength(1);
    expect(document.getElementById("skills").textContent).toContain("Apache shared hosting / DNS troubleshooting");
    expect(screen.getAllByRole("img", { name: /logo$/ })).toHaveLength(12);

    expect(await screen.findByText("Adeola Ayanda", {}, { timeout: 8000 })).toBeInTheDocument();
    expect(screen.getByText("Eniola Oyewole")).toBeInTheDocument();
    expect(screen.queryByText(/could not be loaded/i)).not.toBeInTheDocument();

    const footer = screen.getByRole("contentinfo");
    for (const name of ["Home", "About", "Experience", "Portfolio", "Skills", "Services", "Testimonials", "Contact", "Leave a testimonial"]) {
      expect(within(footer).getByRole("link", { name })).toBeInTheDocument();
    }
  });

  it("opens a prefilled email from the contact form", async () => {
    const user = userEvent.setup();
    const assigned = [];
    delete window.location;
    window.location = {
      set href(value) {
        assigned.push(value);
      },
      get href() {
        return assigned.at(-1) || "http://localhost/";
      },
    };

    render(<Contact />);
    await user.type(screen.getByRole("textbox", { name: "Name" }), "Ada Okonkwo");
    await user.type(screen.getByRole("textbox", { name: "Email" }), "ada@example.com");
    await user.type(screen.getByRole("textbox", { name: "Subject" }), "Hello");
    await user.type(screen.getByRole("textbox", { name: "Message" }), "I would like to work together.");
    await user.click(screen.getByRole("button", { name: "Send Message" }));

    expect(assigned[0]).toContain("mailto:emmaokpiaifo@gmail.com");
    expect(decodeURIComponent(assigned[0])).toContain("Ada Okonkwo");
    expect(screen.getByText(/email app should open/i)).toBeInTheDocument();
    const phone = screen.getByRole("link", { name: "(+234) 9160852509" });
    const whatsapp = screen.getByRole("link", { name: /Chat on WhatsApp/ });
    expect(phone).toHaveAttribute("href", "tel:+2349160852509");
    expect(whatsapp).toHaveAttribute("href", "https://wa.me/2349160852509");
    expect(phone.contains(whatsapp)).toBe(false);
  });

  it("shows a calm empty state when testimonials cannot be loaded", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response("", { status: 403 })));
    renderAt("/");

    expect(await screen.findByText("No testimonials to show yet.", {}, { timeout: 8000 })).toBeInTheDocument();
    expect(screen.queryByText(/could not be loaded/i)).not.toBeInTheDocument();
    expect(screen.queryByText("Adeola Ayanda")).not.toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: "Leave a testimonial" }).some((link) => link.getAttribute("href") === "/leave-a-testimonial")).toBe(true);
  });

  it("opens the mobile menu and scrolls to a section", async () => {
    const user = userEvent.setup();
    renderAt("/");
    await screen.findByRole("link", { name: "Skip to content" }, { timeout: 8000 });

    await user.click(screen.getByRole("button", { name: "Open menu" }));
    const menu = screen.getByRole("button", { name: "Close menu" });
    expect(menu).toHaveAttribute("aria-expanded", "true");
    await user.click(screen.getAllByRole("link", { name: "Skills" }).at(-1));
    expect(document.getElementById("skills")).toBeTruthy();
  });

  it("saves a leave-a-testimonial note and explains that it waits for approval", async () => {
    const user = userEvent.setup();
    render(<LeaveTestimonial />);

    expect(await screen.findByRole("heading", { name: "Share your experience" }, { timeout: 8000 })).toBeInTheDocument();
    await user.type(screen.getByLabelText("First name"), "Ada");
    await user.type(screen.getByLabelText("Last name"), "Okonkwo");
    await user.type(screen.getByLabelText("Role"), "Designer");
    await user.type(screen.getByLabelText("Company"), "Studio");
    await user.selectOptions(screen.getByLabelText(/How do you know Emmanuel/), "Colleague");
    await user.type(screen.getByLabelText("Testimonial"), "He shipped the work carefully.");
    await user.click(screen.getByRole("checkbox"));
    await user.click(screen.getByRole("button", { name: "Send testimonial" }));

    expect(await screen.findByText("Note saved")).toBeInTheDocument();
    const post = vi.mocked(fetch).mock.calls.find((call) => call[1]?.method === "POST");
    expect(post?.[0]).toContain("script.google.com/macros");
    expect(JSON.parse(post[1].body).message).toBe("He shipped the work carefully.");
  });

  it("shows the review page and a not-found page", async () => {
    render(<ReviewTestimonials />);
    expect(screen.getByRole("heading", { name: "Review testimonials" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Open the sheet" })).toHaveAttribute("href", expect.stringContaining("1gp6ye5d8zjqAIXkHqXMJlOXphTy-Rz9NAskGUU--4gU"));
    expect(await screen.findByText("Adeola Ayanda")).toBeInTheDocument();

    cleanup();
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>
    );
    expect(screen.getByRole("heading", { name: "This page is not on the site" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Back home" })).toHaveAttribute("href", "/");
  });
});
