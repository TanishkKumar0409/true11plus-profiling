import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { BiX, BiCopy, BiCheck, BiLinkAlt, BiLogoGmail } from "react-icons/bi";
import { BsWhatsapp, BsLinkedin, BsTwitterX, BsFacebook } from "react-icons/bs";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  postUrl: string;
}

export default function ShareModal({
  isOpen,
  onClose,
  postUrl,
}: ShareModalProps) {
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

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(postUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  const subject = encodeURIComponent("Check out this User");
  const body = encodeURIComponent(`Here is an interesting User: ${postUrl}`);

  const shareLinks = [
    {
      name: "WhatsApp",
      icon: <BsWhatsapp size={24} />,
      bg: "bg-[var(--success-subtle)]",
      text: "text-[var(--success)]",
      hover: "hover:bg-[var(--success)] hover:text-[var(--white)]",
      url: `https://wa.me/?text=${encodeURIComponent(postUrl)}`,
    },
    {
      name: "LinkedIn",
      icon: <BsLinkedin size={24} />,
      bg: "bg-[var(--hex-subtle)]",
      text: "text-[var(--hex)]",
      hover: "hover:bg-[var(--hex)] hover:text-[var(--white)]",
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        postUrl,
      )}`,
    },
    {
      name: "X (Twitter)",
      icon: <BsTwitterX size={22} />,
      bg: "bg-[var(--gray-subtle)]",
      text: "text-[var(--gray-emphasis)]  ",
      hover: "hover:bg-[var(--text-color-emphasis)] hover:text-[var(--white)]",
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(postUrl)}`,
    },
    {
      name: "Facebook",
      icon: <BsFacebook size={24} />,
      bg: "bg-[var(--blue-subtle)]",
      text: "text-[var(--blue)]",
      hover: "hover:bg-[var(--blue)] hover:text-[var(--white)]",
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        postUrl,
      )}`,
    },
    {
      name: "Gmail",
      icon: <BiLogoGmail size={24} />,
      bg: "bg-[var(--danger-subtle)]",
      text: "text-[var(--danger)]",
      hover: "hover:bg-[var(--danger)] hover:text-[var(--white)]",
      url: `https://mail.google.com/mail/?view=cm&fs=1&tf=1&su=${subject}&body=${body}`,
    },
  ];

  if (!isOpen && !isVisible) return null;

  return createPortal(
    <div
      className={`fixed inset-0 z-99999 flex items-end sm:items-center justify-center transition-all duration-300 ${
        isOpen
          ? "mobile-overlay backdrop-blur-sm opacity-100"
          : "bg-transparent opacity-0 pointer-events-none"
      }`}
      onClick={onClose}
    >
      {/* MODAL */}
      <div
        className={`bg-(--primary-bg) w-full sm:max-w-lg transition-all duration-300 transform rounded-custom p-6 ${
          isOpen
            ? "translate-y-0 scale-100"
            : "translate-y-full sm:translate-y-10 sm:scale-95"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="relative pb-6 text-start">
          <h3 className="font-bold">Share to</h3>
          <button
            onClick={onClose}
            className="absolute top-0 right-0 p-1 text-(--text-color) hover:text-(--main) hover:bg-(--main-subtle) rounded-custom"
          >
            <BiX size={24} />
          </button>
        </div>

        {/* CONTENT */}
        <div className="space-y-8">
          {/* SOCIAL LINKS */}
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-y-6">
            {shareLinks.map((link) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-2 group"
              >
                <div
                  className={`w-14 h-14 flex items-center justify-center transition-all duration-300 group-hover:-translate-y-1 shadow-custom rounded-custom ${link.bg} ${link.text} ${link.hover}`}
                >
                  {link.icon}
                </div>
                <p className="sub-paragraph">{link.name}</p>
              </a>
            ))}
          </div>

          {/* COPY LINK */}
          <div className="bg-(--secondary-bg) p-5 rounded-custom shadow-custom">
            <div className="flex items-center gap-1 mb-2 text-(--main)">
              <BiLinkAlt />
              <span className="text-xs font-bold  uppercase">Page Link</span>
            </div>

            <div className="flex items-center gap-2 bg-(--primary-bg) rounded-custom shadow-custom p-1">
              <input
                readOnly
                value={postUrl}
                className="flex-1 bg-transparent  truncate px-2 sub-paragraph"
              />
              <button
                onClick={handleCopy}
                className={`px-4 py-2 font-bold transition rounded-custom sub-paragraph ${
                  copied ? "bg-(--success)! btn-shine" : "btn-shine"
                }`}
              >
                {copied ? (
                  <>
                    <BiCheck className="inline mr-1" /> Copied
                  </>
                ) : (
                  <>
                    <BiCopy className="inline mr-1" /> Copy
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
