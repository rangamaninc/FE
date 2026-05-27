import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Button } from "@mui/material";

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

function Reconcile() {
  const [records, setRecords] = useState([]);
  const [showPrepaidModal, setShowPrepaidModal] = useState(false);
  const [showInsuranceModal, setShowInsuranceModal] = useState(false);
  const [showInvestmentModal, setShowInvestmentModal] = useState(false);
  const [showAccuralModal, setShowAccuralModal] = useState(false);
  const [showLossRunsModal, setShowLossRunsModal] = useState(false);

  const [selectedRecord, setSelectedRecord] = useState({});
  const selectedClient = useSelector(getSelectedClient);

  const fetchRecords = useCallback(async () => {
    const res = await getReconcileRecords(selectedClient.id);
    if (res.success) {
      setRecords(res.pendingSubTransactions);
    }
  }, [selectedClient]);

  useEffect(() => {
    if (selectedClient) {
      fetchRecords();
    }
  }, [selectedClient, fetchRecords]);

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
      bodyParams = {
        ...bodyParams,
        policies,
      };
      setShowInsuranceModal(false);
    } else if (isInvestmentTransaction) {
      bodyParams = {
        ...bodyParams,
        ...reconcileData,
      };
      setShowInvestmentModal(false);
    } else if (isAccuralTransaction) {
      setShowAccuralModal(false);
      bodyParams = {
        ...bodyParams,
        reconcileData,
      };
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
      setTimeout(() => {
        fetchRecords();
      }, 500);
    }
  };

  return (
    <div style={{ margin: 20 }}>
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
      <h4 className="text-center mb-4">Reconcile Pending Transactions</h4>
      <div className="mx-5">
        <table>
          <thead>
            <tr>
              <th>Transaction Date</th>
              <th>Transaction Type</th>
              <th>Sub Transaction Type</th>
              <th>GL Code</th>
              <th>Amount</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record, index) => {
              const {
                transactionid,
                transactionDate,
                transactionType,
                subtransactionType,
                glcode,
                amount,
              } = record;
              return (
                <tr key={transactionid + index}>
                  <td>{transactionDate}</td>
                  <td>{transactionType}</td>
                  <td>{subtransactionType}</td>
                  <td>{glcode}</td>
                  <td>{amount}</td>
                  <td>
                    <Button
                      onClick={() => {
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
                        setSelectedRecord(record);
                      }}
                    >
                      Edit
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Reconcile;
