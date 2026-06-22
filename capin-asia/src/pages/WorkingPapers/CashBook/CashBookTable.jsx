import { useMemo } from "react";
import PropTypes from "prop-types";
import { DataTable } from "../../../components/ui";
import { amountColumn } from "../workingPapersUtils";

export default function CashBookTable({
  records,
  onRefresh,
  isRefreshing,
  className,
}) {
  const columns = useMemo(
    () => [
      { accessorKey: "month", header: "Month" },
      amountColumn("openingBalance", "Opening Balance"),
      amountColumn("receiptsReceived", "Receipts Received"),
      amountColumn("paymentsReceived", "Payments Payable"),
      amountColumn("closingBalance", "Closing Balance"),
    ],
    []
  );

  return (
    <DataTable
      className={className}
      columns={columns}
      data={records}
      pageSize={12}
      isRefreshing={isRefreshing}
      emptyTitle="No cash book records found"
      emptyDescription="Add an entry to get started."
      onRefresh={onRefresh}
      excelFileName="cashbook"
      showRowActions={false}
    />
  );
}

CashBookTable.propTypes = {
  records: PropTypes.array.isRequired,
  onRefresh: PropTypes.func,
  isRefreshing: PropTypes.bool,
  className: PropTypes.string,
};
