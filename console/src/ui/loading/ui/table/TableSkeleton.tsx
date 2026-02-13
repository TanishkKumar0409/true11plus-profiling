import Skeleton from "react-loading-skeleton";

interface TableSkeletonProps {
  row?: number;
  col?: number;
  showProfile?: boolean;
}

export default function TableSkeleton({
  row = 10,
  col = 6,
  showProfile = true,
}: TableSkeletonProps) {
  const totalGridCols = (col - 1) * 4 + 1;

  return (
    <div className="bg-(--primary-bg) rounded-custom shadow-custom overflow-hidden">
      <div className="overflow-x-auto">
        <div className="min-w-250">
          {/* Table Header */}
          <div
            className="grid gap-4 p-4 border-b border-(--border)"
            style={{
              gridTemplateColumns: `repeat(${totalGridCols}, minmax(0, 1fr))`,
            }}
          >
            {Array(col)
              .fill(0)
              .map((_, i) => (
                <div
                  key={`head-${i}`}
                  style={{ gridColumn: i === 0 ? "span 1" : "span 4" }}
                >
                  <Skeleton height={15} />
                </div>
              ))}
          </div>

          {/* Table Rows */}
          {Array(row)
            .fill(true)
            .map((_, rowIndex) => (
              <div
                key={rowIndex}
                className="grid gap-4 p-4 items-center border-b border-(--border)"
                style={{
                  gridTemplateColumns: `repeat(${totalGridCols}, minmax(0, 1fr))`,
                }}
              >
                {Array(col)
                  .fill(0)
                  .map((_, colIndex) => (
                    <div
                      key={`${rowIndex}-${colIndex}`}
                      style={{
                        gridColumn: colIndex === 0 ? "span 1" : "span 4",
                      }}
                    >
                      {colIndex === 0 ? (
                        <Skeleton width={20} />
                      ) : colIndex === 1 ? (
                        <div className="flex items-center gap-3">
                          {showProfile && (
                            <Skeleton
                              circle
                              width={40}
                              height={40}
                              className="shrink-0"
                            />
                          )}
                          <div className="flex flex-col gap-1 w-full">
                            <Skeleton width="80%" height={14} />
                            {showProfile && (
                              <Skeleton width="60%" height={10} />
                            )}
                          </div>
                        </div>
                      ) : colIndex === col - 1 ? (
                        <div className="flex justify-center space-x-2">
                          <Skeleton width={24} height={24} />
                          <Skeleton width={24} height={24} />
                          <Skeleton width={24} height={24} />
                        </div>
                      ) : (
                        <Skeleton width="60%" height={20} />
                      )}
                    </div>
                  ))}
              </div>
            ))}
        </div>
      </div>

      {/* Pagination Footer */}
      <div className="flex flex-col sm:flex-row justify-between items-center p-4 gap-4">
        <Skeleton width={150} height={14} />
        <div className="flex flex-wrap gap-4 items-center justify-center">
          <Skeleton width={80} height={32} />
          <div className="flex gap-1">
            {Array(4)
              .fill(0)
              .map((_, i) => (
                <Skeleton key={i} width={32} height={32} />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
