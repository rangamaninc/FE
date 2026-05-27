import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";

import { useState } from "react";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import { Button, Grid } from "@mui/material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 350,
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: 1,
  p: 2,
};

export default function EditPrepaidModal({
  showModal,
  handleClose,
  handleSave,
  selectedRecord,
}) {
  const { glcode, amount } = selectedRecord;
  const [prepaidData, setPrepaidData] = useState({
    fromDate: "",
    toDate: "",
    monetisation: "daily",
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
          Update prepaid details
        </Typography>
        <Box sx={{ marginBottom: 2 }}>
          <Grid container>
            <Grid
              item
              xs={6}
              sx={{ justifyContent: "center", display: "flex" }}
            >
              GL code - {glcode}
            </Grid>
            <Grid
              item
              xs={6}
              sx={{ justifyContent: "center", display: "flex" }}
            >
              Amount - {amount}
            </Grid>
          </Grid>
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
                  setPrepaidData({
                    ...prepaidData,
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
                  setPrepaidData({
                    ...prepaidData,
                    toDate: dayjs(e.$d.toISOString()).format("MM/DD/YYYY"),
                  })
                }
              />
            </DemoContainer>
          </LocalizationProvider>
        </Box>
        <Box sx={{ marginBottom: 2 }}>
          <FormLabel id="demo-controlled-radio-buttons-group">Type</FormLabel>
          <RadioGroup
            row
            aria-labelledby="demo-controlled-radio-buttons-group"
            name="row-radio-buttons-group"
            onChange={(e) =>
              setPrepaidData({ ...prepaidData, monetisation: e.target.value })
            }
            value={prepaidData.monetisation}
          >
            <FormControlLabel value="daily" control={<Radio />} label="Daily" />
            <FormControlLabel
              value="monthly"
              control={<Radio />}
              label="Monthly"
            />
          </RadioGroup>
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
                onClick={() => handleSave(prepaidData)}
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

EditPrepaidModal.propTypes = {
  showModal: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  selectedRecord: PropTypes.object.isRequired,
  handleSave: PropTypes.func.isRequired,
};
