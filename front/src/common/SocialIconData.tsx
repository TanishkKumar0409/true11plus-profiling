import { IconType } from "react-icons";
import {
  BiLogoDiscord,
  BiLogoFacebook,
  BiLogoInstagram,
  BiLogoLinkedin,
  BiLogoReddit,
  BiLogoYoutube,
} from "react-icons/bi";
import { FaXTwitter } from "react-icons/fa6";

export const SOCIAL_CONFIG: Record<
  string,
  { icon: IconType; color: string; label: string }
> = {
  facebook: {
    icon: BiLogoFacebook,
    color: "hover:text-blue-600 hover:bg-blue-50",
    label: "Facebook",
  },
  linkedin: {
    icon: BiLogoLinkedin,
    color: "hover:text-blue-700 hover:bg-blue-50",
    label: "LinkedIn",
  },
  instagram: {
    icon: BiLogoInstagram,
    color: "hover:text-pink-600 hover:bg-pink-50",
    label: "Instagram",
  },
  twitterx: {
    icon: FaXTwitter,
    color: "hover:text-black hover:bg-gray-100",
    label: "Twitter / X",
  },
  youtube: {
    icon: BiLogoYoutube,
    color: "hover:text-red-600 hover:bg-red-50",
    label: "YouTube",
  },
  reddit: {
    icon: BiLogoReddit,
    color: "hover:text-orange-600 hover:bg-orange-50",
    label: "Reddit",
  },
  discord: {
    icon: BiLogoDiscord,
    color: "hover:text-indigo-600 hover:bg-indigo-50",
    label: "Discord",
  },
};
