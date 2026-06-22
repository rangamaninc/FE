import { useMemo } from "react";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import PropTypes from "prop-types";
import { cn } from "../../utils/cn";
import { createDataTableExcelDownload } from "../../utils/exportTableData";
import EmptyState from "./EmptyState";
import Spinner from "./Spinner";
import TableFooter from "./TableFooter";
import TableLayout from "./TableLayout";
import { createRowActionsColumn } from "./tableActions";
import {
  getTableRowClassName,
  TABLE_BODY_CELL_CLASS,
  TABLE_CLASS,
  TABLE_HEAD_CELL_CLASS,
  TABLE_WRAPPER_CLASS,
} from "./tableStyles";

/**
 * DataTable — sortable, paginated table built on TanStack Table.
 */
export default function DataTable({
  columns,
  data,
  isLoading = false,
  isRefreshing = false,
  emptyTitle = "No records",
  emptyDescription,
  pageSize = 10,
  className,
  onRefresh,
  onExcelDownload,
  excelFileName,
  onEdit,
  onDelete,
  showRowActions,
}) {
  const tableColumns = useMemo(() => {
    const hasActionsColumn = columns.some((column) => column.id === "actions");
    const canShowRowActions =
      showRowActions ?? Boolean(onEdit || onDelete);

    if (!canShowRowActions || hasActionsColumn || (!onEdit && !onDelete)) {
      return columns;
    }

    return [...columns, createRowActionsColumn({ onEdit, onDelete })];
  }, [columns, onEdit, onDelete, showRowActions]);

  const table = useReactTable({
    data,
    columns: tableColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize } },
  });

  const resolvedExcelDownload = useMemo(() => {
    if (onExcelDownload) {
      return onExcelDownload;
    }
    if (excelFileName) {
      return createDataTableExcelDownload(data, tableColumns, excelFileName);
    }
    return undefined;
  }, [onExcelDownload, excelFileName, data, tableColumns]);

  const footer = (
    <TableFooter
      onRefresh={onRefresh}
      onExcelDownload={resolvedExcelDownload}
      isRefreshing={isRefreshing || isLoading}
      pageIndex={table.getState().pagination.pageIndex}
      pageCount={Math.max(table.getPageCount(), 1)}
      onPrevious={() => table.previousPage()}
      onNext={() => table.nextPage()}
      canPrevious={table.getCanPreviousPage()}
      canNext={table.getCanNextPage()}
    />
  );

  if (isLoading && !data?.length) {
    return (
      <TableLayout className={className} footer={footer}>
        <div className="flex min-h-[240px] items-center justify-center">
          <Spinner />
        </div>
      </TableLayout>
    );
  }

  if (!data?.length) {
    return (
      <TableLayout className={className} footer={footer}>
        <EmptyState title={emptyTitle} description={emptyDescription} />
      </TableLayout>
    );
  }

  return (
    <TableLayout className={className} footer={footer}>
      <div className={TABLE_WRAPPER_CLASS}>
        <table className={TABLE_CLASS}>
          <thead className="bg-muted/60">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className={TABLE_HEAD_CELL_CLASS}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className={getTableRowClassName(row.index)}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className={TABLE_BODY_CELL_CLASS}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </TableLayout>
  );
}

DataTable.propTypes = {
  columns: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
  isLoading: PropTypes.bool,
  isRefreshing: PropTypes.bool,
  emptyTitle: PropTypes.string,
  emptyDescription: PropTypes.string,
  pageSize: PropTypes.number,
  className: PropTypes.string,
  onRefresh: PropTypes.func,
  onExcelDownload: PropTypes.func,
  excelFileName: PropTypes.string,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  showRowActions: PropTypes.bool,
};
