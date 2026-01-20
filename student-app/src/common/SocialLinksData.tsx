import { BiLogoDiscord, BiLogoFacebook, BiLogoInstagram, BiLogoLinkedin, BiLogoReddit, BiLogoTwitter, BiLogoYoutube } from "react-icons/bi";

export const SOCIAL_LINKS_DATA = {
    facebook: {
        label: "Facebook",
        icon: <BiLogoFacebook size={22} />,
        color: "text-blue-600 bg-blue-50 border-blue-200",
        placeholder: "https://facebook.com/username",
    },
    linkedin: {
        label: "LinkedIn",
        icon: <BiLogoLinkedin size={22} />,
        color: "text-blue-700 bg-blue-50 border-blue-200",
        placeholder: "https://linkedin.com/in/username",
    },
    instagram: {
        label: "Instagram",
        icon: <BiLogoInstagram size={22} />,
        color: "text-pink-600 bg-pink-50 border-pink-200",
        placeholder: "https://instagram.com/username",
    },
    twitterx: {
        label: "Twitter / X",
        icon: <BiLogoTwitter size={22} />,
        color: "text-gray-800 bg-gray-50 border-gray-300",
        placeholder: "https://twitter.com/username",
    },
    youtube: {
        label: "YouTube",
        icon: <BiLogoYoutube size={22} />,
        color: "text-red-600 bg-red-50 border-red-200",
        placeholder: "https://youtube.com/c/channel",
    },
    reddit: {
        label: "Reddit",
        icon: <BiLogoReddit size={22} />,
        color: "text-orange-600 bg-orange-50 border-orange-200",
        placeholder: "https://reddit.com/user/username",
    },
    discord: {
        label: "Discord",
        icon: <BiLogoDiscord size={22} />,
        color: "text-indigo-600 bg-indigo-50 border-indigo-200",
        placeholder: "https://discord.gg/invite",
    },
}