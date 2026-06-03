import { useEffect, useState } from "react";
import { Button } from "@mui/material";
import Select from "@mui/material/Select";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import Snackbar from "@mui/material/Snackbar";
import UploadFileModal from "./UploadFileModal";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import { getLossRunsData, lossRunsUpload } from "../../../api/lossRuns";
import { MONTHS } from "../constants";
import { getSelectedClient } from "../../../redux/globalSlice";
import Loader from "../../../components/Loader";

const LossRuns = () => {
  const selectedClient = useSelector(getSelectedClient);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showSnackBar, setShowSnackBar] = useState(false);
  const [snackbarText, setSnackbarText] = useState("");
  const [fileValidation, setFileValidation] = useState([]);
  const [selectedFrequency, setSelectedFrequency] = useState("yearly");
  const [selectedFreqValue, setSelectedFrequencyValue] = useState(0);
  const [lossRunsDetails, setLossRunsDetails] = useState([]);
  const [showLoader, setShowLoader] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    async function fetchData() {
      setShowLoader(true);
      const res = await getLossRunsData(
        selectedClient.id,
        selectedFrequency,
        selectedFreqValue
      );
      setShowLoader(false);
      setLossRunsDetails(res.lossRunsDetails);
    }
    fetchData();
  }, [selectedClient.id, selectedFreqValue, selectedFrequency]);

  const handleSaveFile = async (formData) => {
    setErrorMsg("");
    const res = await lossRunsUpload(selectedClient.id, formData);
    if (res.success) {
      setShowUploadModal(false);
      setSnackbarText("File uploaded successfully");
    } else if (res.errors) {
      setFileValidation(res.errors);
    } else if (res.error) {
      setErrorMsg(res.error);
    }
  };

  const renderCorrespondingValueDropdown = () => {
    if (selectedFrequency === "quarterly") {
      return (
        <Select
          value={selectedFreqValue}
          displayEmpty
          inputProps={{ "aria-label": "Without label" }}
          onChange={(e) => setSelectedFrequencyValue(e.target.value)}
        >
          <MenuItem value={0}>Q1</MenuItem>
          <MenuItem value={1}>Q2</MenuItem>
          <MenuItem value={2}>Q3</MenuItem>
          <MenuItem value={3}>Q4</MenuItem>
        </Select>
      );
    } else if (selectedFrequency === "monthly") {
      return (
        <Select
          value={selectedFreqValue}
          displayEmpty
          inputProps={{ "aria-label": "Without label" }}
          onChange={(e) => setSelectedFrequencyValue(e.target.value)}
        >
          {MONTHS.map((month, index) => {
            return (
              <MenuItem key={month} value={index} defaultChecked>
                {month}
              </MenuItem>
            );
          })}
        </Select>
      );
    }
  };

  return (
    <div>
      <Grid container spacing={3}>
        <Grid item xs={2}>
          <Select
            value={selectedFrequency}
            displayEmpty
            inputProps={{ "aria-label": "Without label" }}
            onChange={(e) => setSelectedFrequency(e.target.value)}
          >
            <MenuItem value={"yearly"}>Yearly</MenuItem>
            <MenuItem value={"quarterly"}>Quarterly</MenuItem>
            <MenuItem value={"monthly"}>Monthly</MenuItem>
          </Select>
        </Grid>
        <Grid item xs={2}>
          {selectedFrequency !== "yearly" && renderCorrespondingValueDropdown()}
        </Grid>
        <Grid item xs={4} />
        <Grid item xs={2}>
          <Button variant="contained" onClick={() => setShowUploadModal(true)}>
            Upload new file
          </Button>
        </Grid>
      </Grid>
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
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={showSnackBar}
        autoHideDuration={5000}
        onClose={() => setShowSnackBar(false)}
        message={snackbarText}
        key={"snackbar-top-right"}
      />
      <div style={{ marginTop: 10 }}>
        {showLoader ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "50vh",
            }}
          >
            <Loader />
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Claim Number</th>
                <th>Claimant</th>
                <th>Date 1</th>
                <th>Date 2</th>
                <th className="num">Expense Paid Diff</th>
                <th className="num">Expense Reserve Diff</th>
                <th>Facility Name</th>
                <th className="num">Ind Paid Diff </th>
                <th className="num">Ind Reserve Diff </th>
              </tr>
            </thead>
            <tbody>
              {lossRunsDetails &&
                lossRunsDetails.map((record, index) => {
                  const {
                    claimNumber,
                    claimant,
                    date1,
                    date2,
                    expensePaidDiff,
                    expenseReseverDiff,
                    facilityName,
                    indPaidDiff,
                    indReserveDiff,
                  } = record;
                  return (
                    <tr key={index}>
                      <td>{claimNumber}</td>
                      <td>{claimant}</td>
                      <td>{dayjs(date1).format("MM/DD/YYYY")}</td>
                      <td>{dayjs(date2).format("MM/DD/YYYY")}</td>
                      <td className="num">{expensePaidDiff}</td>
                      <td className="num">{expenseReseverDiff}</td>
                      <td>{facilityName}</td>
                      <td className="num">{indPaidDiff}</td>
                      <td className="num">{indReserveDiff}</td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default LossRuns;
