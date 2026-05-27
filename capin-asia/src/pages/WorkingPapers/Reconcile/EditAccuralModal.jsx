import { useEffect, useState } from "react";
import Select from "react-select";

import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import PropTypes from "prop-types";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import { getUntaggedAccurals } from "../../../api/reconcile";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
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

export default function EditAccuralModal({
  showModal,
  handleClose,
  selectedRecord,
  handleSave,
  clientId,
}) {
  const [invoiceOptions, setInvoiceOptions] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState("");

  useEffect(() => {
    async function fetchData() {
      const data = await getUntaggedAccurals(clientId, selectedRecord.glcode);
      if (data.success && data?.accrualDetails) {
        const tempPolicyOptions = [];
        data?.accrualDetails.map((accuralDetail) => {
          tempPolicyOptions.push({
            value: accuralDetail.invoiceNumber,
            label: accuralDetail.invoiceNumber,
          });
        });
        setInvoiceOptions(tempPolicyOptions);
      }
    }
    if (selectedRecord.glcode) {
      fetchData();
    }
  }, [clientId, selectedRecord.glcode]);

  const handleSaveClick = () => {
    handleSave({
      invoiceNumber: selectedInvoice,
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
          <h4>Edit Accural</h4>
          <Box component="form" noValidate sx={{ mt: 2 }}>
            <Grid container spacing={2} rowSpacing={3}>
              <Grid item xs={6}>
                GL Code - {selectedRecord.glcode}
              </Grid>
              <Grid item xs={6}>
                Amount - {selectedRecord.amount}
              </Grid>

              <Grid item xs={12}>
                <Grid
                  item
                  sx={{
                    "&.MuiGrid-item": {
                      paddingLeft: 0,
                    },
                  }}
                >
                  <Select
                    name="policies"
                    options={invoiceOptions}
                    styles={selectStyles}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    placeholder={"Invoice number"}
                    onChange={(e) => setSelectedInvoice(e.value)}
                  />
                </Grid>
              </Grid>

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

EditAccuralModal.propTypes = {
  showModal: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  selectedRecord: PropTypes.object.isRequired,
  handleSave: PropTypes.func.isRequired,
  clientId: PropTypes.string.isRequired,
};
