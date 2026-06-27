const InformationSummary = ({ item, dark = false }) => {
  return (
    <div
      className={`rounded-xl text-center border ${
        dark
          ? "bg-white/5 border-edo-gold/20 backdrop-blur-sm"
          : "bg-edo-stone border-stone-200"
      }`}
    >
      <div className="px-1.5 py-3 xs:px-2 xs:py-4 sm:py-5">
        <p
          className={`text-lg xs:text-xl sm:text-2xl font-semibold leading-none ${
            dark ? "text-edo-gold" : "text-edo-charcoal"
          }`}
        >
          {item.description}
        </p>
        <p
          className={`text-[9px] xs:text-[10px] sm:text-xs font-medium uppercase tracking-wide xs:tracking-wider mt-1.5 leading-tight ${
            dark ? "text-edo-cream/60" : "text-stone-500"
          }`}
        >
          {item.title}
        </p>
      </div>
    </div>
  );
};

export default InformationSummary;
