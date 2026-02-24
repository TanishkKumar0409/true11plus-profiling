"use client";
import { useGoogleLogin, TokenResponse } from "@react-oauth/google";
import { FcGoogle } from "react-icons/fc";
import { toast } from "react-hot-toast";
import { API } from "@/contexts/API";
import { getErrorResponse } from "@/contexts/Callbacks";

const GoogleLoginButton = () => {
  const login = useGoogleLogin({
    onSuccess: async (tokenResponse: TokenResponse) => {
      try {
        const res = await API.post("/auth/login/google  ", {
          token: tokenResponse.access_token,
        });
        console.log("Login successful:", res.data);
        window.location.reload();
      } catch (error) {
        getErrorResponse(error);
      }
    },
    onError: () => {
      console.error("Google login failed. Please try again.");
      toast.error("Google login failed. Please try again.");
    },
    flow: "implicit",
  });

  return (
    <button
      onClick={() => login()}
      className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-700 shadow-sm transition-all duration-200 hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-1"
    >
      <FcGoogle className="text-xl me-2" />
      Continue with Google
    </button>
  );
};

export default GoogleLoginButton;
