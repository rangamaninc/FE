/** Form markup for add opening balance (kept separate from page logic). */

import Select from "react-select";
import TextField from "@mui/material/TextField";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import { Button, Stack } from "@mui/material";
import dayjs from "dayjs";

export const selectCustomStyles = {
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

export function renderOpeningBalanceForm({
  glOptions,
  currentGLRow,
  setCurrentGLRow,
  onSave,
  onCancel,
}) {
  return (
    <div style={{ marginTop: 20, width: "55%" }}>
      <div className="mb-4">
        <Select
          className="basic-single"
          classNamePrefix="select"
          isClearable={true}
          isSearchable={true}
          name="glCode"
          styles={selectCustomStyles}
          options={glOptions}
          value={
            glOptions.find((opt) => opt.value === currentGLRow.glCode) || null
          }
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
              onChange={(value) =>
                setCurrentGLRow({
                  ...currentGLRow,
                  openingBalanceDate: value
                    ? dayjs(value).format("MM/DD/YYYY")
                    : "",
                })
              }
            />
          </DemoContainer>
        </LocalizationProvider>
      </div>
      <div className="mb-4">
        <FormLabel id="opening-balance-type">Type</FormLabel>
        <RadioGroup
          row
          aria-labelledby="opening-balance-type"
          name="row-radio-buttons-group"
          onChange={(e) =>
            setCurrentGLRow({ ...currentGLRow, type: e.target.value })
          }
          value={currentGLRow.type}
        >
          <FormControlLabel value="credit" control={<Radio />} label="Credit" />
          <FormControlLabel value="debit" control={<Radio />} label="Debit" />
        </RadioGroup>
      </div>
      <Stack direction="row" spacing={2}>
        <Button variant="contained" onClick={onSave}>
          Save
        </Button>
        <Button variant="outlined" onClick={onCancel}>
          Cancel
        </Button>
      </Stack>
    </div>
  );
}
