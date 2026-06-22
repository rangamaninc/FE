import { forwardRef } from "react";
import PropTypes from "prop-types";
import { cn } from "../../utils/cn";

/** TextArea — multi-line text input with consistent form styling. */
const TextArea = forwardRef(function TextArea({ className, ...props }, ref) {
  return (
    <textarea
      className={cn(
        "flex min-h-[120px] w-full rounded-lg border border-border bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

TextArea.propTypes = { className: PropTypes.string };

export { TextArea };
