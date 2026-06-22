import PropTypes from "prop-types";
import { Outlet } from "react-router-dom";
import { cn } from "../utils/cn";

/** AuthLayout — centered layout for sign-in and authentication pages. */
export default function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="grid min-h-screen bg-muted/30 lg:grid-cols-2">
      <div className="hidden flex-col justify-between bg-primary p-10 text-white lg:flex">
        <div>
          <p className="text-2xl font-bold">CapinAsia</p>
          <p className="mt-2 max-w-md text-sm text-white/80">
            Modern captive management platform with accounting, working papers,
            and admin workflows.
          </p>
        </div>
        <p className="text-sm text-white/70">Secure. Responsive. Component-driven.</p>
      </div>
      <div className="flex items-center justify-center px-6 py-10">
        <div className={cn("w-full max-w-md space-y-6 rounded-2xl border border-border bg-card p-8 shadow-sm")}>
          {title ? (
            <div className="space-y-1 text-center">
              <h1 className="text-2xl font-bold">{title}</h1>
              {subtitle ? <p className="text-sm text-muted-foreground">{subtitle}</p> : null}
            </div>
          ) : null}
          {children || <Outlet />}
        </div>
      </div>
    </div>
  );
}

AuthLayout.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string,
  subtitle: PropTypes.string,
};
