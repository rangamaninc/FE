import {
  ChevronLeft,
  ChevronRight,
  FileSpreadsheet,
  RefreshCw,
} from "lucide-react";
import PropTypes from "prop-types";
import { Button } from "./Button";
import { cn } from "../../utils/cn";

/**
 * TableFooter — refresh/excel on the left, pagination on the right.
 * All controls are shown by default and disabled when no handler is provided.
 */
export default function TableFooter({
  className,
  onRefresh,
  onExcelDownload,
  isRefreshing = false,
  pageIndex = 0,
  pageCount = 1,
  onPrevious,
  onNext,
  canPrevious = false,
  canNext = false,
}) {
  const hasPaginationHandlers =
    typeof onPrevious === "function" && typeof onNext === "function";

  return (
    <div
      className={cn(
        "flex items-center justify-between gap-2",
        className
      )}
    >
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={onRefresh}
          disabled={!onRefresh || isRefreshing}
          aria-label="Refresh table"
          title="Refresh"
        >
          <RefreshCw
            className={cn("h-4 w-4", isRefreshing && "animate-spin")}
          />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={onExcelDownload}
          disabled={!onExcelDownload}
          aria-label="Download Excel"
          title="Download Excel"
        >
          <FileSpreadsheet className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground tabular-nums">
          Page {pageCount === 0 ? 0 : pageIndex + 1} of {Math.max(pageCount, 1)}
        </span>
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={hasPaginationHandlers ? onPrevious : undefined}
          disabled={!hasPaginationHandlers || !canPrevious}
          aria-label="Previous page"
          title="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={hasPaginationHandlers ? onNext : undefined}
          disabled={!hasPaginationHandlers || !canNext}
          aria-label="Next page"
          title="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

TableFooter.propTypes = {
  className: PropTypes.string,
  onRefresh: PropTypes.func,
  onExcelDownload: PropTypes.func,
  isRefreshing: PropTypes.bool,
  pageIndex: PropTypes.number,
  pageCount: PropTypes.number,
  onPrevious: PropTypes.func,
  onNext: PropTypes.func,
  canPrevious: PropTypes.bool,
  canNext: PropTypes.bool,
};
