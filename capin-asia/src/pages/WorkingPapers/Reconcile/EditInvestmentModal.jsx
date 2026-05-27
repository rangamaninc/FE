import { useState } from "react";

import Modal from "@mui/material/Modal";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Select from "react-select";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { getAllInvestments } from "../../../api/reconcile";

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

const selectBoxStyles = {
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
  menu: (base) => ({
    ...base,
    zIndex: 100,
  }),
};

const investmentTypeOptions = [
  { label: "Purchase", value: "PURCHASE" },
  { label: "Sale", value: "SALE" },
  { label: "Income/Loss", value: "INCOME/LOSS" },
];

function EditInvestmentModal({
  showModal,
  handleClose,
  selectedRecord,
  handleSave,
  clientId,
}) {
  const [selectedInvestmentType, setSelectedInvestmentType] = useState("");
  const [purchaseRows, setPurchaseRows] = useState([]);
  const [purchaseRowsData, setPurchaseRowsData] = useState({});
  const [showFormErrMsg, setShowFormErrMsg] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const { transactionDate, transactionType } = selectedRecord;

  const fetchAllInvestments = async () => {
    const res = await getAllInvestments(clientId);
    console.log(res);
    const subTxns = res.investmentDetails;
    const existingPurchaseRows = [];
    const existingPurchaseRowsData = {};
    subTxns.map((subTxn, index) => {
      existingPurchaseRowsData[index] = {
        investmentName: subTxn.investmentName,
        costValue: parseFloat(subTxn.costValue),
        units: subTxn.totalUnits,
        investmentId: subTxn.investmentId,
      };
      existingPurchaseRows.push(index + 1);
    });
    setPurchaseRows(existingPurchaseRows);
    setPurchaseRowsData(existingPurchaseRowsData);
  };

  const handleSaveClick = () => {
    const investmentDetails = [];
    let totalAmount = 0;
    purchaseRows.map((row) => {
      investmentDetails.push(purchaseRowsData[row - 1]);
      if (selectedInvestmentType === "PURCHASE") {
        totalAmount += purchaseRowsData[row - 1].amount;
      }

      if (
        selectedInvestmentType === "SALE" &&
        purchaseRowsData[row - 1].soldUnits > purchaseRowsData[row - 1].units
      ) {
        setErrorMsg("Please enter valid units");
        setShowFormErrMsg(true);
        return;
      }
    });

    if (
      selectedInvestmentType === "PURCHASE" &&
      totalAmount !== parseFloat(selectedRecord.amount)
    ) {
      setErrorMsg("Please enter valid amount");
      setShowFormErrMsg(true);
      return;
    }
    const data = {
      investmentType: selectedInvestmentType,
      investments: investmentDetails,
    };
    handleSave(data);
  };

  const renderFormFields = () => {
    if (selectedInvestmentType === "PURCHASE") {
      return (
        <>
          <Grid item xs={12} sx={{ marginBottom: 2 }}>
            <Button
              variant="contained"
              onClick={() =>
                setPurchaseRows([...purchaseRows, purchaseRows.length + 1])
              }
            >
              Add purchase row
            </Button>
          </Grid>
          {purchaseRows.map((_, index) => {
            return (
              <>
                <Grid item xs={3}>
                  <TextField
                    required
                    fullWidth
                    id="investmentName"
                    label="Name"
                    name="name"
                    onChange={(e) => {
                      setPurchaseRowsData({
                        ...purchaseRowsData,
                        [index]: {
                          ...purchaseRowsData[index],
                          name: e.target.value,
                        },
                      });
                    }}
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    required
                    fullWidth
                    id="investmentId"
                    label="Investment Id"
                    name="investmentId"
                    onChange={(e) =>
                      setPurchaseRowsData({
                        ...purchaseRowsData,
                        [index]: {
                          ...purchaseRowsData[index],
                          investmentId: e.target.value,
                        },
                      })
                    }
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    required
                    fullWidth
                    id="amount"
                    label="Amount"
                    name="amount"
                    type="number"
                    onChange={(e) =>
                      setPurchaseRowsData({
                        ...purchaseRowsData,
                        [index]: {
                          ...purchaseRowsData[index],
                          amount: parseFloat(e.target.value),
                        },
                      })
                    }
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    required
                    fullWidth
                    id="units"
                    label="Units"
                    name="units"
                    onChange={(e) =>
                      setPurchaseRowsData({
                        ...purchaseRowsData,
                        [index]: {
                          ...purchaseRowsData[index],
                          units: parseInt(e.target.value),
                        },
                      })
                    }
                  />
                </Grid>
              </>
            );
          })}
        </>
      );
    } else if (selectedInvestmentType === "SALE") {
      return (
        <>
          {purchaseRows.map((_, index) => {
            return (
              <>
                <Grid item xs={2}>
                  <TextField
                    required
                    fullWidth
                    id="investmentName"
                    label="Name"
                    name="investmentName"
                    disabled
                    value={purchaseRowsData[index]?.investmentName}
                  />
                </Grid>
                <Grid item xs={2}>
                  <TextField
                    required
                    fullWidth
                    id="investmentId"
                    label="Investment Id"
                    name="investmentId"
                    disabled
                    value={purchaseRowsData[index]?.investmentId}
                  />
                </Grid>
                <Grid item xs={2}>
                  <TextField
                    required
                    fullWidth
                    id="costValue"
                    label="Cost value"
                    name="costValue"
                    type="number"
                    disabled
                    value={purchaseRowsData[index]?.costValue}
                  />
                </Grid>
                <Grid item xs={2}>
                  <TextField
                    required
                    fullWidth
                    id="units"
                    label="Units"
                    name="units"
                    disabled
                    value={purchaseRowsData[index]?.units}
                  />
                </Grid>
                <Grid item xs={2}>
                  <TextField
                    required
                    fullWidth
                    id="units"
                    label="Sold units"
                    name="soldUnits"
                    onChange={(e) =>
                      setPurchaseRowsData({
                        ...purchaseRowsData,
                        [index]: {
                          ...purchaseRowsData[index],
                          soldUnits: parseInt(e.target.value),
                        },
                      })
                    }
                  />
                </Grid>
                <Grid item xs={2}>
                  <TextField
                    required
                    fullWidth
                    id="amount"
                    label="Sold amount"
                    name="soldAmount"
                    onChange={(e) =>
                      setPurchaseRowsData({
                        ...purchaseRowsData,
                        [index]: {
                          ...purchaseRowsData[index],
                          soldAmount: parseInt(e.target.value),
                        },
                      })
                    }
                  />
                </Grid>
              </>
            );
          })}
        </>
      );
    } else if (selectedInvestmentType === "INCOME/LOSS") {
      return (
        <>
          {purchaseRows.map((_, index) => {
            return (
              <>
                <Grid item xs={2}>
                  <TextField
                    required
                    fullWidth
                    id="investmentName"
                    label="Name"
                    name="investmentName"
                    disabled
                    value={purchaseRowsData[index]?.investmentName}
                  />
                </Grid>
                <Grid item xs={2}>
                  <TextField
                    required
                    fullWidth
                    id="investmentId"
                    label="Investment Id"
                    name="investmentId"
                    disabled
                    value={purchaseRowsData[index]?.investmentId}
                  />
                </Grid>
                <Grid item xs={2}>
                  <TextField
                    required
                    fullWidth
                    id="costValue"
                    label="Cost value"
                    name="costValue"
                    type="number"
                    disabled
                    value={purchaseRowsData[index]?.costValue}
                  />
                </Grid>
                <Grid item xs={2}>
                  <TextField
                    required
                    fullWidth
                    id="units"
                    label="Units"
                    name="units"
                    disabled
                    value={purchaseRowsData[index]?.units}
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    required
                    fullWidth
                    id="incomeOrLossGenerated"
                    label="Income or Loss generated"
                    name="incomeOrLossGenerated"
                    onChange={(e) =>
                      setPurchaseRowsData({
                        ...purchaseRowsData,
                        [index]: {
                          ...purchaseRowsData[index],
                          incomeOrLossGenerated: parseInt(e.target.value),
                        },
                      })
                    }
                  />
                </Grid>
              </>
            );
          })}
        </>
      );
    }
  };

  return (
    <div>
      <Modal open={showModal} onClose={() => handleClose()}>
        <Box sx={style}>
          <h4>Edit Investment details</h4>
          <Box component="form" noValidate sx={{ mt: 2 }}>
            <Grid container rowSpacing={2}>
              <Grid item xs={6}>
                Txn date - {transactionDate}
              </Grid>
              <Grid item xs={6}>
                Transaction type - {transactionType}
              </Grid>
              <Grid item xs={6}>
                GL code - {selectedRecord.glcode}
              </Grid>
              <Grid item xs={6}>
                Amount - {selectedRecord.amount}
              </Grid>
              <Grid item xs={6}>
                <Select
                  className="basic-single"
                  classNamePrefix="select"
                  isClearable={true}
                  isSearchable={true}
                  options={investmentTypeOptions}
                  onChange={(e) => {
                    if (e.value !== "PURCHASE") {
                      fetchAllInvestments();
                    }
                    setSelectedInvestmentType(e.value);
                  }}
                  placeholder="Select investment type"
                  styles={selectBoxStyles}
                />
              </Grid>
            </Grid>
            <Grid
              sx={{ marginTop: 2, marginBottom: 2 }}
              container
              rowSpacing={1}
              columnSpacing={{ xs: 1 }}
            >
              {renderFormFields()}
            </Grid>
            {showFormErrMsg && (
              <Grid item xs={12}>
                <Typography style={{ color: "red" }}>{errorMsg}</Typography>
              </Grid>
            )}

            <Grid container>
              <Grid item xs={4}></Grid>
              <Grid item xs={5}>
                <Button variant="contained" onClick={handleSaveClick}>
                  Save Transaction
                </Button>
              </Grid>
              <Grid item xs={3}>
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

EditInvestmentModal.propTypes = {
  showModal: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  selectedRecord: PropTypes.object.isRequired,
  handleSave: PropTypes.func.isRequired,
  clientId: PropTypes.string.isRequired,
};

export default EditInvestmentModal;
