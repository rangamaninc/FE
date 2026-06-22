import PropTypes from "prop-types";
import { cn } from "../../utils/cn";
import TableFooter from "./TableFooter";
import TableLayout from "./TableLayout";
import { TABLE_CLASS, TABLE_WRAPPER_CLASS } from "./tableStyles";

/**
 * AppTable — styled table shell for legacy HTML tables.
 * Applies the same look as DataTable and shows footer controls by default.
 */
export default function AppTable({
  children,
  className,
  wrapperClassName,
  footerClassName,
  onRefresh,
  onExcelDownload,
  isRefreshing = false,
  pageIndex,
  pageCount,
  onPrevious,
  onNext,
  canPrevious,
  canNext,
}) {
  const footer = (
    <TableFooter
      className={footerClassName}
      onRefresh={onRefresh}
      onExcelDownload={onExcelDownload}
      isRefreshing={isRefreshing}
      pageIndex={pageIndex}
      pageCount={pageCount}
      onPrevious={onPrevious}
      onNext={onNext}
      canPrevious={canPrevious}
      canNext={canNext}
    />
  );

  return (
    <TableLayout className={className} footer={footer}>
      <div className={cn(TABLE_WRAPPER_CLASS, wrapperClassName)}>
        <table className={TABLE_CLASS}>{children}</table>
      </div>
    </TableLayout>
  );
}

AppTable.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  wrapperClassName: PropTypes.string,
  footerClassName: PropTypes.string,
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
