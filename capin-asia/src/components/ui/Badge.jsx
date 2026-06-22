import { forwardRef } from "react";
import { cva } from "class-variance-authority";
import PropTypes from "prop-types";
import { cn } from "../../utils/cn";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-white",
        secondary: "border-transparent bg-secondary text-white",
        success: "border-transparent bg-success text-white",
        warning: "border-transparent bg-warning text-white",
        destructive: "border-transparent bg-error text-white",
        outline: "border-border text-foreground",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

/** Badge — compact status label. */
const Badge = forwardRef(function Badge({ className, variant, ...props }, ref) {
  return (
    <div
      ref={ref}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
});

Badge.propTypes = {
  className: PropTypes.string,
  variant: PropTypes.string,
};

export { Badge, badgeVariants };
