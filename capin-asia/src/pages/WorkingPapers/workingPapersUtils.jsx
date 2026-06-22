import dayjs from "dayjs";

export function formatAmount(value) {
  const num = Number(value);
  return Number.isFinite(num)
    ? num.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    : value ?? "-";
}

export function formatWpDate(value) {
  if (!value) return "-";
  const parsed = dayjs(value);
  return parsed.isValid() ? parsed.format("MM/DD/YYYY") : String(value);
}

export function AmountCell({ value }) {
  return (
    <span className="block text-right font-medium tabular-nums">
      {formatAmount(value)}
    </span>
  );
}

export function amountColumn(accessorKey, header) {
  return {
    accessorKey,
    header,
    cell: ({ row }) => <AmountCell value={row.original[accessorKey]} />,
    meta: { exportValue: (row) => row[accessorKey] },
  };
}

export function dateColumn(accessorKey, header) {
  return {
    accessorKey,
    header,
    cell: ({ row }) => formatWpDate(row.original[accessorKey]),
    meta: { exportValue: (row) => formatWpDate(row.original[accessorKey]) },
  };
}
