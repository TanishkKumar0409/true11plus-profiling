"use client";

import { BiPlus } from "react-icons/bi";
import { Outlet, useLocation } from "react-router-dom";

const AuthLayout = () => {
  const location = useLocation();
  const pathname = location.pathname;
  return (
    <div className="h-screen flex items-center justify-center font-sans overflow-hidden">
      <div className="w-full h-full flex overflow-hidden">
        <div className="w-full lg:w-1/2 h-full flex flex-col relative">
          <div className="flex-1 overflow-y-auto scrollbar-hide p-8 md:p-12">
            <div className="max-w-md mx-auto flex flex-col justify-center min-h-full">
              <div className="flex justify-center mb-10">
                <img
                  src="/img/logo/logo.png"
                  className="w-auto h-24 p-2"
                  alt="Logo"
                />
              </div>

              {(pathname === "/" || pathname === "/auth/register") && (
                <>
                  <button
                    type="button"
                    className="w-full mb-8 flex items-center justify-center gap-3 bg-white border border-gray-200 text-gray-700 font-medium py-3.5 px-4 rounded-full hover:bg-gray-50 transition-all shadow-sm"
                  >
                    <img
                      src="https://www.svgrepo.com/show/475656/google-color.svg"
                      alt="Google"
                      className="h-5 w-5"
                    />
                    <span>Log in with Google</span>
                  </button>
                </>
              )}
              <Outlet />
            </div>
          </div>
        </div>

        <div className="hidden lg:block w-1/2 min-h-full relative p-4 items-center">
          <img
            src="https://img.freepik.com/premium-vector/hand-drawn-study-abroad-illustration_23-2150310003.jpg"
            alt="Kayaking Balance"
            className="w-full h-full object-cover rounded-xl"
          />

          <div className="absolute bottom-10 right-10 left-10 bg-[#Fdfdfd] p-6 rounded-[30px] shadow-[0_8px_30px_rgb(0,0,0,0.12)] flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-serif font-bold text-gray-900 leading-tight">
                Find Your <br /> Inner{" "}
                <span className="inline-block relative">
                  Balance
                  <span className="absolute -top-1 -right-4 text-purple-500 text-xs">
                    ✨
                  </span>
                </span>
              </h3>
              <p className="text-gray-500 text-xs mt-3 max-w-50 leading-relaxed">
                Helping you achieve clarity, harmony, and personal growth.
                Together, we create lasting change.
              </p>
            </div>
            <div className="h-12 w-12 rounded-full border border-gray-200 flex items-center justify-center bg-white shadow-sm text-gray-900">
              <BiPlus />
            </div>

            <div className="absolute bottom-6 right-20 flex -space-x-2">
              <div className="h-8 w-8 rounded-full border-2 border-white bg-gray-200 bg-[url('https://i.pravatar.cc/100?img=32')] bg-cover"></div>
              <div className="h-8 w-8 rounded-full border-2 border-white bg-gray-200 bg-[url('https://i.pravatar.cc/100?img=12')] bg-cover"></div>
              <div className="h-8 w-8 rounded-full border-2 border-white bg-purple-600 flex items-center justify-center text-[10px] text-white font-bold">
                4k+
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
