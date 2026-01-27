import { AxiosError } from "axios";
import { useCallback, useEffect, useState, useRef } from "react";
import {
  LuArrowLeft,
  LuCircleCheck,
  LuCircleX,
  LuLoader,
} from "react-icons/lu";
import { useNavigate, useParams } from "react-router-dom";
import type { TokenConfimationProps } from "../../types/Types";
import { API } from "../../contexts/API";

export default function VerifyEmailConfirm() {
  const { token } = useParams();
  const navigator = useNavigate();

  // Fix: Add a ref to track if the request has already been sent
  const effectRan = useRef(false);

  const [state, setState] = useState<TokenConfimationProps>({
    loading: true,
    success: false,
    error: "",
    title: "",
    message: "",
  });

  const [countdown, setCountdown] = useState(5);
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    // Fix: Prevent double execution in React Strict Mode
    if (effectRan.current === true) return;

    const verifyToken = async () => {
      // Mark as ran immediately
      effectRan.current = true;

      if (!token) {
        setState({
          loading: false,
          success: false,
          error: "No token provided",
          title: "Invalid Request",
          message: "The verification link is missing required information.",
        });
        return;
      }

      try {
        const response = await API.get(`/auth/verify-email/${token}`);

        if (response.data.message) {
          setState({
            loading: false,
            success: true,
            error: "",
            title: "Successfully Verified",
            message:
              response.data.message ||
              "Your email has been verified successfully.",
          });
        }
      } catch (error) {
        console.log(error);
        const err = error as AxiosError<{ error: string }>;

        const errorMessage =
          err?.response?.data?.error || err?.message || "Something went wrong.";

        setState({
          loading: false,
          success: false,
          error: "Error",
          title: "Verification Failed",
          message: errorMessage,
        });
      }
    };

    verifyToken();
  }, [token]);

  const handleRedirect = useCallback(() => {
    if (isRedirecting) return;
    setIsRedirecting(true);
    navigator("/");
  }, [navigator, isRedirecting]);

  useEffect(() => {
    if (state.loading) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleRedirect();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [state.loading, handleRedirect]);

  const handleBack = () => {
    if (isRedirecting) return;
    navigator(`/`);
  };

  return (
    <div className="flex flex-col items-center w-full text-center bg-white p-6">
      <div className="flex justify-center mb-4">
        {state.loading ? (
          <div className="rounded-full p-4 bg-purple-100">
            <LuLoader className="w-12 h-12 text-purple-600 animate-spin" />
          </div>
        ) : state.success ? (
          <div className="rounded-full p-4 bg-green-100">
            <LuCircleCheck className="w-12 h-12 text-green-600" />
          </div>
        ) : (
          <div className="rounded-full p-4 bg-red-100">
            <LuCircleX className="w-12 h-12 text-red-600" />
          </div>
        )}
      </div>

      <h1
        className={`text-2xl font-bold text-center mb-2 ${
          state.loading
            ? "text-purple-600"
            : state.success
              ? "text-green-600"
              : "text-red-600"
        }`}
      >
        {state.loading ? "Verifying Request" : state.title}
      </h1>

      <p className="text-center text-gray-600 mb-6 max-w-md mx-auto">
        {state.loading
          ? "Please wait while we process your request..."
          : state.message}
      </p>

      {!state.loading && countdown > 0 && (
        <p className="text-center text-sm text-gray-500 mb-4">
          Redirecting to login in {countdown} second
          {countdown !== 1 ? "s" : ""}...
        </p>
      )}

      {!state.loading && (
        <div className="flex flex-col gap-3 w-full max-w-xs mx-auto">
          <button
            onClick={handleRedirect}
            disabled={isRedirecting}
            className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-white font-medium transition shadow-sm ${
              state.success
                ? "bg-green-600 hover:bg-green-700 focus:ring-green-500"
                : "bg-red-600 hover:bg-red-700 focus:ring-red-500"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isRedirecting ? (
              <LuLoader className="w-5 h-5 animate-spin" />
            ) : (
              <>Continue</>
            )}
          </button>

          <button
            onClick={handleBack}
            disabled={isRedirecting}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <LuArrowLeft className="w-5 h-5" />
            Go Back
          </button>
        </div>
      )}
    </div>
  );
}
