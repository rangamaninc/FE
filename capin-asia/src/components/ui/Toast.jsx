import { createContext, useCallback, useContext, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { X } from "lucide-react";
import { cn } from "../../utils/cn";

const ToastContext = createContext(undefined);

const variantClasses = {
  default: "border-border bg-card text-foreground",
  success: "border-success bg-lightsuccess text-success",
  warning: "border-warning bg-lightwarning text-warning",
  error: "border-error bg-lighterror text-error",
  destructive: "border-error bg-lighterror text-error",
  info: "border-info bg-lightinfo text-info",
};

/** ToastProvider — lightweight toast notification system. */
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const toast = useCallback(
    ({ title, description, variant = "default", duration = 4000 }) => {
      const id = crypto.randomUUID();
      setToasts((current) => [...current, { id, title, description, variant }]);

      if (duration > 0) {
        window.setTimeout(() => dismiss(id), duration);
      }

      return id;
    },
    [dismiss]
  );

  const value = useMemo(() => ({ toast, dismiss }), [toast, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex w-full max-w-sm flex-col gap-2">
        {toasts.map(({ id, title, description, variant }) => (
          <div
            key={id}
            className={cn(
              "rounded-lg border p-4 shadow-lg transition-all animate-in slide-in-from-right",
              variantClasses[variant]
            )}
            role="status"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                {title ? <p className="font-semibold">{title}</p> : null}
                {description ? (
                  <p className="mt-1 text-sm opacity-90">{description}</p>
                ) : null}
              </div>
              <button
                type="button"
                onClick={() => dismiss(id)}
                className="rounded-sm opacity-70 hover:opacity-100"
                aria-label="Dismiss notification"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

ToastProvider.propTypes = { children: PropTypes.node };

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
}
