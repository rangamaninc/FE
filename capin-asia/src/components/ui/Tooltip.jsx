import { forwardRef } from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import PropTypes from "prop-types";
import { cn } from "../../utils/cn";

const TooltipProvider = TooltipPrimitive.Provider;
const Tooltip = TooltipPrimitive.Root;
const TooltipTrigger = TooltipPrimitive.Trigger;

const TooltipContent = forwardRef(function TooltipContent(
  { className, sideOffset = 4, ...props },
  ref
) {
  return (
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "z-50 overflow-hidden rounded-md border border-border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md",
        className
      )}
      {...props}
    />
  );
});

TooltipContent.propTypes = { className: PropTypes.string, sideOffset: PropTypes.number };

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
