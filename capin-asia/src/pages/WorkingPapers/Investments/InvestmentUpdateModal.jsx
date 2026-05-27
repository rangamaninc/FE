import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import Grid from "@mui/material/Grid";
import Select from "react-select";
import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 650,
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: 1,
  p: 4,
};

const InvestmentUpdateModal = ({
  showModal,
  handleClose,
  investmentDetails,
  handleUpdateInvestment,
}) => {
  const [selectedGlCode, setSelectedGlCode] = useState("");
  const [glcodeOptions, setglcodeOptions] = useState([]);
  const [investmentIds, setInvestmentIds] = useState([]);
  const [selectedInvestmentId, setSelectedInvestmentId] = useState("");
  const [marketValueData, setMarketValueData] = useState({
    marketValue: 0,
    accruedInterest: 0,
    entryDate: "",
  });

  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const tempGLCodes = Object.keys(investmentDetails);
    if (tempGLCodes) {
      const glCodesTemp = [];
      tempGLCodes.map((glcode) => {
        glCodesTemp.push({ value: glcode, label: glcode });
      });
      setglcodeOptions(glCodesTemp);
    }
  }, [investmentDetails]);

  useEffect(() => {
    if (investmentDetails[selectedGlCode]) {
      const correspondingInvestments = investmentDetails[selectedGlCode];
      const investmentIdsTmp = [];
      Object.keys(correspondingInvestments).map((investmentId) => {
        investmentIdsTmp.push({
          value: investmentId,
          label: investmentId,
        });
      });
      if (investmentIdsTmp.length) {
        setInvestmentIds(investmentIdsTmp);
      }
    }
  }, [selectedGlCode, investmentDetails]);

  const handleSaveClick = () => {
    if (marketValueData.marketValue === 0) {
      setErrorMsg("Please enter market value");
      return;
    }

    if (marketValueData.accruedInterest === 0) {
      setErrorMsg("Please enter accrued interest");
      return;
    }
    if (marketValueData.entryDate === "") {
      setErrorMsg("Please enter valid entry date");
      return;
    }
    setErrorMsg("");
    const selectedInvestmentData =
      investmentDetails[selectedGlCode][selectedInvestmentId];
    handleUpdateInvestment({
      glcode: selectedGlCode,
      investmentId: selectedInvestmentId,
      marketValue: parseFloat(marketValueData.marketValue),
      accruedInterest: parseFloat(marketValueData.accruedInterest),
      entryDate: marketValueData.entryDate,
      ...selectedInvestmentData,
    });
  };

  const resetFormAndCloseModal = () => {
    setSelectedGlCode("");
    setSelectedInvestmentId("");
    handleClose();
  };

  return (
    <>
      <Modal open={showModal} onClose={resetFormAndCloseModal}>
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="span">
            Update investment
          </Typography>
          <Box component="form" noValidate sx={{ mt: 2 }}>
            <Grid container spacing={2} rowSpacing={3} columnSpacing={1}>
              <Grid item xs={6}>
                <p>Select GL code</p>
                <Select
                  placeholder="Select GL code"
                  options={glcodeOptions}
                  onChange={(option) => {
                    setSelectedGlCode(option.value);
                  }}
                />
              </Grid>
              {selectedGlCode !== "" && (
                <Grid item xs={6}>
                  <p>Select Investment Id</p>
                  <Select
                    placeholder="Select Investment Id"
                    options={investmentIds}
                    onChange={(option) => {
                      setSelectedInvestmentId(option.value);
                    }}
                  />
                </Grid>
              )}
              {selectedGlCode != "" && selectedInvestmentId !== "" && (
                <>
                  <Grid
                    item
                    xs={6}
                    sx={{
                      "&.MuiGrid-item": {
                        paddingTop: 4,
                      },
                    }}
                  >
                    <TextField
                      required
                      fullWidth
                      id="marketValue"
                      label="Market Value"
                      name="marketValue"
                      type="number"
                      InputProps={{ inputProps: { min: 0 } }}
                      onChange={(e) => {
                        setMarketValueData({
                          ...marketValueData,
                          marketValue: e.target.value,
                        });
                      }}
                    />
                  </Grid>
                  <Grid
                    item
                    xs={6}
                    sx={{
                      "&.MuiGrid-item": {
                        paddingTop: 4,
                      },
                    }}
                  >
                    <TextField
                      required
                      fullWidth
                      id="accruedInterest"
                      label="Accrued Interest"
                      name="accruedInterest"
                      type="number"
                      onChange={(e) => {
                        setMarketValueData({
                          ...marketValueData,
                          accruedInterest: e.target.value,
                        });
                      }}
                      InputProps={{ inputProps: { min: 0 } }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Box>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={["DatePicker"]}>
                          <DatePicker
                            label="Entry Date"
                            slotProps={{
                              textField: {
                                fullWidth: true,
                                name: "entryDate",
                                autoFocus: true,
                              },
                            }}
                            onChange={(e) =>
                              setMarketValueData({
                                ...marketValueData,
                                entryDate: dayjs(e.$d.toISOString()).format(
                                  "MM/DD/YYYY"
                                ),
                              })
                            }
                          />
                        </DemoContainer>
                      </LocalizationProvider>
                    </Box>
                  </Grid>
                  <Grid item xs={6}></Grid>
                  {errorMsg !== "" && (
                    <Grid item xs={12}>
                      <Typography style={{ color: "red" }}>
                        {errorMsg}
                      </Typography>
                    </Grid>
                  )}
                  <Grid item xs={6}>
                    <Button variant="contained" onClick={handleSaveClick}>
                      Save Investment
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button variant="outline" onClick={resetFormAndCloseModal}>
                      Cancel
                    </Button>
                  </Grid>
                </>
              )}
            </Grid>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default InvestmentUpdateModal;

InvestmentUpdateModal.propTypes = {
  showModal: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  investmentDetails: PropTypes.object.isRequired,
  handleUpdateInvestment: PropTypes.func.isRequired,
};
