import { useMemo } from "react";
import PropTypes from "prop-types";
import DataTable from "../../components/ui/DataTable";
import { Badge } from "../../components/ui/Badge";
import {
  formatBalanceAmount,
  formatBalanceType,
  formatGlCodeLabel,
  formatOpeningDate,
} from "./openingBalanceUtils";

/** OpeningBalanceTable — TailAdmin-styled data table for opening balances. */
export default function OpeningBalanceTable({
  records,
  glCodesMap,
  onEdit,
  onDelete,
  onRefresh,
  isRefreshing,
  excelFileName,
  className,
}) {
  const columns = useMemo(
    () => [
      {
        accessorKey: "glCode",
        header: "GL Code",
        cell: ({ row }) => {
          const { glCode, glName } = row.original;
          return formatGlCodeLabel(glCode, glName ?? glCodesMap[glCode]);
        },
        meta: {
          exportValue: (row) =>
            formatGlCodeLabel(row.glCode, row.glName ?? glCodesMap[row.glCode]),
        },
      },
      {
        accessorKey: "financialYear",
        header: "Financial Year",
        cell: ({ row }) => row.original.financialYear || "-",
      },
      {
        accessorKey: "openingBalanceDate",
        header: "Balance Date",
        cell: ({ row }) => formatOpeningDate(row.original.openingBalanceDate),
        meta: {
          exportValue: (row) => formatOpeningDate(row.openingBalanceDate),
        },
      },
      {
        accessorKey: "amount",
        header: "Balance Amount",
        cell: ({ row }) => (
          <span className="block text-right font-medium tabular-nums">
            {formatBalanceAmount(
              row.original.amount,
              row.original.currencyCode
            )}
          </span>
        ),
        meta: {
          exportValue: (row) =>
            formatBalanceAmount(row.amount, row.currencyCode),
        },
      },
      {
        accessorKey: "balanceType",
        header: "Type",
        cell: ({ row }) => {
          const type = formatBalanceType(
            row.original.balanceType ?? row.original.isDebit
          );
          return (
            <Badge variant={type === "Debit" ? "warning" : "success"}>
              {type}
            </Badge>
          );
        },
        meta: {
          exportValue: (row) =>
            formatBalanceType(row.balanceType ?? row.isDebit),
        },
      },
      {
        accessorKey: "postingStatus",
        header: "Status",
        cell: ({ row }) => {
          const status = row.original.postingStatus || "DRAFT";
          return (
            <Badge variant={status === "POSTED" ? "success" : "warning"}>
              {status}
            </Badge>
          );
        },
        meta: {
          exportValue: (row) => row.postingStatus || "DRAFT",
        },
      },
      {
        accessorKey: "updatedBy",
        header: "Updated By",
        cell: ({ row }) => row.original.updatedBy || "-",
      },
    ],
    [glCodesMap]
  );

  return (
    <DataTable
      className={className}
      columns={columns}
      data={records}
      emptyTitle="No opening balance records found"
      emptyDescription="Add a new balance to get started."
      pageSize={10}
      onRefresh={onRefresh}
      isRefreshing={isRefreshing}
      excelFileName={excelFileName}
      onEdit={onEdit}
      onDelete={onDelete}
    />
  );
}

OpeningBalanceTable.propTypes = {
  records: PropTypes.array.isRequired,
  glCodesMap: PropTypes.object,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  onRefresh: PropTypes.func,
  isRefreshing: PropTypes.bool,
  excelFileName: PropTypes.string,
  className: PropTypes.string,
};