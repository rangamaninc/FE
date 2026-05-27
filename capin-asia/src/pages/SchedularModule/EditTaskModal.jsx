import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";

import { useState } from "react";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import { Button, Grid } from "@mui/material";
import Select from "react-select";
import dayjs from "dayjs";

const options = [
  { value: "Todo", label: "Todo" },
  { value: "In progress", label: "In progress" },
  { value: "Done", label: "Done" },
];

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

export default function EditTaskModal({
  showModal,
  handleClose,
  handleSave,
  selectedTask,
}) {
  const [taskData, setTaskData] = useState({
    status: "",
  });
  const { assigned_to, start_date, end_date, status } = selectedTask;

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
          <b>Task details</b>
        </Typography>
        <Box sx={{ marginBottom: 2 }}>
          <Grid container>
            <Grid
              item
              xs={6}
              sx={{ justifyContent: "center", display: "flex" }}
            >
              Assignee
            </Grid>
            <Grid
              item
              xs={6}
              sx={{ justifyContent: "center", display: "flex" }}
            >
              {assigned_to}
            </Grid>
          </Grid>
        </Box>
        <Box sx={{ marginBottom: 2 }}>
          <Grid container>
            <Grid
              item
              xs={6}
              sx={{ justifyContent: "center", display: "flex" }}
            >
              Start date
            </Grid>
            <Grid
              item
              xs={6}
              sx={{ justifyContent: "center", display: "flex" }}
            >
              {dayjs(start_date).format("MM/DD/YYYY")}
            </Grid>
          </Grid>
        </Box>
        <Box sx={{ marginBottom: 2 }}>
          <Grid container>
            <Grid
              item
              xs={6}
              sx={{ justifyContent: "center", display: "flex" }}
            >
              End date
            </Grid>
            <Grid
              item
              xs={6}
              sx={{ justifyContent: "center", display: "flex" }}
            >
              {dayjs(end_date).format("MM/DD/YYYY")}
            </Grid>
          </Grid>
        </Box>
        <Box sx={{ marginBottom: 2 }}>
          <Grid container>
            <Grid
              item
              xs={6}
              sx={{ justifyContent: "center", display: "flex" }}
            >
              Status
            </Grid>
            <Grid
              item
              xs={6}
              sx={{ justifyContent: "center", display: "flex" }}
            >
              <Select
                value={taskData.status || status}
                options={options}
                isDisabled={status === "Done"}
                onChange={(option) => setTaskData({ status: option.label })}
              />
            </Grid>
          </Grid>
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
                disabled={status === "Done"}
                variant="contained"
                onClick={() => handleSave(taskData)}
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

EditTaskModal.propTypes = {
  showModal: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleSave: PropTypes.func.isRequired,
  selectedTask: PropTypes.object.isRequired,
};
