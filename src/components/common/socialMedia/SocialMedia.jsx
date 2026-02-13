import { faLinkedin, faGithub } from "@fortawesome/free-brands-svg-icons";
import { faLink } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { profile } from "../../../data/profile";

const iconMap = {
  link: faLink,
  linkedin: faLinkedin,
  github: faGithub,
};

const SocialMedia = () => {
  const links = profile.social.filter((s) => iconMap[s.icon] != null);
  return links.map((item, index) => (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`text-picto-primary hover:bg-picto-primary p-2 pt-3 xs:p-2.5 xs:pt-3.75 sm:pt-4 md:pt-5 sm:p-3 md:p-3.75 hover:text-white rounded-md`}
      key={index}
      aria-label={item.name}
    >
      <FontAwesomeIcon
        icon={iconMap[item.icon]}
        className={`text-xl w-4.5 aspect-square`}
      />
    </a>
  ));
};

export default SocialMedia;
