import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { Button } from "@mui/material";

import AddNewTransactionModal from "./AddNewTransactionModal";
import { CASHBOOKS_LIST } from "../constants";
import { getCashbookMonthlyBalances } from "../../../api/cashbook";
import { getSelectedClient } from "../../../redux/globalSlice";
import Loader from "../../../components/Loader";
import PrepaidInfoModal from "./PrepaidInfoModal";

export default function CashBook({ handleTabChange }) {
  const selectedClient = useSelector(getSelectedClient);
  const [selectedCashBook, setSelectedCashBook] = useState(
    CASHBOOKS_LIST.length > 0 ? CASHBOOKS_LIST[0].code : ""
  );

  const [showLoader, setShowLoader] = useState(true);
  const [monthlyBalances, setMonthlyBalances] = useState([]);

  const [showNewTransactionModal, setShowNewTransactionModal] = useState(false);
  const [showPrepaidInfoModal, setShowPrepaidInfoModal] = useState(false);

  const handleCashbookChange = (e) => {
    setSelectedCashBook(e.target.value);
    setShowLoader(true);
  };

  const fetchCashbookMonthlyBalances = React.useCallback(async () => {
    const res = await getCashbookMonthlyBalances(
      selectedClient.id,
      selectedCashBook
    );
    if (res?.balances) {
      setMonthlyBalances(res.balances);
    }
    setShowLoader(false);
  }, [selectedClient, selectedCashBook]);

  useEffect(() => {
    if (selectedClient && selectedCashBook) {
      fetchCashbookMonthlyBalances();
    }
  }, [selectedCashBook, selectedClient, fetchCashbookMonthlyBalances]);

  return (
    <div>
      <AddNewTransactionModal
        showModal={showNewTransactionModal}
        handleClose={(isPrepaidTransaction = false) => {
          setShowNewTransactionModal(false);
          if (isPrepaidTransaction) {
            setShowPrepaidInfoModal(true);
          } else {
            window.location.reload();
          }
        }}
        selectedClientId={selectedClient.id}
        selectedCashBookId={selectedCashBook}
      />
      <PrepaidInfoModal
        showModal={showPrepaidInfoModal}
        handleClose={() => {
          setShowPrepaidInfoModal(false);
          window.location.reload();
        }}
        handleTabChange={handleTabChange}
      />
      <Grid container spacing={3}>
        <Grid item xs={3}>
          {CASHBOOKS_LIST.length > 0 && (
            <Select
              value={selectedCashBook}
              displayEmpty
              inputProps={{ "aria-label": "Without label" }}
              onChange={handleCashbookChange}
            >
              {CASHBOOKS_LIST.map((cashbook) => {
                return (
                  <MenuItem
                    key={cashbook.code}
                    value={cashbook.code}
                    defaultChecked
                  >
                    {cashbook.desc}
                  </MenuItem>
                );
              })}
            </Select>
          )}
        </Grid>
        <Grid item xs={6} />
        <Grid item xs={2}>
          <Button
            variant="contained"
            onClick={() => setShowNewTransactionModal(true)}
          >
            Add Entry
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
        <Box sx={{ margin: 5, width: "75%" }}>
          {monthlyBalances.length > 0 && (
            <>
              <div style={{ textAlign: "center", marginBottom: 20 }}>
                <b>For Year - {monthlyBalances[0].year}</b>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>Month</th>
                    <th className="num">Opening Balance</th>
                    <th className="num">Receipts Received</th>
                    <th className="num">Payments Payable</th>
                    <th className="num">Closing Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {monthlyBalances.map((balanceObj) => {
                    const {
                      month,
                      openingBalance,
                      receiptsReceived,
                      paymentsReceived,
                      closingBalance,
                    } = balanceObj;
                    return (
                      <tr key={month}>
                        <td>{month}</td>
                        <td className="num">{openingBalance}</td>
                        <td className="num">{receiptsReceived}</td>
                        <td className="num">{paymentsReceived}</td>
                        <td className="num">{closingBalance}</td>
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
}

CashBook.propTypes = {
  handleTabChange: PropTypes.func.isRequired,
};
