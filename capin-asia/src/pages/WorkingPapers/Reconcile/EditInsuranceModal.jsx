import { useEffect, useState } from "react";
import Select from "react-select";

import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import PropTypes from "prop-types";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";

import { getUntaggedInsurancePolicies } from "../../../api/insurance";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: 1,
  p: 4,
};

const selectStyles = {
  input: (provided) => ({
    ...provided,
    width: 100,
    height: 46,
    display: "flex",
    alignItems: "center",
  }),
  singleValue: (provided) => ({
    ...provided,
    marginTop: 2,
  }),
};

export default function EditInsuranceModal({
  showModal,
  handleClose,
  selectedRecord,
  handleSave,
  clientId,
}) {
  const [policies, setPolicies] = useState({});
  const [policyOptions, setPolicyOptions] = useState([]);
  const [policyRows, setPolicyRows] = useState([]);
  const [policyRowsData, setPolicyRowsData] = useState({});
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    async function fetchData() {
      const data = await getUntaggedInsurancePolicies(
        clientId,
        selectedRecord.glcode
      );
      if (data.success && data?.policyDetails) {
        const tempPolicies = {};
        const tempPolicyOptions = [];
        data?.policyDetails.map((policy) => {
          tempPolicyOptions.push({
            value: policy.policyNumber,
            label: policy.policyNumber,
            amount: policy.remainingPremium,
          });
          tempPolicies[`${policy.policyNumber}`] = policy.remainingPremium;
        });
        setPolicies(tempPolicies);
        setPolicyOptions(tempPolicyOptions);
      }
    }
    if (
      selectedRecord.glcode &&
      selectedRecord?.transactionType === "INSURANCE"
    ) {
      setErrorMsg("");
      fetchData();
    }
  }, [clientId, selectedRecord.glcode, selectedRecord.transactionType]);

  const handleSaveClick = () => {
    let selectedTotalPoliciesAmount = 0;
    const validPolices = [];
    Object.keys(policyRowsData).forEach((row) => {
      const policy = policyRowsData[row];
      if (policy.remainingPremium > policies[policy.policyNumber]) {
        setErrorMsg(
          `Please enter valid amount for policy - ${policy.policyNumber}`
        );
        return;
      }
      selectedTotalPoliciesAmount += policy.remainingPremium;
      if (selectedTotalPoliciesAmount > parseFloat(selectedRecord.amount)) {
        setErrorMsg("Please enter valid amount");
        return;
      }
      validPolices.push({
        policyId: policy.policyNumber,
        remainingPremium: policy.remainingPremium,
      });
    });
    handleSave({
      policies: validPolices,
    });
  };

  return (
    <div>
      <Modal
        open={showModal}
        onClose={() => handleClose()}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <h4>Edit Insurance</h4>
          <Box component="form" noValidate sx={{ mt: 2 }}>
            <Grid container spacing={2} rowSpacing={3}>
              <Grid item xs={6}>
                GL Code - {selectedRecord.glcode}
              </Grid>
              <Grid item xs={6}>
                Amount - {selectedRecord.amount}
              </Grid>

              <Grid item xs={12}>
                <Button
                  variant="contained"
                  onClick={() =>
                    setPolicyRows([...policyRows, policyRows.length + 1])
                  }
                >
                  Add Policy Entry
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  {policyRows.map((_, index) => {
                    return (
                      <Grid
                        key={index}
                        container
                        rowSpacing={1}
                        columnSpacing={{ xs: 1 }}
                      >
                        <Grid
                          item
                          xs={8}
                          sx={{
                            "&.MuiGrid-item": {
                              paddingLeft: 0,
                            },
                          }}
                        >
                          <Select
                            name="policies"
                            options={policyOptions}
                            styles={selectStyles}
                            className="basic-multi-select"
                            classNamePrefix="select"
                            placeholder={"Policy number - premium amount"}
                            onChange={(e) =>
                              setPolicyRowsData({
                                ...policyRowsData,
                                [index]: {
                                  ...policyRowsData[index],
                                  policyNumber: e.value,
                                },
                              })
                            }
                          />
                        </Grid>
                        <Grid item xs={4}>
                          <TextField
                            required
                            fullWidth
                            id="remainingPremium"
                            label="Premium"
                            name="remainingPremium"
                            type="number"
                            onChange={(e) =>
                              setPolicyRowsData({
                                ...policyRowsData,
                                [index]: {
                                  ...policyRowsData[index],
                                  remainingPremium: parseFloat(e.target.value),
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
              {errorMsg !== "" && (
                <Grid item xs={12}>
                  <Typography style={{ color: "red" }}>{errorMsg}</Typography>
                </Grid>
              )}

              <Grid container sx={{ marginTop: 2 }}>
                <Grid
                  item
                  xs={6}
                  sx={{ justifyContent: "center", display: "flex" }}
                >
                  <Button onClick={handleClose}>Cancel</Button>
                </Grid>
                <Grid
                  item
                  xs={6}
                  sx={{ justifyContent: "center", display: "flex" }}
                >
                  <Button variant="contained" onClick={handleSaveClick}>
                    Save
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}

EditInsuranceModal.propTypes = {
  showModal: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  selectedRecord: PropTypes.object.isRequired,
  handleSave: PropTypes.func.isRequired,
  clientId: PropTypes.string.isRequired,
};
