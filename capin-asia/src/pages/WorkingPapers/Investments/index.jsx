import { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";

import { getSelectedClient } from "../../../redux/globalSlice";
import {
  getAllInvestments,
  getInvestmentDetails,
  updateInvestmentDetails,
} from "../../../api/investment";
import InvestmentUpdateModal from "./InvestmentUpdateModal";
import WorkingPapersPageLayout from "../WorkingPapersPageLayout";
import MonthSelect from "../MonthSelect";
import { MONTHS } from "../constants";
import { Button, DataTable, useToast } from "../../../components/ui";
import { amountColumn } from "../workingPapersUtils";

const Investments = () => {
  const selectedClient = useSelector(getSelectedClient);
  const { toast } = useToast();
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(MONTHS[0]);
  const [showInvestmentUpdateModal, setInvestmentUpdateModal] = useState(false);
  const [investmentDetails, setInvestmentDetails] = useState({});

  const fetchInvestmentsData = useCallback(async () => {
    if (!selectedClient?.id) {
      setInvestments([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const investmentsData = await getAllInvestments(
        selectedClient.id,
        selectedMonth
      );
      setInvestments(investmentsData.investments ?? []);
    } catch {
      setInvestments([]);
    } finally {
      setLoading(false);
    }
  }, [selectedClient, selectedMonth]);

  useEffect(() => {
    fetchInvestmentsData();
  }, [fetchInvestmentsData]);

  const columns = useMemo(
    () => [
      { accessorKey: "glcode", header: "GL code" },
      { accessorKey: "investmentId", header: "Investment Id" },
      { accessorKey: "investmentName", header: "Investment Name" },
      amountColumn("totalUnits", "Total Units"),
      amountColumn("asOnValue", "As on value"),
      amountColumn("costValue", "Cost value"),
    ],
    []
  );

  const fetchInvestmentDetails = useCallback(async () => {
    const data = await getInvestmentDetails(selectedClient.id);
    setInvestmentDetails(data.investmentDetails);
  }, [selectedClient]);

  const handleUpdateInvestment = async (data) => {
    const res = await updateInvestmentDetails(selectedClient.id, {
      investmentData: data,
    });
    setInvestmentUpdateModal(false);

    if (res.success) {
      toast({ title: "Investment updated successfully" });
      fetchInvestmentsData();
    } else {
      toast({
        title: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <InvestmentUpdateModal
        showModal={showInvestmentUpdateModal}
        handleClose={() => setInvestmentUpdateModal(false)}
        investmentDetails={investmentDetails}
        handleUpdateInvestment={handleUpdateInvestment}
      />

      <WorkingPapersPageLayout
        title="Investments"
        subtitle={`Investment balances for ${selectedMonth}.`}
        loading={loading}
        loadingLabel="Loading investments..."
        action={
          <Button
            type="button"
            className="w-fit shrink-0 self-end sm:self-auto"
            onClick={() => {
              setInvestmentUpdateModal(true);
              fetchInvestmentDetails();
            }}
          >
            Update investment
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
          data={investments}
          pageSize={10}
          onRefresh={fetchInvestmentsData}
          isRefreshing={loading}
          excelFileName="investments"
          showRowActions={false}
          emptyTitle="No investments found"
          emptyDescription="Update investment details or choose a different month."
        />
      </WorkingPapersPageLayout>
    </>
  );
};

export default Investments;
