import * as React from "react";
import { useDispatch, useSelector } from "react-redux";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import Snackbar from "@mui/material/Snackbar";
import dayjs from "dayjs";

import TaskList from "./TasksList";
import { AddNewTask, getAllTasks, updateTask } from "../../api/tasks";
import { getClients, getMappedUsers } from "../SignIn/authSlice";
import { getAllTasksForClient, setTasks } from "./tasksSlice";
import EditTaskModal from "./EditTaskModal";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 750,
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: 1,
  p: 4,
};

function SchedularModule() {
  const dispatch = useDispatch();
  const clients = useSelector(getClients);
  const mappedUsers = useSelector(getMappedUsers);
  const tasksList = useSelector(getAllTasksForClient);
  const [showNewTaskModal, setShowNewTaskModal] = React.useState(false);
  const [showEditTaskModal, setShowEditTaskModal] = React.useState(false);
  const [selectedTask, setSelectedTask] = React.useState({});
  const [showSnackbar, setShowSnackbar] = React.useState(false);
  const [snackBarMsg, setSnackBarMsg] = React.useState("");
  const [selectedClientId, setSelectedClientId] = React.useState(
    clients.length > 0 ? clients[0].id : ""
  );
  const [selectedAssignee, setSelectedAssignee] = React.useState(
    mappedUsers.length > 0 ? mappedUsers[0] : ""
  );
  const [selectedTaskType, setSelectedTaskType] = React.useState("");
  const [selectedFile, setSelectedFile] = React.useState(null);
  const [startDate, setStartDate] = React.useState(null);
  const [endDate, setEndDate] = React.useState(null);

  const getTaskList = React.useCallback(async () => {
    const res = await getAllTasks(selectedClientId);
    dispatch(setTasks(res?.tasks || []));
  }, [selectedClientId, dispatch]);

  React.useEffect(() => {
    getTaskList();
  }, [getTaskList]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    var reqData = {};
    data.forEach((value, key) => (reqData[key] = value));
    data.append("assignedTo", selectedAssignee);
    data.append("type", selectedTaskType);
    data.append("clientId", selectedClientId);
    if (startDate) {
      data.append("startDate", startDate.format("MM/DD/YYYY"));
    }
    if (endDate) {
      data.append("endDate", endDate.format("MM/DD/YYYY"));
    }
    if (selectedFile) {
      data.append("file", selectedFile);
    }

    const res = await AddNewTask(data);
    if (res.success) {
      setShowSnackbar(true);
      setShowNewTaskModal(false);
      setSnackBarMsg("Task created successfully");
      setTimeout(() => {
        getTaskList();
      }, 1000);
    }
  };

  const handleTaskUpdate = async (updatedTaskData) => {
    const res = await updateTask(selectedTask.id, updatedTaskData);
    if (res.success) {
      setShowSnackbar(true);
      setShowEditTaskModal(false);
      setSnackBarMsg("Task updated successfully");
      setTimeout(() => {
        getTaskList();
      }, 1000);
    }
  };

  const handleClientChange = (e) => {
    setSelectedClientId(e.target.value);
  };

  const handleAssigneeChange = (e) => {
    setSelectedAssignee(e.target.value);
  };

  const handleTaskTypeChange = (e) => {
    setSelectedTaskType(e.target.value);
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  return (
    <div className="w-100 p-4">
      <div className="d-flex justify-content-start">
        <Button variant="contained" onClick={() => setShowNewTaskModal(true)}>
          Create new task
        </Button>
      </div>
      <Modal
        open={showNewTaskModal}
        onClose={() => setShowNewTaskModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Enter Task Details
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <Grid container spacing={2} rowSpacing={3}>
              <Grid item xs={6}>
                <TextField
                  required
                  fullWidth
                  id="taskName"
                  label="Name"
                  name="name"
                  autoFocus
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  required
                  fullWidth
                  name="description"
                  label="Description"
                  id="description"
                />
              </Grid>
              <Grid item xs={6}>
                <Box>
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">
                      Client
                    </InputLabel>
                    {clients.length > 0 && (
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={selectedClientId}
                        label="Client"
                        onChange={handleClientChange}
                      >
                        {clients.map((client) => (
                          <MenuItem
                            key={client.id}
                            value={client.id}
                            defaultChecked
                          >
                            {client.name}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  </FormControl>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box>
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">
                      Assginee
                    </InputLabel>
                    {mappedUsers.length > 0 && (
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={selectedAssignee}
                        label="Assignee"
                        onChange={handleAssigneeChange}
                      >
                        {mappedUsers.map((mappedUser) => (
                          <MenuItem key={mappedUser} value={mappedUser}>
                            {mappedUser}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  </FormControl>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box>
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">
                      Task Type
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={selectedTaskType}
                      label="Task Type"
                      onChange={handleTaskTypeChange}
                    >
                      <MenuItem value={1}>Account Payable</MenuItem>
                      <MenuItem value={2}>Account Receivable</MenuItem>
                      <MenuItem value={3}>General Task</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  required
                  fullWidth
                  name="subType"
                  label="sub task"
                  id="subTask"
                />
              </Grid>
              <Grid item xs={6}>
                <Box>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={["DatePicker"]}>
                      <DatePicker
                        label="Start Date"
                        value={startDate}
                        onChange={(value) => setStartDate(value)}
                        slotProps={{
                          textField: { fullWidth: true, required: true },
                        }}
                        minDate={dayjs()}
                      />
                    </DemoContainer>
                  </LocalizationProvider>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={["DatePicker"]}>
                      <DatePicker
                        label="End Date"
                        value={endDate}
                        onChange={(value) => setEndDate(value)}
                        slotProps={{
                          textField: { fullWidth: true, required: true },
                        }}
                        minDate={startDate || dayjs()}
                      />
                    </DemoContainer>
                  </LocalizationProvider>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <input className="" type="file" onChange={handleFileChange} />
              </Grid>
              <Grid
                item
                xs={12}
                sx={{ justifyContent: "center", display: "flex" }}
              >
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ maxWidth: 300 }}
                >
                  Create
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Modal>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={showSnackbar}
        autoHideDuration={5000}
        onClose={() => setShowSnackbar(false)}
        message={snackBarMsg}
        key={"snackbar-top-right"}
      />
      <TaskList
        tasksList={tasksList}
        setShowEditTaskModal={(task) => {
          setSelectedTask(task);
          setShowEditTaskModal(true);
        }}
      />
      <EditTaskModal
        showModal={showEditTaskModal}
        handleClose={() => setShowEditTaskModal(false)}
        handleSave={handleTaskUpdate}
        selectedTask={selectedTask}
      />
    </div>
  );
}

export default SchedularModule;
