import PropTypes from "prop-types";
import { cn } from "../../utils/cn";

function Card({ className, ...props }) {
  return (
    <div
      className={cn(
        "flex w-full flex-col gap-6 rounded-xl border border-border bg-card p-6 text-card-foreground shadow-sm",
        className
      )}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }) {
  return <div className={cn("flex flex-col space-y-1.5", className)} {...props} />;
}

function CardTitle({ className, ...props }) {
  return (
    <div
      className={cn("text-lg font-semibold leading-none tracking-tight", className)}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }) {
  return (
    <p className={cn("text-sm text-muted-foreground", className)} {...props} />
  );
}

function CardContent({ className, ...props }) {
  return <div className={cn(className)} {...props} />;
}

function CardFooter({ className, ...props }) {
  return (
    <div className={cn("flex items-center [.border-t]:pt-6", className)} {...props} />
  );
}

Card.propTypes = { className: PropTypes.string };

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
