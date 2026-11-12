import { useState } from "react";
import { profile } from "../../data/profile";

const INPUT_CLASS =
  "w-full min-w-0 max-w-full box-border border-0 border-b-2 border-stone-200 bg-transparent py-3 text-base text-edo-charcoal placeholder:text-stone-600 focus:border-edo-gold focus:outline-none transition-colors";

const LABEL_CLASS = "block text-xs font-semibold uppercase tracking-wider text-stone-600";

const Form = () => {
  const [submitted, setSubmitted] = useState(false);
  const recipient = profile.email;

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = data.get("name");
    const email = data.get("email");
    const subject = data.get("subject");
    const message = data.get("message");

    const mailSubject = `[Portfolio] ${subject}`;
    const mailBody = [
      `Name: ${name}`,
      `Email: ${email}`,
      "",
      "Message:",
      message,
      "",
      "---",
      "Sent from your portfolio contact form.",
    ].join("\n");

    window.location.href = `mailto:${recipient}?subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(mailBody)}`;
    setSubmitted(true);
    e.currentTarget.reset();
  };

  return (
    <div className="w-full min-w-0 max-w-full">
      <p className="text-stone-600 text-sm sm:text-base leading-relaxed break-words">
        Fill out the form below. It will open your email app with a message addressed to{" "}
        <a href={`mailto:${recipient}`} className="text-edo-gold-ink font-medium hover:underline">
          {recipient.slice(0, recipient.indexOf("@") + 1)}
          <wbr />
          {recipient.slice(recipient.indexOf("@") + 1)}
        </a>
        .
      </p>

      {submitted && (
        <p className="mt-4 text-sm text-edo-gold font-medium" role="status">
          Your email app should open shortly. Send the pre-filled message to complete your inquiry.
        </p>
      )}

      <form className="flex flex-col gap-4 sm:gap-5 mt-6 w-full min-w-0 max-w-full" onSubmit={handleSubmit}>
        <label className="block min-w-0">
          <span className={LABEL_CLASS}>Name</span>
          <input id="contact-name" type="text" name="name" placeholder="Name*" className={INPUT_CLASS} required autoComplete="name" />
        </label>
        <label className="block min-w-0">
          <span className={LABEL_CLASS}>Email</span>
          <input id="contact-email" type="email" name="email" placeholder="Your email*" className={INPUT_CLASS} required autoComplete="email" />
        </label>
        <label className="block min-w-0">
          <span className={LABEL_CLASS}>Subject</span>
          <input id="contact-subject" type="text" name="subject" placeholder="Subject*" className={INPUT_CLASS} required />
        </label>
        <label className="block min-w-0">
          <span className={LABEL_CLASS}>Message</span>
          <textarea
            id="contact-message"
            name="message"
            placeholder="Message*"
            rows={5}
            className={`${INPUT_CLASS} resize-y min-h-[8rem] max-w-full`}
            required
          />
        </label>
        <button
          type="submit"
          className="btn btn-primary btn-touch btn-section w-full sm:w-auto sm:self-start mt-1"
        >
          Send Message
        </button>
      </form>
    </div>
  );
};

export default Form;
