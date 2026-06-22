import PropTypes from "prop-types";
import { cn } from "../../utils/cn";

/** Skeleton — loading placeholder with pulse animation. */
function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  );
}

Skeleton.propTypes = { className: PropTypes.string };

export { Skeleton };
