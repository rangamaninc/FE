import { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import { Plus } from "lucide-react";

import AddNewTransactionModal from "./AddNewTransactionModal";
import CashBookTable from "./CashBookTable";
import WorkingPapersPageLayout from "../WorkingPapersPageLayout";
import { CASHBOOKS_LIST } from "../constants";
import { getCashbookMonthlyBalances } from "../../../api/cashbook";
import { getSelectedClient } from "../../../redux/globalSlice";
import PrepaidInfoModal from "./PrepaidInfoModal";
import {
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui";

export default function CashBook({ handleTabChange }) {
  const selectedClient = useSelector(getSelectedClient);
  const [selectedCashBook, setSelectedCashBook] = useState(
    CASHBOOKS_LIST.length > 0 ? CASHBOOKS_LIST[0].code : ""
  );
  const [loading, setLoading] = useState(true);
  const [monthlyBalances, setMonthlyBalances] = useState([]);
  const [showNewTransactionModal, setShowNewTransactionModal] = useState(false);
  const [showPrepaidInfoModal, setShowPrepaidInfoModal] = useState(false);

  const selectedCashBookLabel = useMemo(
    () =>
      CASHBOOKS_LIST.find((cashbook) => cashbook.code === selectedCashBook)
        ?.desc ?? "Cash book",
    [selectedCashBook]
  );

  const displayYear = monthlyBalances[0]?.year ?? new Date().getFullYear();

  const fetchCashbookMonthlyBalances = useCallback(async () => {
    if (!selectedClient?.id || !selectedCashBook) {
      setMonthlyBalances([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const res = await getCashbookMonthlyBalances(
        selectedClient.id,
        selectedCashBook
      );
      setMonthlyBalances(res?.balances ?? []);
    } catch {
      setMonthlyBalances([]);
    } finally {
      setLoading(false);
    }
  }, [selectedClient, selectedCashBook]);

  useEffect(() => {
    fetchCashbookMonthlyBalances();
  }, [fetchCashbookMonthlyBalances]);

  const handleModalClose = (isPrepaidTransaction = false) => {
    setShowNewTransactionModal(false);
    if (isPrepaidTransaction) {
      setShowPrepaidInfoModal(true);
    } else {
      fetchCashbookMonthlyBalances();
    }
  };

  return (
    <>
      <AddNewTransactionModal
        showModal={showNewTransactionModal}
        handleClose={handleModalClose}
        selectedClientId={selectedClient.id}
        selectedCashBookId={selectedCashBook}
      />
      <PrepaidInfoModal
        showModal={showPrepaidInfoModal}
        handleClose={() => {
          setShowPrepaidInfoModal(false);
          fetchCashbookMonthlyBalances();
        }}
        handleTabChange={handleTabChange}
      />

      <WorkingPapersPageLayout
        title={`For Year - ${displayYear}`}
        subtitle={`Monthly balances for ${selectedCashBookLabel}.`}
        loading={loading}
        loadingLabel="Loading cash book..."
        action={
          <Button
            type="button"
            className="w-fit shrink-0 self-end sm:self-auto"
            onClick={() => setShowNewTransactionModal(true)}
          >
            <Plus className="h-4 w-4" />
            Add Entry
          </Button>
        }
        filters={
          CASHBOOKS_LIST.length > 0 ? (
            <Select
              value={String(selectedCashBook)}
              onValueChange={(value) => setSelectedCashBook(Number(value))}
            >
              <SelectTrigger className="w-[220px]">
                <SelectValue placeholder="Select cash book" />
              </SelectTrigger>
              <SelectContent>
                {CASHBOOKS_LIST.map((cashbook) => (
                  <SelectItem key={cashbook.code} value={String(cashbook.code)}>
                    {cashbook.desc}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : null
        }
      >
        <CashBookTable
          className="flex-1"
          records={monthlyBalances}
          onRefresh={fetchCashbookMonthlyBalances}
          isRefreshing={loading}
        />
      </WorkingPapersPageLayout>
    </>
  );
}

CashBook.propTypes = {
  handleTabChange: PropTypes.func.isRequired,
};
