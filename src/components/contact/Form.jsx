import { useState } from "react";
import { profile } from "../../data/profile";

const INPUT_CLASS =
  "w-full min-w-0 max-w-full box-border border-0 border-b-2 border-stone-200 bg-transparent py-3 text-base text-edo-charcoal placeholder:text-stone-400 focus:border-edo-gold focus:outline-none transition-colors";

const Form = () => {
  const [submitted, setSubmitted] = useState(false);
  const recipient = profile.email;

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = data.get("name");
    const email = data.get("email");
    const location = data.get("location");
    const subject = data.get("subject");
    const message = data.get("message");

    const mailSubject = `[Portfolio] ${subject}`;
    const mailBody = [
      `Name: ${name}`,
      `Email: ${email}`,
      `Location: ${location}`,
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
        Fill out the form below — it will open your email app with a message addressed to{" "}
        <a href={`mailto:${recipient}`} className="text-edo-gold font-medium hover:underline break-all">
          {recipient}
        </a>
        .
      </p>

      {submitted && (
        <p className="mt-4 text-sm text-edo-gold font-medium" role="status">
          Your email app should open shortly. Send the pre-filled message to complete your inquiry.
        </p>
      )}

      <form className="flex flex-col gap-4 sm:gap-5 mt-6 w-full min-w-0 max-w-full" onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Name*" className={INPUT_CLASS} required />
        <input type="email" name="email" placeholder="Your email*" className={INPUT_CLASS} required autoComplete="email" />
        <input type="text" name="location" placeholder="Location*" className={INPUT_CLASS} required />
        <input type="text" name="subject" placeholder="Subject*" className={INPUT_CLASS} required />
        <textarea
          name="message"
          placeholder="Message*"
          rows={5}
          className={`${INPUT_CLASS} resize-y min-h-[8rem] max-w-full`}
          required
        />
        <button
          type="submit"
          className="btn btn-primary btn-touch btn-section w-full mt-1"
        >
          Send Message
        </button>
      </form>
    </div>
  );
};

export default Form;
