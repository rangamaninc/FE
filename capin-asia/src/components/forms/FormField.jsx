import PropTypes from "prop-types";
import { cn } from "../../utils/cn";

/** FormField — wraps label, control, helper text, and error message. */
export default function FormField({
  label,
  htmlFor,
  error,
  helperText,
  required = false,
  className,
  children,
}) {
  return (
    <div className={cn("space-y-2", className)}>
      {label ? (
        <label htmlFor={htmlFor} className="text-sm font-medium text-foreground">
          {label}
          {required ? <span className="ml-1 text-error">*</span> : null}
        </label>
      ) : null}
      {children}
      {error ? (
        <p className="text-sm text-error" role="alert">
          {error}
        </p>
      ) : helperText ? (
        <p className="text-sm text-muted-foreground">{helperText}</p>
      ) : null}
    </div>
  );
}

FormField.propTypes = {
  label: PropTypes.string,
  htmlFor: PropTypes.string,
  error: PropTypes.string,
  helperText: PropTypes.string,
  required: PropTypes.bool,
  className: PropTypes.string,
  children: PropTypes.node,
};
