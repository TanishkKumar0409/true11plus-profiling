import { SOCIAL_CONFIG } from "@/common/SocialIconData";
import { motion } from "framer-motion";
import { API } from "@/contexts/API";
import { getErrorResponse } from "@/contexts/Callbacks";
import { UserProps } from "@/types/UserProps";
import ContactInfoSkeleton from "@/ui/loading/components/profile/ContactInfoSkeleton";
import React, { useCallback, useEffect, useState } from "react";
import { BiGlobe, BiEnvelope, BiPhone } from "react-icons/bi";

export default function ContactInfo({ user }: { user: UserProps | null }) {
  const [socialLinks, setSocialLinks] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  const getSocialLinks = useCallback(async () => {
    if (!user?._id) return;
    setLoading(true);
    try {
      const response = await API.get(`user/social-links/${user._id}`);
      setSocialLinks(response.data);
    } catch (error) {
      getErrorResponse(error, true);
    } finally {
      setLoading(false);
    }
  }, [user?._id]);

  useEffect(() => {
    getSocialLinks();
  }, [getSocialLinks]);

  if (loading) return <ContactInfoSkeleton />;

  return (
    <div className="bg-(--primary-bg) rounded-custom overflow-hidden shadow-custom">
      <div className="px-5 pt-3">
        <h3 className="font-semibold text-(--text-color)">
          Contact Information
        </h3>
      </div>
      <div className="p-5 space-y-5">
        <div className="space-y-4">
          {user?.email && (
            <div className="flex items-center gap-3 group">
              <div className="p-1.5 bg-(--main-subtle) text-(--main) rounded-custom">
                <BiEnvelope size={18} />
              </div>
              <div className="overflow-hidden">
                <p className="font-medium sub-paragraph uppercase">
                  Email Address
                </p>
                <a
                  href={`mailto:${user?.email}`}
                  className="text-sm text-(--text-color) hover:text-(--main) truncate block transition-colors"
                >
                  {user?.email}
                </a>
              </div>
            </div>
          )}

          {user?.mobile_no && (
            <div className="flex items-center gap-3 group">
              <div className="p-1.5 bg-(--success-subtle) text-(--success) rounded-custom">
                <BiPhone size={18} />
              </div>
              <div>
                <p className="sub-paragraph font-medium uppercase">
                  Mobile Number
                </p>
                <a
                  href={`tel:${user?.mobile_no}`}
                  className="text-sm text-(--text-color) hover:text-(--success) transition-colors"
                >
                  {user?.mobile_no}
                </a>
              </div>
            </div>
          )}

          {user?.website && (
            <div className="flex items-center gap-3 group">
              <div className="p-1.5 bg-(--blue-subtle) text-(--blue) rounded-custom">
                <BiGlobe size={18} />
              </div>
              <div className="overflow-hidden w-full">
                <p className="sub-paragraph font-medium uppercase">Website</p>
                <a
                  href={user?.website}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-(--text-color) hover:text-(--blue) truncate block transition-colors"
                >
                  {user?.website}
                </a>
              </div>
            </div>
          )}
        </div>

        {Object.keys(socialLinks).length > 0 && (
          <div className="border-t border-(--border) pt-6 mt-6">
            <h3 className="font-semibold text-(--text-color)">
              Social Profiles
            </h3>
            <div className="flex flex-wrap gap-4">
              {Object.entries(socialLinks).map(([key, url]) => {
                const config = SOCIAL_CONFIG[key.toLowerCase()];
                if (!config || !url) return null;

                const IconComponent = config.icon;

                return (
                  <motion.div
                    key={key}
                    className="relative"
                    initial="initial"
                    whileHover="hover"
                  >
                    {/* Premium Tooltip */}
                    <motion.span
                      variants={{
                        initial: { opacity: 0, y: 10, scale: 0.8 },
                        hover: { opacity: 1, y: -5, scale: 1 },
                      }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-(--secondary-bg) text-(--text-color-emphasis) text-[10px] font-black uppercase tracking-[0.15em] rounded-lg pointer-events-none whitespace-nowrap z-50 shadow-xl"
                    >
                      {config.label}
                      {/* Tooltip Arrow */}
                      <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-(--secondary-bg) rotate-45" />
                    </motion.span>

                    {/* Social Icon Link */}
                    <motion.a
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                      initial={{ y: 0 }}
                      animate={{
                        y: [0, -5, 0],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: Math.random() * 2, // Randomized delay for a more organic feel
                      }}
                      whileHover={{
                        scale: 1.1,
                        rotate: 8,
                        backgroundColor: "var(--main-subtle)",
                      }}
                      className={`flex items-center justify-center p-3 rounded-xl text-(--text-color) bg-(--primary) transition-colors shadow-custom ${config?.color}`}
                    >
                      <IconComponent size={22} />
                    </motion.a>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
