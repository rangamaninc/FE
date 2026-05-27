import { useState } from "react";
import Select from "react-select";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";

import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import dayjs from "dayjs";
import { Button, Grid } from "@mui/material";

import { getSelectedClientGLCodes } from "../../../redux/globalSlice";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 450,
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: 1,
  p: 2,
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
  menu: (base) => ({
    ...base,
    zIndex: 100,
  }),
};

export default function AddNewAccuralModal({
  showModal,
  handleClose,
  handleSave,
}) {
  const [accuralData, setAccuralData] = useState({
    glCode: "",
    amount: 0,
    fromDate: "",
    toDate: "",
    monetisation: "daily",
  });
  const clientGLCodes = useSelector(getSelectedClientGLCodes);
  const options = clientGLCodes.map((glCodeObj) => {
    const formattedOption = {
      value: glCodeObj.code,
      label: `${glCodeObj.code} - ${glCodeObj.name}`,
    };
    return formattedOption;
  });
  return (
    <Modal
      open={showModal}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography
          sx={{ marginBottom: 2 }}
          id="modal-modal-title"
          variant="h6"
          component="h2"
        >
          New Script
        </Typography>
        <Box sx={{ marginBottom: 2 }}>
          <Select
            className="basic-single"
            classNamePrefix="select"
            isClearable={true}
            isSearchable={true}
            name="color"
            styles={customStyles}
            options={options}
            onChange={(e) =>
              setAccuralData({ ...accuralData, glCode: e.value })
            }
            placeholder="Select GL code"
          />
        </Box>
        <Box sx={{ marginBottom: 2 }}>
          <TextField
            required
            fullWidth
            id="glAmount"
            label="GL Amount"
            name="glAmount"
            type="number"
            onChange={(e) =>
              setAccuralData({ ...accuralData, amount: e.target.value })
            }
            value={accuralData.amount}
          />
        </Box>
        <Box sx={{ marginBottom: 2 }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={["DatePicker"]}>
              <DatePicker
                label="From Date"
                slotProps={{
                  textField: {
                    fullWidth: true,
                    name: "fromDate",
                    autoFocus: true,
                  },
                }}
                onChange={(e) =>
                  setAccuralData({
                    ...accuralData,
                    fromDate: dayjs(e.$d.toISOString()).format("MM/DD/YYYY"),
                  })
                }
              />
            </DemoContainer>
          </LocalizationProvider>
        </Box>
        <Box sx={{ marginBottom: 2 }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={["DatePicker"]}>
              <DatePicker
                label="To Date"
                slotProps={{
                  textField: {
                    fullWidth: true,
                    name: "toDate",
                  },
                }}
                onChange={(e) =>
                  setAccuralData({
                    ...accuralData,
                    toDate: dayjs(e.$d.toISOString()).format("MM/DD/YYYY"),
                  })
                }
              />
            </DemoContainer>
          </LocalizationProvider>
        </Box>
        <Box sx={{ marginBottom: 2 }}>
          <FormLabel id="demo-controlled-radio-buttons-group">
            Expense Methodology
          </FormLabel>
          <RadioGroup
            row
            aria-labelledby="demo-controlled-radio-buttons-group"
            name="row-radio-buttons-group"
            onChange={(e) =>
              setAccuralData({ ...accuralData, monetisation: e.target.value })
            }
            value={accuralData.monetisation}
          >
            <FormControlLabel value="daily" control={<Radio />} label="Daily" />
            <FormControlLabel
              value="monthly"
              control={<Radio />}
              label="Monthly"
            />
          </RadioGroup>
        </Box>
        <Box sx={{ marginBottom: 2 }}>
          <TextField
            required
            fullWidth
            id="invoiceNumber"
            label="Invoice Number"
            name="invoiceNumber"
            type="text"
            onChange={(e) =>
              setAccuralData({ ...accuralData, invoiceNumber: e.target.value })
            }
            value={accuralData.invoiceNumber}
          />
        </Box>
        <Box>
          <Grid container>
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
              <Button
                variant="contained"
                onClick={() => handleSave(accuralData)}
              >
                Save
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Modal>
  );
}

AddNewAccuralModal.propTypes = {
  showModal: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleSave: PropTypes.func.isRequired,
};
