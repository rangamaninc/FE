import { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Upload } from "lucide-react";

import UploadFileModal from "./UploadFileModal";
import { getLossRunsData, lossRunsUpload } from "../../../api/lossRuns";
import { MONTHS } from "../constants";
import { getSelectedClient } from "../../../redux/globalSlice";
import WorkingPapersPageLayout from "../WorkingPapersPageLayout";
import {
  Button,
  DataTable,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  useToast,
} from "../../../components/ui";
import {
  amountColumn,
  dateColumn,
} from "../workingPapersUtils";

const LossRuns = () => {
  const selectedClient = useSelector(getSelectedClient);
  const { toast } = useToast();
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [fileValidation, setFileValidation] = useState([]);
  const [selectedFrequency, setSelectedFrequency] = useState("yearly");
  const [selectedFreqValue, setSelectedFrequencyValue] = useState(0);
  const [lossRunsDetails, setLossRunsDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const frequencyLabel = useMemo(() => {
    if (selectedFrequency === "quarterly") {
      return `Q${selectedFreqValue + 1}`;
    }
    if (selectedFrequency === "monthly") {
      return MONTHS[selectedFreqValue] ?? "";
    }
    return "Yearly";
  }, [selectedFrequency, selectedFreqValue]);

  const fetchData = useCallback(async () => {
    if (!selectedClient?.id) {
      setLossRunsDetails([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const res = await getLossRunsData(
        selectedClient.id,
        selectedFrequency,
        selectedFreqValue
      );
      setLossRunsDetails(res.lossRunsDetails ?? []);
    } catch {
      setLossRunsDetails([]);
    } finally {
      setLoading(false);
    }
  }, [selectedClient, selectedFreqValue, selectedFrequency]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const columns = useMemo(
    () => [
      { accessorKey: "claimNumber", header: "Claim Number" },
      { accessorKey: "claimant", header: "Claimant" },
      dateColumn("date1", "Date 1"),
      dateColumn("date2", "Date 2"),
      amountColumn("expensePaidDiff", "Expense Paid Diff"),
      amountColumn("expenseReseverDiff", "Expense Reserve Diff"),
      { accessorKey: "facilityName", header: "Facility Name" },
      amountColumn("indPaidDiff", "Ind Paid Diff"),
      amountColumn("indReserveDiff", "Ind Reserve Diff"),
    ],
    []
  );

  const handleSaveFile = async (formData) => {
    setErrorMsg("");
    const res = await lossRunsUpload(selectedClient.id, formData);
    if (res.success) {
      setShowUploadModal(false);
      setFileValidation([]);
      toast({ title: "File uploaded successfully" });
      fetchData();
    } else if (res.errors) {
      setFileValidation(res.errors);
    } else if (res.error) {
      setErrorMsg(res.error);
    }
  };

  const handleFrequencyChange = (value) => {
    setSelectedFrequency(value);
    setSelectedFrequencyValue(0);
  };

  return (
    <>
      <UploadFileModal
        showModal={showUploadModal}
        handleClose={() => {
          setShowUploadModal(false);
          setFileValidation([]);
        }}
        handleSave={handleSaveFile}
        fileValidation={fileValidation}
        errorMsg={errorMsg}
      />

      <WorkingPapersPageLayout
        title="Loss Runs"
        subtitle={`Loss run data — ${frequencyLabel}.`}
        loading={loading}
        loadingLabel="Loading loss runs..."
        action={
          <Button
            type="button"
            className="w-fit shrink-0 self-end sm:self-auto"
            onClick={() => setShowUploadModal(true)}
          >
            <Upload className="h-4 w-4" />
            Upload File
          </Button>
        }
        filters={
          <>
            <Select value={selectedFrequency} onValueChange={handleFrequencyChange}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yearly">Yearly</SelectItem>
                <SelectItem value="quarterly">Quarterly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>

            {selectedFrequency === "quarterly" ? (
              <Select
                value={String(selectedFreqValue)}
                onValueChange={(value) =>
                  setSelectedFrequencyValue(Number(value))
                }
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Quarter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Q1</SelectItem>
                  <SelectItem value="1">Q2</SelectItem>
                  <SelectItem value="2">Q3</SelectItem>
                  <SelectItem value="3">Q4</SelectItem>
                </SelectContent>
              </Select>
            ) : null}

            {selectedFrequency === "monthly" ? (
              <Select
                value={String(selectedFreqValue)}
                onValueChange={(value) =>
                  setSelectedFrequencyValue(Number(value))
                }
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Month" />
                </SelectTrigger>
                <SelectContent>
                  {MONTHS.map((month, index) => (
                    <SelectItem key={month} value={String(index)}>
                      {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : null}
          </>
        }
      >
        <DataTable
          className="flex-1"
          columns={columns}
          data={lossRunsDetails}
          pageSize={10}
          onRefresh={fetchData}
          isRefreshing={loading}
          excelFileName="loss-runs"
          showRowActions={false}
          emptyTitle="No loss run records"
          emptyDescription="Upload a file or adjust the frequency filter."
        />
      </WorkingPapersPageLayout>
    </>
  );
};

export default LossRuns;
