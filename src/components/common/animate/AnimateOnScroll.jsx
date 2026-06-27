import { useEffect, useRef, useState } from "react";

const getObserverOptions = () => {
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  return {
    threshold: isMobile ? 0.08 : 0.12,
    rootMargin: isMobile ? "0px 0px 4% 0px" : "0px 0px -4% 0px",
  };
};

const isInViewport = (el) => {
  const rect = el.getBoundingClientRect();
  const viewHeight = window.innerHeight || document.documentElement.clientHeight;
  return rect.top < viewHeight * 0.92 && rect.bottom > 0;
};

/**
 * Scroll-triggered reveal. Tuned for mobile viewports.
 */
const AnimateOnScroll = ({
  children,
  className = "",
  animation = "fade-up",
  delay = 0,
  as: Tag = "div",
  once = true,
}) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (isInViewport(el)) {
      setVisible(true);
      if (once) return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          if (once) observer.unobserve(el);
        } else if (!once) {
          setVisible(false);
        }
      },
      getObserverOptions()
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [once]);

  return (
    <Tag
      ref={ref}
      className={`reveal reveal-${animation} ${visible ? "reveal-visible" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
};

export default AnimateOnScroll;
