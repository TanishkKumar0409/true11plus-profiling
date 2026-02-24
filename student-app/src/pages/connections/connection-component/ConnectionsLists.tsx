"use client";

import { useState } from "react";
import { BiLoaderAlt, BiUserMinus, BiGhost } from "react-icons/bi";
import { motion, AnimatePresence } from "framer-motion";
import type { UserProps } from "../../../types/UserTypes";
import { API } from "../../../contexts/API";
import { getErrorResponse, getUserAvatar } from "../../../contexts/CallBacks";
import { TiltWrapper } from "../../../ui/animations/TiltWrapper";
import { ButtonGroup } from "../../../ui/buttons/Button";
import Swal from "sweetalert2";
import { toast } from "react-hot-toast";

interface ConnectionItem {
  connectionId: string;
  connectedSince: string;
  connectedUser: UserProps;
}

interface Props {
  connections: ConnectionItem[];
  setConnections: React.Dispatch<React.SetStateAction<ConnectionItem[]>>;
  loading: boolean;
}

export default function ConnectionsLists({
  connections,
  setConnections,
  loading,
}: Props) {
  const [processingIds, setProcessingIds] = useState<string[]>([]);

  const handleDisconnect = async (userId: string) => {
    const result = await Swal.fire({
      title: "Remove Connection?",
      text: "This person will be removed from your professional circle.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "var(--text-subtle)",
      confirmButtonText: "Yes, disconnect",
      background: "var(--primary-bg)",
      color: "var(--text-color)",
    });

    if (!result.isConfirmed) return;

    setProcessingIds((prev) => [...prev, userId]);
    try {
      await API.delete(`/user/connect/remove/${userId}`);
      setConnections((prev) =>
        prev.filter((item) => item.connectedUser._id !== userId),
      );
      toast.success("Connection removed");
    } catch (error) {
      getErrorResponse(error);
    } finally {
      setProcessingIds((prev) => prev.filter((id) => id !== userId));
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex justify-center items-center p-20">
        <BiLoaderAlt className="animate-spin text-(--main)" size={40} />
      </div>
    );
  }

  if (connections.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-(--primary-bg) rounded-custom shadow-custom"
      >
        <div className="w-20 h-20 bg-(--secondary-bg) rounded-full flex items-center justify-center mb-6 text-(--text-subtle)">
          <BiGhost size={40} />
        </div>
        <h3 className="text-xl font-bold text-(--text-color-emphasis) mb-2">
          Your circle is a bit empty
        </h3>
        <p className="text-(--text-subtle) max-w-sm mb-8">
          Expanding your network opens up new opportunities. Start by exploring
          other student portfolios!
        </p>
        <ButtonGroup
          label="Find People"
          href={`${import.meta.env.VITE_FRONT_URL}/students`}
          target="_blank"
        />
      </motion.div>
    );
  }

  return (
    <div className="flex-1 order-2 lg:order-1">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {connections.map((item, index) => {
            const user = item.connectedUser;
            const isProcessing = processingIds.includes(user._id || "");

            return (
              <motion.div
                key={item.connectionId}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
                transition={{ delay: index * 0.05 }}
                className="h-full"
                style={{ perspective: "1000px" }}
              >
                <TiltWrapper className="relative w-full h-full flex flex-col rounded-custom bg-(--primary-bg) shadow-custom transition-shadow duration-500 cursor-pointer overflow-hidden p-6">
                  <div
                    style={{ transform: "translateZ(-10px)" }}
                    className="absolute top-0 left-0 w-full aspect-2/1 overflow-hidden -z-10"
                  >
                    {user.banner?.[0] ? (
                      <img
                        src={`${import.meta.env.VITE_MEDIA_URL}${user.banner[0]}`}
                        className="w-full h-full object-cover opacity-30 grayscale-20"
                        alt=""
                      />
                    ) : (
                      <div className="w-full h-full bg-linear-to-br from-(--main-subtle) to-transparent opacity-20"></div>
                    )}
                    <div className="absolute inset-0 bg-linear-to-b from-transparent via-(--primary-bg)/60 to-(--primary-bg)" />
                  </div>

                  <div
                    className="flex items-center gap-4 mb-5"
                    style={{ transform: "translateZ(40px)" }}
                  >
                    <div className="bg-(--primary-bg) w-16 h-16 relative rounded-custom border-2 border-(--border) overflow-hidden shadow-sm">
                      <img
                        src={getUserAvatar(user?.avatar || [])}
                        className="w-full h-full object-cover"
                        alt={user.name}
                      />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <h3 className="font-bold text-(--text-color-emphasis) capitalize text-md truncate">
                        {user.name}
                      </h3>
                      <span className="text-xs font-bold text-(--main) truncate">
                        @{user.username}
                      </span>
                    </div>
                  </div>

                  <div
                    style={{ transform: "translateZ(25px)" }}
                    className="grow"
                  >
                    <p className="paragraph text-xs line-clamp-2 text-(--text-subtle)">
                      {user?.about ||
                        "Networking and building future-proof solutions."}
                    </p>
                  </div>

                  <div
                    style={{ transform: "translateZ(60px)" }}
                    className="mt-6 pt-2 flex items-center gap-2"
                  >
                    <ButtonGroup
                      label="Portfolio"
                      href={`${import.meta.env.VITE_FRONT_URL}/profile/${user?.username}`}
                      target="_blank"
                      className="flex-1 text-xs!"
                    />
                    <button
                      disabled={isProcessing}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDisconnect(user._id || "");
                      }}
                      className="shrink-0 w-10 h-10 flex items-center justify-center rounded-custom bg-(--secondary-bg) text-(--text-color) hover:bg-red-500 hover:text-white transition-all duration-300"
                      title="Disconnect"
                    >
                      {isProcessing ? (
                        <BiLoaderAlt className="animate-spin" size={18} />
                      ) : (
                        <BiUserMinus size={20} />
                      )}
                    </button>
                  </div>
                </TiltWrapper>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
