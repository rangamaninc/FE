import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Button } from "@mui/material";
import dayjs from "dayjs";

import Grid from "@mui/material/Grid";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

import AddNewAccuralModal from "./AddNewAccuralModal";
import { addNewAccuralEntry, getAccurals } from "../../../api/accurals";
import { getSelectedClient } from "../../../redux/globalSlice";
import { MONTHS } from "../constants";

function Accurals() {
  const selectedClient = useSelector(getSelectedClient);
  const [showModal, setShowModal] = useState(false);
  const [records, setRecords] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(MONTHS[0]);

  useEffect(() => {
    async function fetchData() {
      const res = await getAccurals(selectedClient.id, selectedMonth);
      if (res.success) {
        setRecords(res.accruedData);
      }
    }
    fetchData();
  }, [selectedClient, selectedMonth]);

  const handleSave = async (data) => {
    await addNewAccuralEntry(selectedClient.id, data);
    setShowModal(false);
  };

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  return (
    <div>
      <AddNewAccuralModal
        showModal={showModal}
        handleSave={handleSave}
        handleClose={() => setShowModal(false)}
      />
      <Grid container spacing={3}>
        <Grid item xs={3} sx={{ display: "flex", alignItems: "center" }}>
          {" "}
          <Button variant="contained" onClick={() => setShowModal(true)}>
            Add new entry
          </Button>
        </Grid>
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
      <div style={{ marginTop: 10 }}>
        <table>
          <tr>
            <th>GL Code</th>
            <th className="num">Accural Amount</th>
            <th>Period From</th>
            <th>Period To</th>
            <th className="num">Number of Days Paid</th>
            <th className="num">Number of Days Expensed</th>
            <th className="num">Current Expense of Year</th>
            <th className="num">Total expense </th>
            <th className="num">Payment During Year</th>
            <th className="num">Accural Closing Balance</th>
            <th>Previous Expense of Year</th>
          </tr>
          {records.map((record, index) => {
            const {
              glCode,
              amount,
              fromDate,
              toDate,
              closingBalanceasBL,
              currentExpenseofYear,
              expenseMethodology,
              expenseForYear,
              numberOfDaysExpensed,
              numberOfDaysPaid,
              paymentDuringYear,
            } = record;
            return (
              <tr key={index}>
                <td>{glCode}</td>
                <td className="num">{amount}</td>
                <td>{dayjs(fromDate).format("MM/DD/YYYY")}</td>
                <td>{dayjs(toDate).format("MM/DD/YYYY")}</td>
                <td className="num">{numberOfDaysPaid}</td>
                <td className="num">{numberOfDaysExpensed}</td>
                <td className="num">{currentExpenseofYear}</td>
                <td className="num">{expenseForYear}</td>
                <td className="num">{paymentDuringYear}</td>
                <td className="num">{closingBalanceasBL}</td>
                <td>{expenseMethodology}</td>
              </tr>
            );
          })}
        </table>
      </div>
    </div>
  );
}

export default Accurals;
