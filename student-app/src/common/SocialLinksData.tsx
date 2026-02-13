import {
  BiLogoDiscord,
  BiLogoFacebook,
  BiLogoInstagram,
  BiLogoLinkedin,
  BiLogoReddit,
  BiLogoYoutube,
} from "react-icons/bi";
import { BsTwitterX } from "react-icons/bs";

export const SOCIAL_LINKS_DATA = {
  facebook: {
    label: "Facebook",
    icon: <BiLogoFacebook size={22} />,
    color: "text-[var(--blue)] bg-[var(--blue-subtle)]",
    placeholder: "https://facebook.com/username",
  },
  linkedin: {
    label: "LinkedIn",
    icon: <BiLogoLinkedin size={22} />,
    color: "text-[var(--hex)] bg-[var(--hex-subtle)]",
    placeholder: "https://linkedin.com/in/username",
  },
  instagram: {
    label: "Instagram",
    icon: <BiLogoInstagram size={22} />,
    color: "text-[var(--pink)] bg-[var(--pink-subtle)]",
    placeholder: "https://instagram.com/username",
  },
  twitterx: {
    label: "Twitter / X",
    icon: <BsTwitterX size={22} />,
    color: "text-[var(--gray-emphasis)] bg-[var(--gray-subtle)]",
    placeholder: "https://twitter.com/username",
  },
  youtube: {
    label: "YouTube",
    icon: <BiLogoYoutube size={22} />,
    color: "text-[var(--danger)] bg-[var(--danger-subtle)]",
    placeholder: "https://youtube.com/c/channel",
  },
  reddit: {
    label: "Reddit",
    icon: <BiLogoReddit size={22} />,
    color: "text-[var(--orange)] bg-[var(--orange-subtle)]",
    placeholder: "https://reddit.com/user/username",
  },
  discord: {
    label: "Discord",
    icon: <BiLogoDiscord size={22} />,
    color: "text-[var(--indigo)] bg-[var(--indigo-subtle)]",
    placeholder: "https://discord.gg/invite",
  },
};
