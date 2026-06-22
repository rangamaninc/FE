import PropTypes from "prop-types";
import TableFooter from "./TableFooter";

/** Pagination — table footer with icon-based previous/next controls. */
export default function Pagination(props) {
  return <TableFooter {...props} />;
}

Pagination.propTypes = {
  className: PropTypes.string,
  onRefresh: PropTypes.func,
  onExcelDownload: PropTypes.func,
  isRefreshing: PropTypes.bool,
  pageIndex: PropTypes.number.isRequired,
  pageCount: PropTypes.number.isRequired,
  onPrevious: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
  canPrevious: PropTypes.bool.isRequired,
  canNext: PropTypes.bool.isRequired,
};
