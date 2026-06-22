import PropTypes from "prop-types";
import { cn } from "../../utils/cn";

/** FormActions — form action buttons with optional alignment and sizing. */
export default function FormActions({
  children,
  className,
  align = "start",
  fitContent = false,
}) {
  return (
    <div
      className={cn(
        "flex flex-row flex-wrap items-center gap-2 pt-4",
        align === "end" ? "justify-end" : "justify-start",
        !fitContent && "[&_button]:min-h-10 [&_button]:min-w-[7.5rem]",
        fitContent && "[&_button]:min-h-10",
        className
      )}
    >
      {children}
    </div>
  );
}

FormActions.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  align: PropTypes.oneOf(["start", "end"]),
  fitContent: PropTypes.bool,
};
