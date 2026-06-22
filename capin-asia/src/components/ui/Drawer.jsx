import { forwardRef } from "react";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import PropTypes from "prop-types";
import { cn } from "../../utils/cn";

const Drawer = SheetPrimitive.Root;
const DrawerTrigger = SheetPrimitive.Trigger;
const DrawerClose = SheetPrimitive.Close;
const DrawerPortal = SheetPrimitive.Portal;

const DrawerOverlay = forwardRef(function DrawerOverlay({ className, ...props }, ref) {
  return (
    <SheetPrimitive.Overlay
      className={cn("fixed inset-0 z-50 bg-black/80", className)}
      {...props}
      ref={ref}
    />
  );
});

const DrawerContent = forwardRef(function DrawerContent(
  { className, children, side = "right", ...props },
  ref
) {
  return (
    <DrawerPortal>
      <DrawerOverlay />
      <SheetPrimitive.Content
        ref={ref}
        className={cn(
          "fixed z-50 flex h-full flex-col gap-4 bg-card p-6 shadow-lg transition ease-in-out",
          side === "right" && "inset-y-0 right-0 w-full max-w-sm border-l border-border",
          side === "left" && "inset-y-0 left-0 w-full max-w-sm border-r border-border",
          className
        )}
        {...props}
      >
        {children}
        <SheetPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </SheetPrimitive.Close>
      </SheetPrimitive.Content>
    </DrawerPortal>
  );
});

DrawerContent.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
  side: PropTypes.oneOf(["left", "right"]),
};

export {
  Drawer,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerOverlay,
  DrawerPortal,
};
