"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import type { UserProps } from "../../types/UserProps";
import { API } from "../../contexts/API";
import { getErrorResponse } from "../../contexts/Callbacks";

export default function VerifyEmail() {
  const RESEND_TIME = 4;
  const LINK_VALID_MINUTES = 5;

  const { email } = useParams();
  const finalEmail = decodeURIComponent(String(email));

  const [timeLeft, setTimeLeft] = useState<number>(RESEND_TIME);
  const [isResending, setIsResending] = useState<boolean>(false);
  const [user, setUser] = useState<UserProps | null>(null);

  const navigator = useNavigate();

  useEffect(() => {
    let active = true;

    const fetchUser = async () => {
      try {
        const response = await API.get(`/auth/user/email/${email}`);
        if (!active) return;
        setUser(response.data || null);
      } catch (error) {
        getErrorResponse(error, true);
      }
    };

    fetchUser();

    return () => {
      active = false;
    };
  }, [email]);

  useEffect(() => {
    if (!user) return;
    if (user.verified) {
      toast.error("You are already verified.");
      navigator("/");
    }
  }, [user, navigator]);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);

  const handleResendMail = async () => {
    setIsResending(true);

    try {
      const response = await API.post(`/auth/verify-email/email/${finalEmail}`);
      toast.success(response.data.message);
      setTimeLeft(RESEND_TIME);
    } catch (error) {
      getErrorResponse(error);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="flex flex-col items-center text-center">
      <p className="text-sm text-gray-600 mb-4 leading-relaxed">
        A verification email has been sent to
        <span className="font-medium text-gray-900"> {finalEmail}</span>
      </p>

      <div className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4">
        <p className="text-sm text-gray-600 leading-relaxed">
          Open the email and follow the link to activate your account.
          <br />
          <span className="text-xs text-gray-500 block mt-1">
            The link will expire after {LINK_VALID_MINUTES} minutes.
          </span>
        </p>
      </div>

      <div className="my-3 text-xs text-gray-500">
        Can’t find the email? Check your spam folder or wait before requesting a
        new one.
      </div>

      <button
        onClick={handleResendMail}
        disabled={timeLeft > 0 || isResending}
        className={`w-full h-11 rounded-xl text-sm font-medium transition ${
          timeLeft > 0
            ? "bg-purple-100 text-purple-600 cursor-not-allowed"
            : "bg-purple-600 text-white hover:bg-purple-700 shadow-sm"
        }`}
      >
        {isResending
          ? "Resending..."
          : timeLeft > 0
            ? `Resend email in ${timeLeft}s`
            : "Resend verification email"}
      </button>
    </div>
  );
}
