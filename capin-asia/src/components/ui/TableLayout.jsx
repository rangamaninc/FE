import PropTypes from "prop-types";
import { cn } from "../../utils/cn";

/**
 * TableLayout — stacks table content with a footer pinned to the bottom.
 */
export default function TableLayout({
  children,
  footer,
  className,
  contentClassName,
  footerClassName,
}) {
  return (
    <div className={cn("flex min-h-[320px] flex-1 flex-col", className)}>
      <div className={cn("min-h-0 flex-1", contentClassName)}>{children}</div>
      {footer ? (
        <div
          className={cn(
            "mt-auto shrink-0 border-t border-border pt-4",
            footerClassName
          )}
        >
          {footer}
        </div>
      ) : null}
    </div>
  );
}

TableLayout.propTypes = {
  children: PropTypes.node.isRequired,
  footer: PropTypes.node,
  className: PropTypes.string,
  contentClassName: PropTypes.string,
  footerClassName: PropTypes.string,
};
