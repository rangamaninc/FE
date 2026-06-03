import { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import Loader from "../../../components/Loader";
import { getSelectedClient } from "../../../redux/globalSlice";
import {
  getAllInvestments,
  getInvestmentDetails,
  updateInvestmentDetails,
} from "../../../api/investment";
import { MONTHS } from "../constants";
import InvestmentUpdateModal from "./InvestmentUpdateModal";

const Investments = () => {
  const selectedClient = useSelector(getSelectedClient);
  const [investments, setInvestments] = useState([]);
  const [showLoader, setShowLoader] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(MONTHS[0]);
  const [showInvestmentUpdateModal, setInvestmentUpdateModal] = useState(false);
  const [investmentDetails, setInvestmentDetails] = useState({});
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");

  const fetchInvestmentsData = useCallback(async () => {
    const investmentsData = await getAllInvestments(
      selectedClient.id,
      selectedMonth
    );
    setInvestments(investmentsData.investments);
    setShowLoader(false);
  }, [selectedClient, selectedMonth]);

  useEffect(() => {
    fetchInvestmentsData();
  }, [fetchInvestmentsData]);

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  const fetchInvestmentDetails = useCallback(async () => {
    const data = await getInvestmentDetails(selectedClient.id);
    setInvestmentDetails(data.investmentDetails);
  }, [selectedClient]);

  const handleUpdateInvestment = async (data) => {
    const res = await updateInvestmentDetails(selectedClient.id, {
      investmentData: data,
    });
    setShowSnackbar(true);
    setInvestmentUpdateModal(false);
    if (res.success) {
      setSnackbarMsg("Investment updated successfully");
    } else {
      setSnackbarMsg("Something went wrong! please try again after sometime");
    }
  };

  return (
    <div>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={showSnackbar}
        autoHideDuration={3000}
        onClose={() => setShowSnackbar(false)}
        message={snackbarMsg}
        key={"snackbar-top-right"}
      />
      <InvestmentUpdateModal
        showModal={showInvestmentUpdateModal}
        handleClose={() => setInvestmentUpdateModal(false)}
        investmentDetails={investmentDetails}
        handleUpdateInvestment={handleUpdateInvestment}
      />
      <Grid container>
        <Grid item xs={3}>
          <Select
            value={selectedMonth}
            displayEmpty
            inputProps={{ "aria-label": "Without label" }}
            onChange={handleMonthChange}
          >
            {MONTHS.map((month) => {
              return (
                <MenuItem key={month} value={month} defaultChecked>
                  {month}
                </MenuItem>
              );
            })}
          </Select>
        </Grid>
        <Grid item xs={6} />
        <Grid item xs={3}>
          <Button
            variant="contained"
            onClick={() => {
              setInvestmentUpdateModal(true);
              fetchInvestmentDetails();
            }}
          >
            Update investment
          </Button>
        </Grid>
      </Grid>
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
        <Box sx={{ marginTop: 3, marginBottom: 3, width: "95%" }}>
          {investments.length > 0 && (
            <>
              <table>
                <thead>
                  <tr>
                    <th>GL code</th>
                    <th className="num">Investment Id</th>
                    <th>Investment Name</th>
                    <th className="num">Total Units</th>
                    <th className="num">As on value</th>
                    <th className="num">Cost value</th>
                  </tr>
                </thead>
                <tbody>
                  {investments.map((balanceObj, index) => {
                    const {
                      glcode,
                      investmentId,
                      investmentName,
                      totalUnits,
                      asOnValue,
                      costValue,
                    } = balanceObj;
                    return (
                      <tr key={index}>
                        <td>{glcode}</td>
                        <td className="num">{investmentId}</td>
                        <td>{investmentName}</td>
                        <td className="num">{totalUnits}</td>
                        <td className="num">{asOnValue}</td>
                        <td className="num">{costValue}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </>
          )}
        </Box>
      )}
    </div>
  );
};

export default Investments;
