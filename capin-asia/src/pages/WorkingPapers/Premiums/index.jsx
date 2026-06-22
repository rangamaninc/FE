import { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";

import { getSelectedClient } from "../../../redux/globalSlice";
import { getAllInsurancePolicies } from "../../../api/insurance";
import { MONTHS } from "../constants";
import WorkingPapersPageLayout from "../WorkingPapersPageLayout";
import MonthSelect from "../MonthSelect";
import { DataTable } from "../../../components/ui";
import {
  amountColumn,
  dateColumn,
} from "../workingPapersUtils";

const Premiums = () => {
  const selectedClient = useSelector(getSelectedClient);
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(MONTHS[0]);

  const fetchAllPolices = useCallback(async () => {
    if (!selectedClient?.id) {
      setPolicies([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const insurancePolicies = await getAllInsurancePolicies(
        selectedClient.id,
        selectedMonth
      );
      setPolicies(insurancePolicies.policyDetails ?? []);
    } catch {
      setPolicies([]);
    } finally {
      setLoading(false);
    }
  }, [selectedClient, selectedMonth]);

  useEffect(() => {
    fetchAllPolices();
  }, [fetchAllPolices]);

  const columns = useMemo(
    () => [
      { accessorKey: "glcode", header: "GL code" },
      { accessorKey: "policyNumber", header: "Policy number" },
      amountColumn("totalPolicy", "Total Policy"),
      amountColumn("preimumRecevied", "Premium received"),
      amountColumn("balanceReceivable", "Premium receivable"),
      dateColumn("policyStartDate", "Policy start date"),
      dateColumn("policyEndDate", "Policy end date"),
      amountColumn("policyPeriodDays", "Policy period days"),
      amountColumn("policyInceptionDays", "Policy inception days"),
      amountColumn("policyEarnedDays", "Policy earned days"),
      { accessorKey: "earningMethod", header: "Earning Method" },
      amountColumn("currentYearEarning", "Current year earning"),
      amountColumn("unearnedPremium", "Unearned Premium"),
      amountColumn("remainingPolicyDays", "Remaining policy days"),
    ],
    []
  );

  return (
    <WorkingPapersPageLayout
      title="Premiums"
      subtitle={`Insurance policy premiums for ${selectedMonth}.`}
      loading={loading}
      loadingLabel="Loading premiums..."
      filters={
        <MonthSelect value={selectedMonth} onChange={setSelectedMonth} />
      }
    >
      <DataTable
        className="flex-1"
        columns={columns}
        data={policies}
        pageSize={10}
        onRefresh={fetchAllPolices}
        isRefreshing={loading}
        excelFileName="premiums"
        showRowActions={false}
        emptyTitle="No policy records"
        emptyDescription="Choose a different month to view data."
      />
    </WorkingPapersPageLayout>
  );
};

export default Premiums;
