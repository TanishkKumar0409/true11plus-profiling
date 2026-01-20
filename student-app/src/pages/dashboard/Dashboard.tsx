import { Link, useOutletContext } from "react-router-dom";
import { getUserAvatar } from "../../contexts/CallBacks";
import type { DashboardOutletContextProps } from "../../types/Types";
import { BiMapPin, BiCheck, BiSolidZap } from "react-icons/bi";

export default function Dashboard() {
  const { authLoading, authUser } =
    useOutletContext<DashboardOutletContextProps>();

  const location = [authUser?.city, authUser?.state, authUser?.country]
    ?.filter(Boolean)
    ?.join(", ");

  if (authLoading) return <>AuthLoading</>;

  // Common card style class for consistency
  const cardClass =
    "bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300";

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Profile Card */}
        <div className="lg:col-span-2 space-y-4">
          <div className={cardClass}>
            <div
              className="w-full aspect-2/1 relative"
              style={
                authUser?.banner?.[0]
                  ? {
                      backgroundImage: `url(${import.meta.env.VITE_MEDIA_URL}/${
                        authUser.banner[0]
                      })`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                    }
                  : {
                      background: "#7c3aed",
                    }
              }
            />

            <div className="p-6 relative">
              <div className="flex flex-col items-start -mt-20 mb-4">
                <img
                  src={getUserAvatar(authUser?.avatar || [])}
                  alt={authUser?.name}
                  className="w-32 h-32 rounded-full border-4 border-white object-cover shadow-md bg-white"
                />

                <div className="mt-4 w-full">
                  <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">
                        {authUser?.name}
                      </h3>
                      <p className="text-gray-600 font-medium">Designation</p>
                      <p className="text-sm text-gray-500">
                        @{authUser?.username}
                      </p>

                      {location && (
                        <div className="flex items-center mt-2 text-gray-500 text-sm">
                          <BiMapPin className="w-4 h-4 mr-1" />
                          {location}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button className="bg-blue-600 text-white px-4 py-2 rounded-full font-medium text-sm hover:bg-blue-700 transition shadow-sm hover:shadow">
                        Connect
                      </button>
                      <Link
                        to={`/profile/edit`}
                        className="border border-gray-300 text-gray-700 px-4 py-2 rounded-full font-medium text-sm hover:bg-gray-50 transition"
                      >
                        Edit
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200 flex gap-6">
                <div className="flex flex-col">
                  <span className="text-gray-900 font-bold text-lg">600+</span>
                  <span className="text-gray-500 text-sm">Followers</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-900 font-bold text-lg">500+</span>
                  <span className="text-gray-500 text-sm">Connections</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Pro Plan & Extras */}
        <div className="lg:col-span-1 space-y-4">
          {/* Pro Plan Card - using same cardClass for visual consistency */}
          <div className={`${cardClass} p-6 relative`}>
            {/* Decorative background circle */}
            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-24 h-24 bg-amber-100 rounded-full opacity-50 blur-xl"></div>

            <div className="flex items-center gap-3 mb-4 relative z-10">
              <div className="p-2 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg text-white shadow-md">
                <BiSolidZap className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 leading-tight">
                  Upgrade to Pro
                </h3>
                <p className="text-xs text-gray-500">Unlock your potential</p>
              </div>
            </div>

            <p className="text-gray-600 text-sm mb-6 leading-relaxed">
              Get 5x more visibility and access to exclusive premium tools.
            </p>

            <ul className="space-y-3 mb-6">
              {[
                "Verified Profile Badge",
                "Priority Job Applications",
                "Who Viewed Your Profile",
                "Unlimited Direct Messages",
              ].map((item, index) => (
                <li
                  key={index}
                  className="flex items-center text-sm text-gray-700"
                >
                  <BiCheck className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>

            <button className="w-full bg-gray-900 hover:bg-black text-white py-2.5 rounded-lg font-medium text-sm transition-all duration-200 shadow-sm hover:shadow-lg transform hover:-translate-y-0.5">
              Upgrade Now
            </button>

            <p className="text-center text-xs text-gray-400 mt-3">
              Starting at $9.99/mo
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
