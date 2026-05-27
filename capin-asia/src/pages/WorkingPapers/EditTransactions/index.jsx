import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import { Button } from "@mui/material";

import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

import { CASHBOOKS_LIST, MONTHS } from "../constants";
import { getSelectedClient } from "../../../redux/globalSlice";

import Loader from "../../../components/Loader";
import { getAllTransactionsOfClient } from "../../../api/cashbook";
import EditTransactionModal from "./EditTransactionModal";

function EditTransactions() {
  const selectedClient = useSelector(getSelectedClient);
  const [selectedCashBook, setSelectedCashBook] = useState(
    CASHBOOKS_LIST.length > 0 ? CASHBOOKS_LIST[0].code : ""
  );
  const [selectedMonth, setSelectedMonth] = useState(1);
  const [showLoader, setShowLoader] = useState(true);
  const [txnsData, setTxnsData] = useState([]);
  const [editTxnModalData, setEditTxnModalData] = useState({
    transactionId: 0,
    showModal: false,
    glCode: "",
    amount: "",
    description: "",
    transactionType: "",
    transactionDate: "",
  });

  const fetchTransactions = useCallback(async () => {
    const txnData = await getAllTransactionsOfClient(
      selectedClient.id,
      selectedCashBook,
      selectedMonth
    );
    setTxnsData(txnData.transactions);
    setShowLoader(false);
  }, [selectedClient, selectedCashBook, selectedMonth]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleCashbookChange = (e) => {
    setSelectedCashBook(e.target.value);
    setShowLoader(true);
  };

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
    setShowLoader(true);
  };

  return (
    <div>
      {" "}
      <EditTransactionModal
        showModal={editTxnModalData.showModal}
        handleClose={() =>
          setEditTxnModalData({
            transactionId: 0,
            showModal: false,
            glCode: "",
            amount: "",
          })
        }
        selectedClientId={selectedClient.id}
        selectedGLCode={editTxnModalData.glCode}
        selectedTransactionId={editTxnModalData.transactionId}
        txnData={editTxnModalData}
      />
      <Grid container spacing={3}>
        <Grid item xs={2}>
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
        <Grid item xs={2}>
          <Select
            value={selectedMonth - 1}
            displayEmpty
            inputProps={{ "aria-label": "Without label" }}
            onChange={handleMonthChange}
          >
            {MONTHS.map((month, index) => {
              return (
                <MenuItem key={month} value={index} defaultChecked>
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
        <Box sx={{ margin: 5, width: "75%" }}>
          {txnsData.length > 0 && (
            <>
              <table>
                <thead>
                  <tr>
                    <th>GL code</th>
                    <th>Transaction Id</th>
                    <th>Amount</th>
                    <th>Transaction date</th>
                    <th>Transaction type</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {txnsData.map((balanceObj) => {
                    const {
                      glcode,
                      transactionId,
                      amount,
                      transactionDate,
                      transactionType,
                      description,
                    } = balanceObj;
                    return (
                      <tr key={transactionId}>
                        <td>{glcode}</td>
                        <td>{transactionId}</td>
                        <td>{amount}</td>
                        <td>{dayjs(transactionDate).format("MM/DD/YYYY")}</td>
                        <td>{transactionType}</td>
                        <td>
                          <Button
                            onClick={() => {
                              setEditTxnModalData({
                                transactionId,
                                showModal: true,
                                glCode: glcode,
                                amount: parseFloat(amount),
                                description,
                                transactionType,
                                transactionDate,
                              });
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
            </>
          )}
        </Box>
      )}
    </div>
  );
}

export default EditTransactions;
