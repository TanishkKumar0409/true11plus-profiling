import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
    BiX,
    BiCopy,
    BiCheck,
    BiLinkAlt,
    BiLogoGmail
} from "react-icons/bi";
import {
    BsWhatsapp,
    BsLinkedin,
    BsTwitterX,
    BsFacebook,
} from "react-icons/bs";

interface SharePostModalProps {
    isOpen: boolean;
    onClose: () => void;
    postUrl: string;
}

export default function SharePostModal({ isOpen, onClose, postUrl }: SharePostModalProps) {
    const [copied, setCopied] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
            document.body.style.overflow = "hidden";
        } else {
            const timer = setTimeout(() => setIsVisible(false), 200);
            document.body.style.overflow = "unset";
            return () => clearTimeout(timer);
        }
        return () => { document.body.style.overflow = "unset"; };
    }, [isOpen]);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(postUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy", err);
        }
    };

    const subject = encodeURIComponent("Check out this post");
    const body = encodeURIComponent(`Here is an interesting post I found: ${postUrl}`);

    const getGmailLink = () => `https://mail.google.com/mail/?view=cm&fs=1&tf=1&su=${subject}&body=${body}`;

    const shareLinks = [
        {
            name: "WhatsApp",
            icon: <BsWhatsapp size={24} />,
            bg: "bg-[#25D366]/10",
            text: "text-[#25D366]",
            hover: "hover:bg-[#25D366] hover:text-white",
            url: `https://wa.me/?text=${encodeURIComponent(postUrl)}`
        },
        {
            name: "LinkedIn",
            icon: <BsLinkedin size={24} />,
            bg: "bg-[#0077b5]/10",
            text: "text-[#0077b5]",
            hover: "hover:bg-[#0077b5] hover:text-white",
            url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}`
        },
        {
            name: "X (Twitter)",
            icon: <BsTwitterX size={22} />,
            bg: "bg-black/5",
            text: "text-black",
            hover: "hover:bg-black hover:text-white",
            url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(postUrl)}`
        },
        {
            name: "Facebook",
            icon: <BsFacebook size={24} />,
            bg: "bg-[#1877F2]/10",
            text: "text-[#1877F2]",
            hover: "hover:bg-[#1877F2] hover:text-white",
            url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`
        },
        {
            name: "Gmail",
            icon: <BiLogoGmail size={24} />,
            bg: "bg-[#EA4335]/10",
            text: "text-[#EA4335]",
            hover: "hover:bg-[#EA4335] hover:text-white",
            url: getGmailLink()
        },
    ];

    if (!isOpen && !isVisible) return null;

    return createPortal(
        <div
            className={`fixed inset-0 z-[9999] flex items-end sm:items-center justify-center transition-all duration-300 ${isOpen ? "bg-black/60 backdrop-blur-sm opacity-100" : "bg-transparent opacity-0 pointer-events-none"
                }`}
            onClick={onClose}
        >
            <div
                className={`bg-white w-full sm:max-w-lg sm:rounded-3xl rounded-t-3xl shadow-2xl overflow-hidden flex flex-col transition-all duration-300 transform ${isOpen ? "translate-y-0 scale-100" : "translate-y-full sm:translate-y-10 sm:scale-95"
                    }`}
                onClick={(e) => e.stopPropagation()}
            >

                {/* Header */}
                <div className="relative pt-6 px-6 pb-2 text-center">
                    <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto mb-4 sm:hidden"></div>
                    <h3 className="text-xl font-bold text-gray-900">Share to</h3>
                    <button
                        onClick={onClose}
                        className="absolute top-5 right-5 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <BiX size={24} />
                    </button>
                </div>

                <div className="p-6 space-y-8">
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-y-6 gap-x-2">
                        {shareLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex flex-col items-center gap-2 group cursor-pointer"
                            >
                                <div
                                    className={`w-14 h-14 flex items-center justify-center rounded-2xl transition-all duration-300 shadow-sm group-hover:shadow-md group-hover:-translate-y-1 ${link.bg} ${link.text} ${link.hover}`}
                                >
                                    {link.icon}
                                </div>
                                <span className="text-[11px] font-medium text-gray-500 group-hover:text-gray-900 transition-colors">
                                    {link.name}
                                </span>
                            </a>
                        ))}
                    </div>

                    {/* Copy Link Section */}
                    <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                        <div className="flex items-center gap-2 mb-2">
                            <BiLinkAlt className="text-gray-400" />
                            <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Page Link</span>
                        </div>

                        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl p-1.5 pl-3 shadow-sm focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                            <input
                                type="text"
                                readOnly
                                value={postUrl}
                                className="flex-1 bg-transparent border-none focus:ring-0 text-sm text-gray-600 truncate font-medium"
                            />
                            <button
                                onClick={handleCopy}
                                className={`flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 ${copied
                                    ? "bg-green-500 text-white shadow-md scale-95"
                                    : "bg-gray-900 text-white hover:bg-gray-800 hover:shadow-lg"
                                    }`}
                            >
                                {copied ? <BiCheck size={18} /> : <BiCopy size={18} />}
                                {copied ? "Copied" : "Copy"}
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>,
        document.body
    );
}