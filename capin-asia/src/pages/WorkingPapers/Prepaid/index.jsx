import { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";

import { MONTHS } from "../constants";
import { getPrepaidMonthlyReport } from "../../../api/prepaid";
import { getSelectedClient } from "../../../redux/globalSlice";
import WorkingPapersPageLayout from "../WorkingPapersPageLayout";
import MonthSelect from "../MonthSelect";
import { DataTable } from "../../../components/ui";
import {
  amountColumn,
  dateColumn,
} from "../workingPapersUtils";

const Prepaid = () => {
  const selectedClient = useSelector(getSelectedClient);
  const [selectedMonth, setSelectedMonth] = useState(MONTHS[0]);
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMonthlyReport = useCallback(async () => {
    if (!selectedClient?.id) {
      setReportData([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const monthlyData = await getPrepaidMonthlyReport(
        selectedClient.id,
        selectedMonth
      );
      setReportData(monthlyData ?? []);
    } catch {
      setReportData([]);
    } finally {
      setLoading(false);
    }
  }, [selectedClient, selectedMonth]);

  useEffect(() => {
    fetchMonthlyReport();
  }, [fetchMonthlyReport]);

  const columns = useMemo(
    () => [
      { accessorKey: "glcode", header: "GL code" },
      amountColumn("amount", "Amount"),
      amountColumn("closingBalance", "Closing Balance"),
      amountColumn("expenseTillDate", "Expense till date"),
      amountColumn("expenseForTheYear", "Expense for the year"),
      amountColumn("noOfMonthsDaysExpensedFor", "No of months/days expensed for"),
      amountColumn("noOfMonthsDaysPaidFor", "No of months/days paid for"),
      dateColumn("prepaidEndDate", "Prepaid end date"),
      dateColumn("prepaidStartDate", "Prepaid start date"),
      { accessorKey: "description", header: "Description" },
    ],
    []
  );

  return (
    <WorkingPapersPageLayout
      title="Prepaid"
      subtitle={`Prepaid monthly report for ${selectedMonth}.`}
      loading={loading}
      loadingLabel="Loading prepaid report..."
      filters={
        <MonthSelect value={selectedMonth} onChange={setSelectedMonth} />
      }
    >
      <DataTable
        className="flex-1"
        columns={columns}
        data={reportData}
        pageSize={10}
        onRefresh={fetchMonthlyReport}
        isRefreshing={loading}
        excelFileName="prepaid"
        showRowActions={false}
        emptyTitle="No prepaid records"
        emptyDescription="Choose a different month to view data."
      />
    </WorkingPapersPageLayout>
  );
};

export default Prepaid;
