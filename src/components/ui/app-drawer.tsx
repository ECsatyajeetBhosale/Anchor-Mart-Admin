import type * as React from "react";
import { useCallback, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

type AppDrawerSize = "sm" | "md" | "lg" | "xl" | "full";

const appDrawerSizeClasses: Record<AppDrawerSize, string> = {
  sm: "w-full sm:max-w-sm",
  md: "w-full sm:max-w-lg",
  lg: "w-full sm:max-w-2xl",
  xl: "w-full sm:max-w-4xl",
  full: "w-full sm:max-w-full",
};

const appDrawerDefaultWidths: Record<AppDrawerSize, number> = {
  sm: 384,
  md: 512,
  lg: 672,
  xl: 896,
  full: 1200,
};

interface AppDrawerProps {
  open: boolean;
  onClose: () => void;
  title: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  size?: AppDrawerSize;
  resizable?: boolean;
  defaultWidth?: number;
  minWidth?: number;
  maxWidth?: number;
  widthClassName?: string;
  className?: string;
  bodyClassName?: string;
  headerClassName?: string;
  footerClassName?: string;
}

function useDrawerResize({
  side,
  size,
  resizable,
  defaultWidth,
  minWidth,
  maxWidth,
}: {
  side: "top" | "right" | "bottom" | "left";
  size: AppDrawerSize;
  resizable: boolean;
  defaultWidth?: number;
  minWidth: number;
  maxWidth?: number;
}) {
  const isHorizontalDrawer = side === "right" || side === "left";
  const canResize = resizable && isHorizontalDrawer;
  const [drawerWidth, setDrawerWidth] = useState(defaultWidth ?? appDrawerDefaultWidths[size]);

  const handleResizeStart = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      if (!canResize) return;

      event.preventDefault();

      const maxAllowedWidth = maxWidth ?? Math.max(minWidth, window.innerWidth - 48);

      const handleMouseMove = (moveEvent: MouseEvent) => {
        const nextWidth =
          side === "right" ? window.innerWidth - moveEvent.clientX : moveEvent.clientX;
        setDrawerWidth(Math.min(Math.max(nextWidth, minWidth), maxAllowedWidth));
      };

      const handleMouseUp = () => {
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };

      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    },
    [canResize, maxWidth, minWidth, side],
  );

  return {
    canResize,
    drawerWidth,
    handleResizeStart,
  };
}

export function AppDrawer({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  side = "right",
  size = "md",
  resizable = true,
  defaultWidth,
  minWidth = 360,
  maxWidth,
  widthClassName,
  className,
  bodyClassName,
  headerClassName,
  footerClassName,
}: AppDrawerProps) {
  const { canResize, drawerWidth, handleResizeStart } = useDrawerResize({
    side,
    size,
    resizable,
    defaultWidth,
    minWidth,
    maxWidth,
  });

  return (
    <Sheet open={open} onOpenChange={(nextOpen) => !nextOpen && onClose()}>
      <SheetContent
        side={side}
        className={cn(
          "bg-card p-0",
          canResize ? "max-w-none sm:max-w-none" : appDrawerSizeClasses[size],
          widthClassName,
          className,
        )}
        style={
          canResize
            ? {
                width: `min(${drawerWidth}px, 100vw)`,
                maxWidth: "100vw",
              }
            : undefined
        }
      >
        {canResize && (
          <button
            type="button"
            aria-label="Resize drawer"
            onMouseDown={handleResizeStart}
            className={cn(
              "absolute inset-y-0 z-10 w-1 cursor-col-resize bg-transparent transition hover:bg-border",
              side === "right" ? "left-0" : "right-0",
            )}
          />
        )}

        <SheetHeader className={cn("border-b border-border bg-muted/20 p-6", headerClassName)}>
          <SheetTitle className="text-sm font-semibold">{title}</SheetTitle>
          {description && (
            <SheetDescription className="text-xs text-muted-foreground">
              {description}
            </SheetDescription>
          )}
        </SheetHeader>

        <div className={cn("scrollbar-hide flex-1 overflow-y-auto p-6", bodyClassName)}>
          {children}
        </div>

        {footer && (
          <SheetFooter className={cn("border-t border-border bg-muted/20 p-4", footerClassName)}>
            {footer}
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}

interface AppFormDrawerProps extends Omit<AppDrawerProps, "children"> {
  onSubmit: React.FormEventHandler<HTMLFormElement>;
  children: React.ReactNode;
}

export function AppFormDrawer({ onSubmit, children, ...props }: AppFormDrawerProps) {
  const side = props.side ?? "right";
  const size = props.size ?? "md";
  const { canResize, drawerWidth, handleResizeStart } = useDrawerResize({
    side,
    size,
    resizable: props.resizable ?? true,
    defaultWidth: props.defaultWidth,
    minWidth: props.minWidth ?? 360,
    maxWidth: props.maxWidth,
  });

  return (
    <Sheet open={props.open} onOpenChange={(nextOpen) => !nextOpen && props.onClose()}>
      <SheetContent
        side={side}
        className={cn(
          "bg-card p-0",
          canResize ? "max-w-none sm:max-w-none" : appDrawerSizeClasses[size],
          props.widthClassName,
          props.className,
        )}
        style={
          canResize
            ? {
                width: `min(${drawerWidth}px, 100vw)`,
                maxWidth: "100vw",
              }
            : undefined
        }
      >
        {canResize && (
          <button
            type="button"
            aria-label="Resize drawer"
            onMouseDown={handleResizeStart}
            className={cn(
              "absolute inset-y-0 z-10 w-1 cursor-col-resize bg-transparent transition hover:bg-border",
              side === "right" ? "left-0" : "right-0",
            )}
          />
        )}

        <form onSubmit={onSubmit} className="flex h-full flex-col">
          <SheetHeader
            className={cn("border-b border-border bg-muted/20 p-6", props.headerClassName)}
          >
            <SheetTitle className="text-sm font-semibold">{props.title}</SheetTitle>
            {props.description && (
              <SheetDescription className="text-xs text-muted-foreground">
                {props.description}
              </SheetDescription>
            )}
          </SheetHeader>

          <div className={cn("scrollbar-hide flex-1 overflow-y-auto p-6", props.bodyClassName)}>
            {children}
          </div>

          {props.footer && (
            <SheetFooter
              className={cn("border-t border-border bg-muted/20 p-4", props.footerClassName)}
            >
              {props.footer}
            </SheetFooter>
          )}
        </form>
      </SheetContent>
    </Sheet>
  );
}
