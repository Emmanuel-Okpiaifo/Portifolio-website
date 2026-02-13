import { profile } from "../../../data/profile";
import Logo from "../logo/Logo";

const navItems = [
  { id: 1, name: "Home", url: "introduction" },
  { id: 2, name: "About", url: "profile" },
  { id: 3, name: "Process", url: "work-process" },
  { id: 4, name: "Portfolio", url: "portfolio" },
  { id: 5, name: "Services", url: "services" },
  { id: 6, name: "Contact", url: "contact" },
];
const copyrightYear = new Date().getFullYear();

const Footer = () => {
  return (
    <div className="bg-[#2A374A]">
      <div className="pt-25 md:pt-40 content max-2xl:px-3">
        <div className="flex max-md:flex-col justify-between mx-0 items-center h-full w-full text-neutral-200">
          <a href="#introduction" className="flex items-center gap-3 border-0">
            <Logo variant="grayscaleTransparent" className="h-12 w-auto max-h-14 sm:h-14 sm:max-h-16 object-contain shrink-0 opacity-90" />
            <span className="text-2xl sm:text-[28px] font-semibold text-white">
              {profile.shortName}
            </span>
          </a>
          <div className="mx-7 max-md:my-7 text-center">
            {navItems.map((item) => (
              <a
                key={item.id}
                className="mx-2 group inline-block relative w-fit text-[12px] sm:text-[16px]"
                href={`#${item.url}`}
              >
                {item.name}
                <span className="absolute left-0 bottom-0 h-0.5 w-full bg-white scale-x-0 duration-300 group-hover:scale-x-100"></span>
              </a>
            ))}
          </div>
          <p className="text-[12px] sm:text-[16px]">
            Copyright &copy; {copyrightYear} {profile.name}.
          </p>
        </div>
        <p className="text-white text-center max-xs:text-[12px] max-md:text-[14px] w-full py-10">
          {profile.footer.credit}
        </p>
      </div>
    </div>
  );
};

export default Footer;
