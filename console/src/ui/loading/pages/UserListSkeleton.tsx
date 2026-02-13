import Skeleton from "react-loading-skeleton";
import BreadCrumbsSkeleton from "../ui/breadcrumbs/BreadCrumbsSkeleton";
import DashboardCardSkeleton from "../ui/card/DashboardCardSkeleton";
import TableSkeleton from "../ui/table/TableSkeleton";

export default function UserListSkeleton({
  cards = false,
  row = 10,
  col = 6,
  showProfile = true,
}: {
  cards?: boolean;
  row?: number;
  col?: number;
  showProfile?: boolean;
}) {
  return (
    <div className="flex-1 w-full max-w-full space-y-6">
      <BreadCrumbsSkeleton />

      {cards && (
        <div className="grid gird-cols-1 md:grid-cols-4 gap-3">
          {Array(4)
            .fill(true)
            ?.map((_, idx) => (
              <DashboardCardSkeleton key={idx} />
            ))}
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="w-full">
          <Skeleton height={45} />
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <Skeleton width={100} height={45} />
          <Skeleton width={100} height={45} />
        </div>
      </div>

      <TableSkeleton row={row} col={col} showProfile={showProfile} />
    </div>
  );
}
