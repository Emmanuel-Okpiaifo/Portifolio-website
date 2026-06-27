import {
  faEnvelope,
  faLocationDot,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";
import Address from "./Address";
import Form from "./Form";
import SocialMedia from "../common/socialMedia/SocialMedia";
import AnimateOnScroll from "../common/animate/AnimateOnScroll";
import { profile } from "../../data/profile";

const iconMap = {
  Address: faLocationDot,
  "My Email": faEnvelope,
  "Call / WhatsApp": faPhone,
};

const Contact = () => {
  const { contact } = profile;
  const addressData = contact.address.map((item) => ({
    icon: iconMap[item.title] || faEnvelope,
    ...item,
  }));

  return (
    <section className="content px-4 sm:px-6" id="contact">
      <AnimateOnScroll animation="scale-in">
        <div className="bg-white rounded-2xl border border-stone-200 shadow-xl p-4 sm:p-6 md:p-10 lg:p-14 min-w-0">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-16 min-w-0">
            <AnimateOnScroll animation="slide-left" delay={100} className="min-w-0">
              <p className="section-eyebrow">Contact</p>
              <h2 className="font-display text-2xl xs:text-3xl sm:text-4xl font-semibold text-edo-charcoal text-balance">
                {contact.tagline}
              </h2>
              <p className="text-stone-600 mt-4 leading-relaxed text-sm sm:text-base">{contact.subtitle}</p>

              <div className="grid grid-cols-1 gap-4 sm:gap-5 mt-6 sm:mt-8">
                {addressData.map((item, index) => (
                  <AnimateOnScroll key={index} animation="fade-up" delay={150 + index * 80}>
                    <Address item={item} />
                  </AnimateOnScroll>
                ))}
              </div>

              <div className="mt-6 sm:mt-8 w-full min-w-0">
                <SocialMedia fullWidth className="max-lg:w-full" />
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll animation="slide-right" delay={150} className="min-w-0">
              <Form />
            </AnimateOnScroll>
          </div>
        </div>
      </AnimateOnScroll>
    </section>
  );
};

export default Contact;
