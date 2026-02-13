import React from "react";
import { Link } from "react-router-dom";
import CountUp from "react-countup";
import { BiTrendingUp } from "react-icons/bi";
import { getPercentageColor } from "../../contexts/Callbacks";
import { ColorConfig } from "../../common/ColorsData";

type ColorKey = keyof typeof ColorConfig;

interface DashboardCardProps {
  title: string;
  value: number;
  percentage?: number;
  icon: React.ElementType;
  iconColor?: string;
  link?: string;
}
const LinearProgressBar = ({
  percentage,
  color,
}: {
  percentage: number;
  color: ColorKey;
}) => {
  const config = ColorConfig[color] || ColorConfig.blue;

  return (
    <div className="w-full h-2 bg-(--secondary-bg) rounded-full overflow-hidden mt-3">
      <div
        className={`h-full rounded-full transition-all duration-1000 ease-out ${config.bar}`}
        style={{ width: `${Math.min(percentage, 100)}%` }}
      />
    </div>
  );
};

// --- Main Component ---
export default function DashboardCard({
  title,
  value,
  percentage,
  icon: Icon,
  iconColor = "purple",
  link,
}: DashboardCardProps) {
  const resolvedColor = percentage
    ? getPercentageColor(percentage)
    : ((iconColor in ColorConfig ? iconColor : "purple") as ColorKey);

  const colors = ColorConfig[resolvedColor];

  const CardContent = (
    <div className="relative w-full bg-(--primary-bg) rounded-custom p-5 shadow-custom transition-all duration-300 transform hover:-translate-y-1 group">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-sm font-medium text-(--text-color) capitalize">
            {title}
          </h3>
          <div className="text-3xl font-bold text-(--text-color-emphasis) mt-1">
            <CountUp end={value} duration={1.5} separator="," />
          </div>
        </div>

        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${colors.bg}`}
        >
          <Icon className={`w-5 h-5 ${colors.text}`} />
        </div>
      </div>

      {percentage !== undefined && (
        <div className="flex flex-col">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-medium text-(--text-color)">Progress</span>
            <span className={`font-bold ${colors.text}`}>
              <CountUp end={percentage} duration={2} />%
            </span>
          </div>
          <LinearProgressBar percentage={percentage} color={resolvedColor} />
        </div>
      )}

      {percentage === undefined && (
        <div className="mt-2 flex items-center text-xs font-medium text-(--success) bg-(--success-subtle) w-fit px-2 py-1 rounded-custom">
          <BiTrendingUp className="mr-1" />
          <span>Active</span>
        </div>
      )}
    </div>
  );

  if (link) {
    return (
      <Link to={link} className="block">
        {CardContent}
      </Link>
    );
  }

  return CardContent;
}
