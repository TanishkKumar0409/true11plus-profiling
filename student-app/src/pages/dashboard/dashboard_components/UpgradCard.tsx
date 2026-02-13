import { LuAward, LuCheck } from "react-icons/lu";
import { ButtonGroup } from "../../../ui/buttons/Button";
import { showComingSoonToast } from "../../../contexts/CallBacks";

export default function UpgradeCard() {
  const features = [
    "Verified Certificates",
    "Offline Course Access",
    "Verified Profile Badge",
    "Priority Job Applications",
    "Who Viewed Your Profile",
    "Unlimited Direct Messages",
  ];
  return (
    <div className="relative bg-(--primary-bg) p-6 transition-all border-2 border-(--main) duration-300 h-full max-h-[70vh] flex flex-col rounded-custom shadow-custom">
      <div className="relative flex flex-col flex-1">
        {/* Header */}
        <div className="flex items-start gap-4 mb-4">
          <div className="w-8 h-8 bg-(--main) text-(--white) flex items-center justify-center shrink-0 rounded-custom s">
            <LuAward className="w-4 h-4" />
          </div>

          <div>
            <h2 className="text-sm font-bold text-(--text-color-emphasis) leading-tight">
              Pro Student Plan
            </h2>
            <p className="font-small mt-0.5">Fast-track your career</p>
          </div>
        </div>

        {/* Description */}
        <p className="text-(--text-color) leading-relaxed mb-4">
          Unlimited access to all courses with{" "}
          <span className="font-semibold text-(--text-color-emphasis)">
            industry-recognized certificates
          </span>
          .
        </p>

        {/* Features */}
        <ul className="space-y-2 mb-5">
          {features.map((feature, index) => (
            <li
              key={index}
              className="flex items-center gap-3 text-(--text-color-subtle) paragraph"
            >
              <span className="flex items-center justify-center w-5 h-5 rounded-full  bg-(--success-subtle)">
                <LuCheck
                  className="w-3.5 h-3.5 text-(--success)"
                  strokeWidth={3}
                />
              </span>
              <span className="text-(--text-color-subtle) font-medium">
                {feature}
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-auto">
          <ButtonGroup
            label="Unlock Premium"
            className="w-full"
            disable={false}
            onClick={showComingSoonToast}
          />
        </div>
      </div>
    </div>
  );
}
