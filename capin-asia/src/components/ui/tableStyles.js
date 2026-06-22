/** Shared table layout classes used by DataTable and AppTable. */
export const TABLE_WRAPPER_CLASS =
  "overflow-x-auto rounded-xl border border-border bg-card shadow-sm";

export const TABLE_CLASS = "app-table w-full text-sm";

export const TABLE_HEAD_CELL_CLASS =
  "px-4 py-3 text-left text-sm font-semibold text-foreground";

export const TABLE_BODY_CELL_CLASS = "px-4 py-3 align-middle text-foreground";

export function getTableRowClassName(index) {
  return index % 2 === 1
    ? "border-t border-border bg-muted/30 transition-colors hover:bg-muted/45"
    : "border-t border-border bg-card transition-colors hover:bg-muted/45";
}
