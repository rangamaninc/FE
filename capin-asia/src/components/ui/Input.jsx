import { forwardRef } from "react";
import { cva } from "class-variance-authority";
import PropTypes from "prop-types";
import { cn } from "../../utils/cn";

const inputVariants = cva(
  "flex h-10 w-full rounded-lg border px-3 py-2 text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-border bg-transparent text-foreground placeholder:text-muted-foreground focus-visible:border-primary",
        error:
          "border-error bg-error/10 text-error placeholder:text-error/70 focus-visible:border-error",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

/** Input — styled text field with error variant support. */
const Input = forwardRef(function Input(
  { className, type = "text", variant, ...props },
  ref
) {
  return (
    <input
      type={type}
      className={cn(inputVariants({ variant }), className)}
      ref={ref}
      {...props}
    />
  );
});

Input.propTypes = {
  className: PropTypes.string,
  type: PropTypes.string,
  variant: PropTypes.string,
};

export { Input, inputVariants };
