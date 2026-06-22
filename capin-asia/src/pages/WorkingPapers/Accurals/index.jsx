import { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Plus } from "lucide-react";

import AddNewAccuralModal from "./AddNewAccuralModal";
import { addNewAccuralEntry, getAccurals } from "../../../api/accurals";
import { getSelectedClient } from "../../../redux/globalSlice";
import { MONTHS } from "../constants";
import WorkingPapersPageLayout from "../WorkingPapersPageLayout";
import MonthSelect from "../MonthSelect";
import { Button, DataTable, useToast } from "../../../components/ui";
import {
  amountColumn,
  dateColumn,
} from "../workingPapersUtils";

function Accurals() {
  const selectedClient = useSelector(getSelectedClient);
  const { toast } = useToast();
  const [showModal, setShowModal] = useState(false);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(MONTHS[0]);

  const fetchData = useCallback(async () => {
    if (!selectedClient?.id) {
      setRecords([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const res = await getAccurals(selectedClient.id, selectedMonth);
      if (res.success) {
        setRecords(res.accruedData);
      } else {
        setRecords([]);
      }
    } catch {
      setRecords([]);
    } finally {
      setLoading(false);
    }
  }, [selectedClient, selectedMonth]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const columns = useMemo(
    () => [
      { accessorKey: "glCode", header: "GL Code" },
      amountColumn("amount", "Accural Amount"),
      dateColumn("fromDate", "Period From"),
      dateColumn("toDate", "Period To"),
      amountColumn("numberOfDaysPaid", "Number of Days Paid"),
      amountColumn("numberOfDaysExpensed", "Number of Days Expensed"),
      amountColumn("currentExpenseofYear", "Current Expense of Year"),
      amountColumn("expenseForYear", "Total expense"),
      amountColumn("paymentDuringYear", "Payment During Year"),
      amountColumn("closingBalanceasBL", "Accural Closing Balance"),
      { accessorKey: "expenseMethodology", header: "Previous Expense of Year" },
    ],
    []
  );

  const handleSave = async (data) => {
    try {
      await addNewAccuralEntry(selectedClient.id, data);
      setShowModal(false);
      toast({ title: "Accrual entry added" });
      fetchData();
    } catch {
      toast({
        title: "Failed to add accrual entry",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <AddNewAccuralModal
        showModal={showModal}
        handleSave={handleSave}
        handleClose={() => setShowModal(false)}
      />

      <WorkingPapersPageLayout
        title="Accurals"
        subtitle={`Accrual entries for ${selectedMonth}.`}
        loading={loading}
        loadingLabel="Loading accruals..."
        action={
          <Button
            type="button"
            className="w-fit shrink-0 self-end sm:self-auto"
            onClick={() => setShowModal(true)}
          >
            <Plus className="h-4 w-4" />
            Add Entry
          </Button>
        }
        filters={
          <MonthSelect
            value={selectedMonth}
            onChange={setSelectedMonth}
          />
        }
      >
        <DataTable
          className="flex-1"
          columns={columns}
          data={records}
          pageSize={10}
          onRefresh={fetchData}
          isRefreshing={loading}
          excelFileName="accurals"
          showRowActions={false}
          emptyTitle="No accrual records"
          emptyDescription="Add an entry or choose a different month."
        />
      </WorkingPapersPageLayout>
    </>
  );
}

export default Accurals;
