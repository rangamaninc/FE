import { Pencil, Trash2 } from "lucide-react";
import { Button } from "./Button";

export function createRowActionsColumn({ onEdit, onDelete } = {}) {
  return {
    id: "actions",
    header: "Actions",
    enableSorting: false,
    cell: ({ row }) => (
      <div className="flex items-center gap-1">
        {onEdit ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onEdit(row.original)}
            aria-label="Edit row"
            title="Edit"
          >
            <Pencil className="h-4 w-4" />
          </Button>
        ) : null}
        {onDelete ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onDelete(row.original)}
            aria-label="Delete row"
            title="Delete"
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        ) : null}
      </div>
    ),
  };
}
