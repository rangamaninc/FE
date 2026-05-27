import React from "react";

import { Button, Typography } from "@mui/material";
import Select from "react-select";
import { useSelector } from "react-redux";

import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import Snackbar from "@mui/material/Snackbar";

import { INSURANCE_FORM_TYPES, INSURANCE_FORM_FIELDS } from "./consts";
import { addNewInsurancePolicy } from "../../api/insurance";
import { getSelectedClient } from "../../redux/globalSlice";
import "./Insurance.css";

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

function Insurance() {
  const [showSnackbar, setShowSnackbar] = React.useState(false);
  const [snackbarText, setSnackbarText] = React.useState("");
  const [currentFormType, setCurrentFormType] = React.useState("direct");
  const [formData, setFormData] = React.useState({});

  const selectedClient = useSelector(getSelectedClient);

  const handleSave = async () => {
    const res = await addNewInsurancePolicy(selectedClient.id, {
      ...formData,
      type: currentFormType,
    });
    setShowSnackbar(true);
    if (res.success) {
      setSnackbarText("Opening Balance added");
      setTimeout(() => {
        window.location.reload(false);
      }, 200);
    } else {
      setSnackbarText("Same policy number exists");
    }
  };

  return (
    <div className="m-4">
      <Typography variant="h6" component="h6">
        Insurance Form
      </Typography>
      <div style={{ marginTop: 20, marginBottom: 20 }}>
        <Grid container spacing={2} rowSpacing={3}>
          <Grid item xs={6}>
            <Select
              className="basic-single"
              classNamePrefix="select"
              isClearable={true}
              isSearchable={true}
              name="color"
              defaultValue={INSURANCE_FORM_TYPES[0]}
              styles={customStyles}
              options={INSURANCE_FORM_TYPES}
              onChange={(e) => setCurrentFormType(e.value)}
              placeholder="Select Insurance Type"
            />
          </Grid>
          {INSURANCE_FORM_FIELDS[currentFormType].map((formFieldObj, index) => {
            const { name, type, label, datatype } = formFieldObj;
            if (type === "TextField") {
              return (
                <Grid
                  key={index}
                  item
                  className={
                    name === "contactPhone" && currentFormType != "direct" // to handle the padding issue for date picker field
                      ? "text-field-custom-padding"
                      : ""
                  }
                  xs={6}
                >
                  <TextField
                    name={name}
                    required
                    fullWidth
                    id={name}
                    label={label}
                    type={datatype}
                    onChange={(e) =>
                      setFormData({ ...formData, [name]: e.target.value })
                    }
                  />
                </Grid>
              );
            } else if (type === "Select") {
              return (
                <Grid key={index} item xs={6}>
                  <Select
                    className="basic-single"
                    classNamePrefix="select"
                    isClearable={true}
                    isSearchable={true}
                    name={name}
                    styles={customStyles}
                    options={formFieldObj.options}
                    onChange={(e) =>
                      setFormData({ ...formData, [name]: e.value })
                    }
                    placeholder="Earning Methodology"
                  />
                </Grid>
              );
            } else if (type === "DatePicker") {
              return (
                <Grid key={index} item xs={6}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={["DatePicker"]}>
                      <DatePicker
                        label={label}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            name,
                          },
                        }}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            [name]: dayjs(e.$d.toISOString()).format(
                              "MM/DD/YYYY"
                            ),
                          })
                        }
                      />
                    </DemoContainer>
                  </LocalizationProvider>
                </Grid>
              );
            }
          })}
        </Grid>
      </div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Button sx={{ width: 350 }} variant="contained" onClick={handleSave}>
          Save
        </Button>
      </div>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={showSnackbar}
        autoHideDuration={5000}
        onClose={() => setShowSnackbar(false)}
        message={snackbarText}
        key={"snackbar-top-right"}
      />
    </div>
  );
}

export default Insurance;
