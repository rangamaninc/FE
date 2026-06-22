import PropTypes from "prop-types";
import { cn } from "../../utils/cn";

/** Spinner — centered loading indicator. */
export default function Spinner({ className, size = "md", label = "Loading..." }) {
  const sizeClasses = {
    sm: "h-4 w-4 border-2",
    md: "h-8 w-8 border-2",
    lg: "h-12 w-12 border-[3px]",
  };

  return (
    <div className={cn("flex flex-col items-center justify-center gap-2", className)} role="status">
      <div
        className={cn(
          "animate-spin rounded-full border-primary border-t-transparent",
          sizeClasses[size]
        )}
      />
      {label ? <span className="sr-only">{label}</span> : null}
    </div>
  );
}

Spinner.propTypes = {
  className: PropTypes.string,
  size: PropTypes.oneOf(["sm", "md", "lg"]),
  label: PropTypes.string,
};
