import { BiLogoDiscord, BiLogoFacebook, BiLogoInstagram, BiLogoLinkedin, BiLogoReddit, BiLogoYoutube } from "react-icons/bi";
import { FaXTwitter } from "react-icons/fa6";

export const SOCIAL_CONFIG: Record<string, { icon: React.ReactNode; color: string; label: string }> = {
    facebook: { icon: <BiLogoFacebook size={20} />, color: "hover:text-blue-600 hover:bg-blue-50", label: "Facebook" },
    linkedin: { icon: <BiLogoLinkedin size={20} />, color: "hover:text-blue-700 hover:bg-blue-50", label: "LinkedIn" },
    instagram: { icon: <BiLogoInstagram size={20} />, color: "hover:text-pink-600 hover:bg-pink-50", label: "Instagram" },
    twitterx: { icon: <FaXTwitter size={20} />, color: "hover:text-black hover:bg-gray-100", label: "Twitter / X" },
    youtube: { icon: <BiLogoYoutube size={20} />, color: "hover:text-red-600 hover:bg-red-50", label: "YouTube" },
    reddit: { icon: <BiLogoReddit size={20} />, color: "hover:text-orange-600 hover:bg-orange-50", label: "Reddit" },
    discord: { icon: <BiLogoDiscord size={20} />, color: "hover:text-indigo-600 hover:bg-indigo-50", label: "Discord" },
};
