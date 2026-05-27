import { useState } from "react";
import { useSelector } from "react-redux";

import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
import dayjs from "dayjs";
import Select from "react-select";

import { createNewTransaction } from "../../../api/cashbook";
import { getSelectedClientGLCodes } from "../../../redux/globalSlice";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 850,
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: 1,
  p: 4,
};

const customStyles = {
  input: (provided) => ({
    ...provided,
    width: 100,
    height: 44,
    display: "flex",
    alignItems: "center",
  }),
  singleValue: (provided) => ({
    ...provided,
    marginTop: 2,
  }),
};

const transactionTypeOptions = [
  { value: "payment", label: "Payment" },
  { value: "receipt", label: "Receipt" },
];
export default function AddNewTransactionModal({
  showModal,
  handleClose,
  selectedClientId,
  selectedCashBookId,
}) {
  const [glRows, setGLRows] = useState([]);
  const [glRowsData, setGLRowsData] = useState({});
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [showFormErrMsg, setShowFormErrMsg] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [transactionData, setTransactionData] = useState({
    description: "",
    amount: 0,
    transactionDate: "",
    transactionType: transactionTypeOptions[0].value,
  });

  const clientGLCodes = useSelector(getSelectedClientGLCodes);

  const options = clientGLCodes.map((glCodeObj) => {
    const formattedOption = {
      value: glCodeObj.code,
      label: `${glCodeObj.code} - ${glCodeObj.name}`,
    };
    return formattedOption;
  });

  const handleSaveTransaction = async () => {
    setShowFormErrMsg(false);
    if (!transactionData.transactionDate || !transactionData.amount) {
      setErrorMsg("Please enter transaction data");
      setShowFormErrMsg(true);
      return;
    }

    const subTransactionsArr = [];
    // validate the glRows
    const glRowsTotalAmount = Object.keys(glRowsData).reduce((total, num) => {
      subTransactionsArr.push(glRowsData[num]);
      return total + glRowsData[num].amount;
    }, 0);

    if (transactionData.amount !== glRowsTotalAmount) {
      setErrorMsg("Please enter correct amount");
      setShowFormErrMsg(true);
      return;
    }

    const reqData = {
      ...transactionData,
      subTransactions: subTransactionsArr,
    };
    const res = await createNewTransaction(
      selectedClientId,
      selectedCashBookId,
      reqData
    );

    if (res.success) {
      setShowSnackbar(true);
    }
    setTransactionData({
      description: "",
      amount: 0,
      transactionDate: "",
      transactionType: transactionTypeOptions[0].value,
    });
    handleClose(res.isReconcileAvailable);
  };

  return (
    <div>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={showSnackbar}
        autoHideDuration={3000}
        onClose={() => setShowSnackbar(false)}
        message="Transaction created successfully"
        key={"snackbar-top-right"}
      />
      <Modal
        open={showModal}
        onClose={() => handleClose()}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="span">
            Add New Transaction
          </Typography>
          <Box component="form" noValidate sx={{ mt: 2 }}>
            <Grid container spacing={2} rowSpacing={3}>
              <Grid item xs={4}>
                <Box>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={["DatePicker"]}>
                      <DatePicker
                        label="Transaction Date"
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            name: "transactionDate",
                            autoFocus: true,
                          },
                        }}
                        onChange={(e) =>
                          setTransactionData({
                            ...transactionData,
                            transactionDate: dayjs(e.$d.toISOString()).format(
                              "MM/DD/YYYY"
                            ),
                          })
                        }
                      />
                    </DemoContainer>
                  </LocalizationProvider>
                </Box>
              </Grid>
              <Grid
                item
                xs={4}
                sx={{
                  "&.MuiGrid-item": {
                    paddingTop: 4,
                  },
                }}
              >
                <TextField
                  required
                  fullWidth
                  id="transactionDesc"
                  label="Description"
                  name="description"
                  onChange={(e) =>
                    setTransactionData({
                      ...transactionData,
                      description: e.target.value,
                    })
                  }
                />
              </Grid>
              <Grid
                item
                xs={4}
                sx={{
                  "&.MuiGrid-item": {
                    paddingTop: 4,
                  },
                }}
              >
                <TextField
                  required
                  fullWidth
                  id="amount"
                  label="Total Amount"
                  name="totalAmount"
                  type="number"
                  onChange={(e) =>
                    setTransactionData({
                      ...transactionData,
                      amount: parseFloat(e.target.value),
                    })
                  }
                />
              </Grid>
              <Grid item xs={4}>
                <Select
                  className="basic-single"
                  classNamePrefix="select"
                  defaultValue={transactionTypeOptions[0]}
                  name="transactionType"
                  styles={customStyles}
                  options={transactionTypeOptions}
                  onChange={(e) =>
                    setTransactionData({
                      ...transactionData,
                      transactionType: e.value,
                    })
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  onClick={() => setGLRows([...glRows, glRows.length + 1])}
                >
                  Add GL Row
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  {glRows.map((_, index) => {
                    return (
                      <Grid
                        key={index}
                        container
                        rowSpacing={1}
                        columnSpacing={{ xs: 1 }}
                      >
                        <Grid item xs={6}>
                          <Select
                            className="basic-single"
                            classNamePrefix="select"
                            defaultValue={options[0]}
                            isClearable={true}
                            isSearchable={true}
                            name="glCode"
                            styles={customStyles}
                            options={options}
                            onChange={(e) =>
                              setGLRowsData({
                                ...glRowsData,
                                [index]: {
                                  ...glRowsData[index],
                                  masterCode: e.value,
                                },
                              })
                            }
                          />
                        </Grid>
                        <Grid item xs={2}>
                          <TextField
                            required
                            fullWidth
                            id="glAmount"
                            label="GL Amount"
                            name="glAmount"
                            type="number"
                            onChange={(e) =>
                              setGLRowsData({
                                ...glRowsData,
                                [index]: {
                                  ...glRowsData[index],
                                  amount: parseFloat(e.target.value),
                                },
                              })
                            }
                          />
                        </Grid>
                        <Grid item xs={4}>
                          <TextField
                            required
                            fullWidth
                            id="glComment"
                            label="GL Comment"
                            name="glComment"
                            onChange={(e) =>
                              setGLRowsData({
                                ...glRowsData,
                                [index]: {
                                  ...glRowsData[index],
                                  description: e.target.value,
                                },
                              })
                            }
                          />
                        </Grid>
                      </Grid>
                    );
                  })}
                </Stack>
              </Grid>
              {showFormErrMsg && (
                <Grid item xs={12}>
                  <Typography style={{ color: "red" }}>{errorMsg}</Typography>
                </Grid>
              )}
              <Grid item xs={7}></Grid>
              <Grid item xs={3}>
                <Button variant="contained" onClick={handleSaveTransaction}>
                  Save Transaction
                </Button>
              </Grid>
              <Grid item xs={2}>
                <Button variant="outline" onClick={() => handleClose()}>
                  Cancel
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}

AddNewTransactionModal.propTypes = {
  showModal: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  selectedClientId: PropTypes.string.isRequired,
  selectedCashBookId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
};
