import { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import dayjs from "dayjs";

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

import Loader from "../../../components/Loader";
import { MONTHS } from "../constants";
import { getPrepaidMonthlyReport } from "../../../api/prepaid";
import { getSelectedClient } from "../../../redux/globalSlice";

const Prepaid = () => {
  const selectedClient = useSelector(getSelectedClient);
  const [selectedMonth, setSelectedMonth] = useState(MONTHS[0]);
  const [reportData, setReportData] = useState([]);
  const [showLoader, setShowLoader] = useState(true);

  const fetchMonthlyReport = useCallback(async () => {
    const monthlyData = await getPrepaidMonthlyReport(
      selectedClient.id,
      selectedMonth
    );
    setReportData(monthlyData);
    setShowLoader(false);
  }, [selectedClient, selectedMonth]);

  useEffect(() => {
    fetchMonthlyReport();
  }, [fetchMonthlyReport]);

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  return (
    <div>
      <Grid container spacing={3}>
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
          {reportData.length > 0 && (
            <>
              <table>
                <thead>
                  <tr>
                    <th>GL code</th>
                    <th>Amount</th>
                    <th>Closing Balance</th>
                    <th>Expense till date</th>
                    <th>Expense for the year</th>
                    <th>No of months/days expensed for</th>
                    <th>No of months/days paid for</th>
                    <th>Prepaid end date</th>
                    <th>Prepaid start date</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.map((balanceObj, index) => {
                    const {
                      glcode,
                      amount,
                      closingBalance,
                      expenseTillDate,
                      expenseForTheYear,
                      noOfMonthsDaysExpensedFor,
                      noOfMonthsDaysPaidFor,
                      prepaidEndDate,
                      prepaidStartDate,
                      description,
                    } = balanceObj;
                    return (
                      <tr key={index}>
                        <td>{glcode}</td>
                        <td>{amount}</td>
                        <td>{closingBalance}</td>
                        <td>{expenseTillDate}</td>
                        <td>{expenseForTheYear}</td>
                        <td>{noOfMonthsDaysExpensedFor}</td>
                        <td>{noOfMonthsDaysPaidFor}</td>
                        <td>{dayjs(prepaidEndDate).format("MM/DD/YYYY")}</td>
                        <td>{dayjs(prepaidStartDate).format("MM/DD/YYYY")}</td>
                        <td>{description}</td>
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

export default Prepaid;
