"use client";

import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getErrorResponse, getUserAvatar } from "../../../contexts/CallBacks";
import { API } from "../../../contexts/API";
import type { UserProps } from "../../../types/UserTypes";
import {
  BiLoaderAlt,
  BiUserPlus,
  BiChevronDown,
  BiChevronUp,
} from "react-icons/bi";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ButtonGroup, SecondButton } from "../../../ui/buttons/Button";

interface ConnectionRequest {
  _id: string;
  requester: UserProps;
  receiver: string;
  status: string;
  createdAt: string;
}

export default function ConnectionRequest({
  fetchConnections,
}: {
  fetchConnections: () => void;
}) {
  const [requests, setRequests] = useState<ConnectionRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const fetchRequests = useCallback(async () => {
    try {
      const response = await API.get("/user/connect/requests");
      setRequests(response.data.requests || []);
    } catch (error) {
      console.error("Failed to fetch notifications");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const handleAction = async (
    requestId: string,
    action: "accept" | "reject",
  ) => {
    setProcessingId(requestId);
    try {
      const response = await API.post(
        `/user/connect/request/handle/${requestId}`,
        { action },
      );
      toast.success(response.data.message);
      setRequests((prev) => prev.filter((req) => req._id !== requestId));
      fetchConnections();
    } catch (error) {
      getErrorResponse(error);
    } finally {
      setProcessingId(null);
    }
  };

  const visibleRequests = isExpanded ? requests : requests.slice(0, 5);

  return (
    <div className="w-full lg:w-85 order-1 lg:order-2 sticky top-24">
      <div className="bg-(--primary-bg) rounded-custom shadow-custom overflow-hidden transition-all duration-300">
        <div className="px-5 py-4 flex items-center justify-between border-b border-(--border) bg-(--primary-bg)">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-(--main-subtle) text-(--main) rounded-custom">
              <BiUserPlus size={20} />
            </div>
            <h3 className="font-extrabold text-sm text-(--text-color-emphasis) tracking-tight">
              Invitations
            </h3>
          </div>
          {requests.length > 0 && (
            <span className="bg-(--main) text-(--main-subtle) text-[10px] px-2 py-1 rounded-full font-black animate-pulse">
              {requests.length}
            </span>
          )}
        </div>

        <div className="p-2">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3">
              <BiLoaderAlt className="animate-spin text-(--main)" size={32} />
              <p className="text-xs font-bold text-(--text-subtle) animate-pulse">
                Checking for requests...
              </p>
            </div>
          ) : requests.length > 0 ? (
            <div className="space-y-1">
              <AnimatePresence initial={false}>
                {visibleRequests.map((item) => (
                  <motion.div
                    key={item._id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="group relative p-3 rounded-custom hover:bg-(--secondary-bg) transition-all"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="relative shrink-0">
                        <img
                          src={getUserAvatar(item.requester.avatar || [])}
                          className="h-11 w-11 rounded-custom object-cover ring-2 ring-(--border) group-hover:ring-(--main) transition-all"
                          alt={item.requester.name}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <Link
                          to={`/profile/${item.requester.username}`}
                          className="text-sm font-bold text-(--text-color-emphasis) truncate block hover:text-(--main) transition-colors"
                        >
                          {item.requester.name}
                        </Link>
                        <p className="text-[11px] text-(--text-subtle) font-semibold truncate tracking-wider">
                          @{item.requester.username}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <ButtonGroup
                        label="Accept"
                        disable={!!processingId}
                        onClick={() => handleAction(item._id, "accept")}
                        className="flex-1 text-sm!"
                      />
                      <SecondButton
                        label="Ignore"
                        disable={!!processingId}
                        onClick={() => handleAction(item._id, "reject")}
                        className="text-xs!"
                      />
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {requests.length > 5 && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="w-full py-3 flex items-center justify-center gap-2 text-[11px] font-black text-(--text-subtle) hover:text-(--main) transition-colors"
                >
                  {isExpanded ? (
                    <>
                      Show Less <BiChevronUp size={18} />
                    </>
                  ) : (
                    <>
                      Show {requests.length - 5} More{" "}
                      <BiChevronDown size={18} />
                    </>
                  )}
                </button>
              )}
            </div>
          ) : (
            <div className="py-16 flex flex-col items-center justify-center text-center px-6">
              <div className="w-16 h-16 bg-(--secondary-bg) rounded-full flex items-center justify-center mb-4 border border-(--border)">
                <BiUserPlus className="text-(--text-subtle)" size={30} />
              </div>
              <p className="text-sm font-extrabold text-(--text-color-emphasis)">
                All Caught Up!
              </p>
              <p className="text-[11px] text-(--text-subtle) font-medium mt-1 leading-relaxed">
                No new invitations at the moment.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
