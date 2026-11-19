"use client";

import { useEffect, useId, useLayoutEffect, useRef } from "react";
import { X } from "lucide-react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: React.ReactNode;
  size?: "md" | "lg";
  children: React.ReactNode;
}

const supportsClosedBy =
  typeof HTMLDialogElement !== "undefined" && "closedBy" in HTMLDialogElement.prototype;

// Native modal <dialog>: the browser handles focus containment, Esc, the inert page and focus return.
export default function Modal({ open, onClose, title, description, size = "lg", children }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const openRef = useRef(open);
  const onCloseRef = useRef(onClose);
  const titleId = useId();
  openRef.current = open;
  onCloseRef.current = onClose;

  // Layout effect so the dialog is closed (and focus returned) before React removes it on unmount.
  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      // React's autoFocus doesn't render the attribute the dialog looks for, so mark the field instead.
      dialog.querySelector<HTMLElement>("[data-autofocus]")?.focus();
    }
    if (!open && dialog.open) dialog.close();
    return () => {
      if (dialog.open) dialog.close();
    };
  }, [open]);

  // Esc, the back gesture and light dismiss all end in "close"; tell the parent unless it closed us.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const handleClose = () => openRef.current && onCloseRef.current();
    dialog.addEventListener("close", handleClose);
    return () => dialog.removeEventListener("close", handleClose);
  }, []);

  // Click-outside fallback where closedby="any" is unsupported (Safari). Checks pointer position,
  // not event.target, because the dialog is also the target for its own padding.
  const pressedOutside = useRef(false);
  function isOutside(e: React.PointerEvent<HTMLDialogElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    return e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      {...({ closedby: "any" } as object)}
      onPointerDown={supportsClosedBy ? undefined : (e) => (pressedOutside.current = isOutside(e))}
      onPointerUp={
        supportsClosedBy ? undefined : (e) => pressedOutside.current && isOutside(e) && dialogRef.current?.close()
      }
      className={`modal m-auto max-h-[90vh] w-[calc(100%-2rem)] flex-col overflow-hidden rounded-2xl border border-line bg-surface p-0 text-ink shadow-2xl open:flex ${
        size === "md" ? "max-w-md" : "max-w-lg"
      }`}
    >
      <div className="flex items-start justify-between gap-4 border-b border-line px-5 py-4">
        <div className="min-w-0">
          <h2 id={titleId} className="text-base font-semibold text-ink">
            {title}
          </h2>
          {description && <p className="mt-0.5 truncate text-xs text-ink-muted">{description}</p>}
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="-m-1 rounded-lg p-1.5 text-ink-subtle hover:bg-surface-muted hover:text-ink"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
      {children}
    </dialog>
  );
}

// Shared pieces so every modal body and footer line up.
export function ModalBody({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return <div className={`flex-1 overflow-y-auto px-5 py-5 ${className}`}>{children}</div>;
}

export function ModalFooter({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-end gap-2 border-t border-line bg-surface-muted/40 px-5 py-4">
      {children}
    </div>
  );
}

export const modalButton = {
  secondary:
    "rounded-lg border border-line bg-surface px-4 py-2 text-sm font-medium text-ink-muted hover:bg-surface-muted",
  primary:
    "flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white shadow-xs hover:bg-brand-strong disabled:opacity-70",
};

export const modalField =
  "w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm text-ink shadow-xs placeholder:text-ink-subtle focus:border-brand focus:outline-hidden focus:ring-2 focus:ring-brand/20";
