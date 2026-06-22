function escapeCsvValue(value) {
  const str = value == null ? "" : String(value);
  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/** Download rows as a CSV file (opens in Excel). */
export function downloadExcelFromRows({ rows, columns, fileName = "export" }) {
  if (!rows?.length || !columns?.length) {
    return;
  }

  const headerRow = columns.map((col) => escapeCsvValue(col.header)).join(",");
  const dataRows = rows.map((row) =>
    columns
      .map((col) => {
        const value =
          typeof col.accessor === "function"
            ? col.accessor(row)
            : row[col.accessor];
        return escapeCsvValue(value);
      })
      .join(",")
  );

  const csv = ["\uFEFF" + headerRow, ...dataRows].join("\r\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${fileName}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/** Build an Excel download handler from TanStack Table column definitions. */
export function createDataTableExcelDownload(data, columns, fileName) {
  return () => {
    const exportColumns = columns
      .filter((col) => col.id !== "actions")
      .map((col) => ({
        header:
          typeof col.header === "string"
            ? col.header
            : col.accessorKey || col.id || "Column",
        accessor: (row) => {
          if (col.meta?.exportValue) {
            return col.meta.exportValue(row);
          }
          if (col.accessorFn) {
            return col.accessorFn(row);
          }
          if (col.accessorKey) {
            return row[col.accessorKey];
          }
          return "";
        },
      }));

    downloadExcelFromRows({ rows: data, columns: exportColumns, fileName });
  };
}
