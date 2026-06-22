import { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";

import {
  getReconcileRecords,
  updateReconcileRecord,
} from "../../../api/reconcile";
import { getSelectedClient } from "../../../redux/globalSlice";
import EditPrepaidModal from "./EditPrepaidModal";
import EditInsuranceModal from "./EditInsuranceModal";
import EditInvestmentModal from "./EditInvestmentModal";
import EditAccuralModal from "./EditAccuralModal";
import EditLossRunsModal from "./EditLossRunsModal";
import WorkingPapersPageLayout from "../WorkingPapersPageLayout";
import { DataTable } from "../../../components/ui";
import { amountColumn, dateColumn } from "../workingPapersUtils";

function Reconcile() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPrepaidModal, setShowPrepaidModal] = useState(false);
  const [showInsuranceModal, setShowInsuranceModal] = useState(false);
  const [showInvestmentModal, setShowInvestmentModal] = useState(false);
  const [showAccuralModal, setShowAccuralModal] = useState(false);
  const [showLossRunsModal, setShowLossRunsModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState({});
  const selectedClient = useSelector(getSelectedClient);

  const fetchRecords = useCallback(async () => {
    if (!selectedClient?.id) {
      setRecords([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const res = await getReconcileRecords(selectedClient.id);
      if (res.success) {
        setRecords(res.pendingSubTransactions);
      } else {
        setRecords([]);
      }
    } catch {
      setRecords([]);
    } finally {
      setLoading(false);
    }
  }, [selectedClient]);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  const openEditModal = useCallback((record) => {
    const { subtransactionType } = record;
    setSelectedRecord(record);

    if (subtransactionType === "PREPAID") {
      setShowPrepaidModal(true);
    } else if (subtransactionType === "INVESTMENT") {
      setShowInvestmentModal(true);
    } else if (subtransactionType === "ACCURAL") {
      setShowAccuralModal(true);
    } else if (subtransactionType === "LOSS RUNS") {
      setShowLossRunsModal(true);
    } else {
      setShowInsuranceModal(true);
    }
  }, []);

  const columns = useMemo(
    () => [
      dateColumn("transactionDate", "Transaction Date"),
      { accessorKey: "transactionType", header: "Transaction Type" },
      { accessorKey: "subtransactionType", header: "Sub Transaction Type" },
      { accessorKey: "glcode", header: "GL Code" },
      amountColumn("amount", "Amount"),
    ],
    []
  );

  const handleSave = async (reconcileData) => {
    const {
      transactionid,
      glcode,
      subtransactionType,
      transactionType,
      transactionDate,
    } = selectedRecord;
    const isInsuranceTransaction = subtransactionType === "INSURANCE";
    const isInvestmentTransaction = subtransactionType === "INVESTMENT";
    const isAccuralTransaction = subtransactionType === "ACCURAL";

    let bodyParams = {
      transactionId: transactionid,
      glCode: glcode,
      subtransactionType,
      transactionDate,
      transactionType,
    };

    if (isInsuranceTransaction) {
      const { policies } = reconcileData;
      bodyParams = { ...bodyParams, policies };
      setShowInsuranceModal(false);
    } else if (isInvestmentTransaction) {
      bodyParams = { ...bodyParams, ...reconcileData };
      setShowInvestmentModal(false);
    } else if (isAccuralTransaction) {
      setShowAccuralModal(false);
      bodyParams = { ...bodyParams, reconcileData };
    } else {
      setShowPrepaidModal(false);
      const { fromDate, toDate, monetisation } = reconcileData;
      bodyParams = {
        ...bodyParams,
        fromdate: fromDate,
        todate: toDate,
        monetisation,
      };
    }

    const res = await updateReconcileRecord(selectedClient.id, bodyParams);
    if (res.success) {
      fetchRecords();
    }
  };

  return (
    <>
      <EditPrepaidModal
        showModal={showPrepaidModal}
        handleClose={() => setShowPrepaidModal(false)}
        handleSave={handleSave}
        selectedRecord={selectedRecord}
      />
      <EditInsuranceModal
        showModal={showInsuranceModal}
        handleClose={() => setShowInsuranceModal(false)}
        selectedRecord={selectedRecord}
        handleSave={handleSave}
        clientId={selectedClient.id}
      />
      <EditInvestmentModal
        showModal={showInvestmentModal}
        handleClose={() => setShowInvestmentModal(false)}
        selectedRecord={selectedRecord}
        handleSave={handleSave}
        clientId={selectedClient.id}
      />
      <EditAccuralModal
        showModal={showAccuralModal}
        handleClose={() => setShowAccuralModal(false)}
        selectedRecord={selectedRecord}
        handleSave={handleSave}
        clientId={selectedClient.id}
      />
      <EditLossRunsModal
        showModal={showLossRunsModal}
        handleClose={() => setShowLossRunsModal(false)}
        selectedRecord={selectedRecord}
        handleSave={handleSave}
        clientId={selectedClient.id}
      />

      <WorkingPapersPageLayout
        title="Reconcile Pending Transactions"
        subtitle="Review and reconcile pending sub-transactions."
        loading={loading}
        loadingLabel="Loading pending transactions..."
      >
        <DataTable
          className="flex-1"
          columns={columns}
          data={records}
          pageSize={10}
          onEdit={openEditModal}
          onRefresh={fetchRecords}
          isRefreshing={loading}
          excelFileName="reconcile-pending"
          emptyTitle="No pending transactions"
          emptyDescription="All sub-transactions are reconciled."
        />
      </WorkingPapersPageLayout>
    </>
  );
}

export default Reconcile;
