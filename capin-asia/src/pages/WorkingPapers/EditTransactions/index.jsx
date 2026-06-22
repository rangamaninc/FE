import { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";

import { CASHBOOKS_LIST, MONTHS } from "../constants";
import { getSelectedClient } from "../../../redux/globalSlice";
import { getAllTransactionsOfClient } from "../../../api/cashbook";
import EditTransactionModal from "./EditTransactionModal";
import WorkingPapersPageLayout from "../WorkingPapersPageLayout";
import {
  DataTable,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui";
import {
  amountColumn,
  dateColumn,
} from "../workingPapersUtils";

function EditTransactions() {
  const selectedClient = useSelector(getSelectedClient);
  const [selectedCashBook, setSelectedCashBook] = useState(
    CASHBOOKS_LIST.length > 0 ? CASHBOOKS_LIST[0].code : ""
  );
  const [selectedMonth, setSelectedMonth] = useState(1);
  const [loading, setLoading] = useState(true);
  const [txnsData, setTxnsData] = useState([]);
  const [editTxnModalData, setEditTxnModalData] = useState({
    transactionId: 0,
    showModal: false,
    glCode: "",
    amount: "",
    description: "",
    transactionType: "",
    transactionDate: "",
  });

  const selectedCashBookLabel = useMemo(
    () =>
      CASHBOOKS_LIST.find((cashbook) => cashbook.code === selectedCashBook)
        ?.desc ?? "Cash book",
    [selectedCashBook]
  );

  const selectedMonthLabel = MONTHS[selectedMonth - 1] ?? "";

  const fetchTransactions = useCallback(async () => {
    if (!selectedClient?.id || !selectedCashBook) {
      setTxnsData([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const txnData = await getAllTransactionsOfClient(
        selectedClient.id,
        selectedCashBook,
        selectedMonth
      );
      setTxnsData(txnData.transactions ?? []);
    } catch {
      setTxnsData([]);
    } finally {
      setLoading(false);
    }
  }, [selectedClient, selectedCashBook, selectedMonth]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const columns = useMemo(
    () => [
      { accessorKey: "glcode", header: "GL code" },
      { accessorKey: "transactionId", header: "Transaction Id" },
      amountColumn("amount", "Amount"),
      dateColumn("transactionDate", "Transaction date"),
      { accessorKey: "transactionType", header: "Transaction type" },
    ],
    []
  );

  const handleEdit = useCallback((row) => {
    const {
      glcode,
      transactionId,
      amount,
      description,
      transactionType,
      transactionDate,
    } = row;
    setEditTxnModalData({
      transactionId,
      showModal: true,
      glCode: glcode,
      amount: parseFloat(amount),
      description,
      transactionType,
      transactionDate,
    });
  }, []);

  const closeModal = () => {
    setEditTxnModalData({
      transactionId: 0,
      showModal: false,
      glCode: "",
      amount: "",
      description: "",
      transactionType: "",
      transactionDate: "",
    });
    fetchTransactions();
  };

  return (
    <>
      <EditTransactionModal
        showModal={editTxnModalData.showModal}
        handleClose={closeModal}
        selectedClientId={selectedClient.id}
        selectedGLCode={editTxnModalData.glCode}
        selectedTransactionId={editTxnModalData.transactionId}
        txnData={editTxnModalData}
      />

      <WorkingPapersPageLayout
        title="Edit Transactions"
        subtitle={`Transactions for ${selectedCashBookLabel} — ${selectedMonthLabel}.`}
        loading={loading}
        loadingLabel="Loading transactions..."
        filters={
          <>
            {CASHBOOKS_LIST.length > 0 ? (
              <Select
                value={String(selectedCashBook)}
                onValueChange={(value) => setSelectedCashBook(Number(value))}
              >
                <SelectTrigger className="w-[220px]">
                  <SelectValue placeholder="Select cash book" />
                </SelectTrigger>
                <SelectContent>
                  {CASHBOOKS_LIST.map((cashbook) => (
                    <SelectItem
                      key={cashbook.code}
                      value={String(cashbook.code)}
                    >
                      {cashbook.desc}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : null}
            <Select
              value={String(selectedMonth - 1)}
              onValueChange={(value) => setSelectedMonth(Number(value) + 1)}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select month" />
              </SelectTrigger>
              <SelectContent>
                {MONTHS.map((month, index) => (
                  <SelectItem key={month} value={String(index)}>
                    {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </>
        }
      >
        <DataTable
          className="flex-1"
          columns={columns}
          data={txnsData}
          pageSize={10}
          onEdit={handleEdit}
          onRefresh={fetchTransactions}
          isRefreshing={loading}
          excelFileName="transactions"
          emptyTitle="No transactions found"
          emptyDescription="Adjust filters or add entries in Cash Book."
        />
      </WorkingPapersPageLayout>
    </>
  );
}

export default EditTransactions;
