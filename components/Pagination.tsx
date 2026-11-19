"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

// Up to 7 slots: always first and last, the current page with its neighbours, gaps as "…".
function pageList(current: number, total: number): (number | "gap")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const start = Math.max(2, Math.min(current - 1, total - 4));
  const end = Math.min(total - 1, Math.max(current + 1, 5));
  const middle = Array.from({ length: end - start + 1 }, (_, i) => start + i);
  return [1, ...(start > 2 ? ["gap" as const] : []), ...middle, ...(end < total - 1 ? ["gap" as const] : []), total];
}

const navButtonClass =
  "flex h-8 w-8 items-center justify-center rounded-lg border border-line text-ink-muted hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-40";

export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
}: PaginationProps) {
  const start = (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line px-4 py-3 text-sm text-ink-muted">
      <p>
        Showing{" "}
        <span className="font-medium tabular-nums text-ink">
          {totalItems === 0 ? 0 : start}–{end}
        </span>{" "}
        of <span className="font-medium tabular-nums text-ink">{totalItems}</span> items
      </p>
      <nav aria-label="Pagination" className="flex items-center gap-1">
        <button
          type="button"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          aria-label="Previous page"
          className={navButtonClass}
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
        </button>
        {pageList(currentPage, totalPages).map((page, i) =>
          page === "gap" ? (
            <span key={`gap-${i}`} aria-hidden="true" className="w-6 text-center text-ink-subtle">
              …
            </span>
          ) : (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange(page)}
              aria-label={`Page ${page}`}
              aria-current={page === currentPage ? "page" : undefined}
              className={`flex h-8 min-w-8 items-center justify-center rounded-lg px-2 text-sm font-medium tabular-nums ${
                page === currentPage ? "bg-brand text-white shadow-sm" : "text-ink-muted hover:bg-surface-muted"
              }`}
            >
              {page}
            </button>
          )
        )}
        <button
          type="button"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          aria-label="Next page"
          className={navButtonClass}
        >
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </nav>
    </div>
  );
}
