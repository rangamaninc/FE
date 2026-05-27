import React from "react";

import { Button, Typography } from "@mui/material";
import Select from "react-select";
import { useSelector } from "react-redux";

import TextField from "@mui/material/TextField";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import Snackbar from "@mui/material/Snackbar";

import { addOpeningBalance } from "../../api/cashbook";
import {
  getSelectedClient,
  getSelectedClientGLCodes,
} from "../../redux/globalSlice";

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

function OpeningModule() {
  const [showSnackbar, setShowSnackbar] = React.useState(false);
  const [currentGLRow, setCurrentGLRow] = React.useState({
    glCode: "",
    amount: 0,
    openingBalanceDate: "",
    type: "credit",
  });
  const [errorMessage, setErrorMessage] = React.useState("");
  const selectedClient = useSelector(getSelectedClient);
  const clientGLCodes = useSelector(getSelectedClientGLCodes);

  const options = clientGLCodes.map((glCodeObj) => {
    const formattedOption = {
      value: glCodeObj.code,
      label: `${glCodeObj.code} - ${glCodeObj.name}`,
    };
    return formattedOption;
  });

  const handleSave = async () => {
    if (!currentGLRow.glCode || !currentGLRow.openingBalanceDate) {
      setErrorMessage("Please select a GL code and date");
      return;
    }

    setErrorMessage("");
    try {
      const res = await addOpeningBalance(selectedClient.id, {
        openingBalanceDate: currentGLRow.openingBalanceDate,
        amount: Number(currentGLRow.amount),
        glCode: currentGLRow.glCode,
        isDebit: currentGLRow.type === "debit",
      });

      if (res.success) {
        setShowSnackbar(true);
        setTimeout(() => {
          window.location.reload();
        }, 200);
      } else {
        setErrorMessage(res.error || "Please provide valid details");
      }
    } catch {
      setErrorMessage("Failed to save opening balance. Check GL code and date.");
    }
  };

  return (
    <div className="m-4">
      <Typography variant="h6" component="h6">
        Add Opening Balance
      </Typography>
      <div style={{ marginTop: 20, width: "55%" }}>
        <div className="mb-4">
          <Select
            className="basic-single"
            classNamePrefix="select"
            isClearable={true}
            isSearchable={true}
            name="color"
            styles={customStyles}
            options={options}
            onChange={(e) =>
              setCurrentGLRow({ ...currentGLRow, glCode: e?.value || "" })
            }
            placeholder="Select GL code"
          />
        </div>
        <div className="mb-3">
          <TextField
            required
            fullWidth
            id="glAmount"
            label="GL Amount"
            name="glAmount"
            type="number"
            onChange={(e) =>
              setCurrentGLRow({ ...currentGLRow, amount: e.target.value })
            }
            value={currentGLRow.amount}
          />
        </div>
        <div className="mb-4">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={["DatePicker"]}>
              <DatePicker
                label="Transaction Date"
                slotProps={{
                  textField: {
                    fullWidth: true,
                    name: "openingBalanceDate",
                  },
                }}
                onChange={(e) =>
                  setCurrentGLRow({
                    ...currentGLRow,
                    openingBalanceDate: dayjs(e.$d.toISOString()).format(
                      "MM/DD/YYYY"
                    ),
                  })
                }
              />
            </DemoContainer>
          </LocalizationProvider>
        </div>
        <div className="mb-4">
          <FormLabel id="demo-controlled-radio-buttons-group">Type</FormLabel>
          <RadioGroup
            row
            aria-labelledby="demo-controlled-radio-buttons-group"
            name="row-radio-buttons-group"
            onChange={(e) =>
              setCurrentGLRow({ ...currentGLRow, type: e.target.value })
            }
            value={currentGLRow.type}
          >
            <FormControlLabel
              value="credit"
              control={<Radio />}
              label="Credit"
            />
            <FormControlLabel value="debit" control={<Radio />} label="Debit" />
          </RadioGroup>
        </div>
        <div>
          <Button variant="contained" onClick={handleSave}>
            Save
          </Button>
        </div>
      </div>
      {errorMessage && (
        <Typography sx={{ color: "#f44336" }}>{errorMessage}</Typography>
      )}
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={showSnackbar}
        autoHideDuration={5000}
        onClose={() => setShowSnackbar(false)}
        message="Opening Balance added"
        key={"snackbar-top-right"}
      />
    </div>
  );
}

export default OpeningModule;
