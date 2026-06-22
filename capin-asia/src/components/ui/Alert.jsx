import { forwardRef } from "react";
import { cva } from "class-variance-authority";
import PropTypes from "prop-types";
import { cn } from "../../utils/cn";

const alertVariants = cva("relative w-full rounded-lg border p-4", {
  variants: {
    variant: {
      default: "bg-background text-foreground border-border",
      primary: "border-transparent bg-primary text-white",
      success: "border-transparent bg-success text-white",
      warning: "border-transparent bg-warning text-white",
      destructive: "border-transparent bg-error text-white",
      info: "border-transparent bg-info text-white",
    },
  },
  defaultVariants: { variant: "default" },
});

/** Alert — inline feedback banner. */
const Alert = forwardRef(function Alert({ className, variant, ...props }, ref) {
  return (
    <div
      ref={ref}
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  );
});

const AlertTitle = forwardRef(function AlertTitle({ className, ...props }, ref) {
  return (
    <h5
      ref={ref}
      className={cn("mb-1 font-medium leading-none tracking-tight", className)}
      {...props}
    />
  );
});

const AlertDescription = forwardRef(function AlertDescription(
  { className, ...props },
  ref
) {
  return (
    <div
      ref={ref}
      className={cn("text-sm [&_p]:leading-relaxed", className)}
      {...props}
    />
  );
});

Alert.propTypes = {
  className: PropTypes.string,
  variant: PropTypes.string,
};

export { Alert, AlertTitle, AlertDescription };
