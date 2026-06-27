const Roles = ({ role }) => {
  return (
    <div className="p-6 rounded-2xl bg-white border border-stone-200/80 hover:border-edo-gold/40 hover:shadow-md transition-all duration-300">
      <h3 className="font-display text-xl font-semibold text-edo-charcoal pb-3">
        {role?.title}
      </h3>
      <p className="text-sm text-stone-600 leading-relaxed">{role?.description}</p>
    </div>
  );
};

export default Roles;
