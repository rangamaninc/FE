import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Plus } from "lucide-react";

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
import dayjs from "dayjs";

import TaskList from "./TasksList";
import { AddNewTask, getAllTasks, updateTask } from "../../api/tasks";
import { getClients, getMappedUsers } from "../SignIn/authSlice";
import { getAllTasksForClient, setTasks } from "./tasksSlice";
import EditTaskModal from "./EditTaskModal";
import {
  Button as UiButton,
  Card,
  CardContent,
  useToast,
} from "../../components/ui";

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
  const { toast } = useToast();

  const [showNewTaskModal, setShowNewTaskModal] = React.useState(false);
  const [showEditTaskModal, setShowEditTaskModal] = React.useState(false);
  const [selectedTask, setSelectedTask] = React.useState({});
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);
  const [isCreating, setIsCreating] = React.useState(false);
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
    if (!selectedClientId) {
      dispatch(setTasks([]));
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const res = await getAllTasks(selectedClientId);
      dispatch(setTasks(res?.tasks || []));
    } catch (err) {
      toast({
        title: "Failed to load tasks",
        description:
          err?.response?.data?.error || "Unable to fetch tasks for this client.",
        variant: "destructive",
      });
      dispatch(setTasks([]));
    } finally {
      setIsLoading(false);
    }
  }, [selectedClientId, dispatch, toast]);

  React.useEffect(() => {
    getTaskList();
  }, [getTaskList]);

  const resetCreateForm = () => {
    setSelectedAssignee(mappedUsers.length > 0 ? mappedUsers[0] : "");
    setSelectedTaskType("");
    setSelectedFile(null);
    setStartDate(null);
    setEndDate(null);
    if (clients.length > 0) {
      setSelectedClientId(clients[0].id);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
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

    setIsCreating(true);
    try {
      const res = await AddNewTask(data);
      if (res.success) {
        toast({
          title: "Task created",
          description: "The task was created successfully.",
          variant: "success",
        });
        setShowNewTaskModal(false);
        resetCreateForm();
        await getTaskList();
      } else {
        toast({
          title: "Create failed",
          description: res.error || "Unable to create task.",
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: "Create failed",
        description: err?.response?.data?.error || "Unable to create task.",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleTaskUpdate = async (updatedTaskData) => {
    setIsSaving(true);
    try {
      const res = await updateTask(selectedTask.id, updatedTaskData);
      if (res.success) {
        toast({
          title: "Task updated",
          description: "The task was updated successfully.",
          variant: "success",
        });
        setShowEditTaskModal(false);
        await getTaskList();
      } else {
        toast({
          title: "Update failed",
          description: res.error || "Unable to update task.",
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: "Update failed",
        description: err?.response?.data?.error || "Unable to update task.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
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
    <div className="flex min-h-[calc(100vh-12rem)] flex-col space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Scheduler</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage tasks and assignments for your clients.
          </p>
        </div>
        <UiButton
          type="button"
          className="w-fit shrink-0 self-end sm:self-auto"
          onClick={() => setShowNewTaskModal(true)}
        >
          <Plus className="h-4 w-4" />
          Create new task
        </UiButton>
      </div>

      <Card className="flex flex-1 flex-col">
        <CardContent className="flex flex-1 flex-col pt-6">
          <TaskList
            className="flex-1"
            tasksList={tasksList}
            isLoading={isLoading}
            isRefreshing={isLoading}
            onRefresh={getTaskList}
            setShowEditTaskModal={(task) => {
              setSelectedTask(task);
              setShowEditTaskModal(true);
            }}
          />
        </CardContent>
      </Card>

      <Modal
        open={showNewTaskModal}
        onClose={() => !isCreating && setShowNewTaskModal(false)}
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
                <FormControl fullWidth>
                  <InputLabel id="create-task-client-label">Client</InputLabel>
                  {clients.length > 0 && (
                    <Select
                      labelId="create-task-client-label"
                      id="create-task-client"
                      value={selectedClientId}
                      label="Client"
                      onChange={handleClientChange}
                    >
                      {clients.map((client) => (
                        <MenuItem key={client.id} value={client.id}>
                          {client.name}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel id="create-task-assignee-label">Assignee</InputLabel>
                  {mappedUsers.length > 0 && (
                    <Select
                      labelId="create-task-assignee-label"
                      id="create-task-assignee"
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
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel id="create-task-type-label">Task Type</InputLabel>
                  <Select
                    labelId="create-task-type-label"
                    id="create-task-type"
                    value={selectedTaskType}
                    label="Task Type"
                    onChange={handleTaskTypeChange}
                  >
                    <MenuItem value={1}>Account Payable</MenuItem>
                    <MenuItem value={2}>Account Receivable</MenuItem>
                    <MenuItem value={3}>General Task</MenuItem>
                  </Select>
                </FormControl>
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
              </Grid>
              <Grid item xs={6}>
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
              </Grid>
              <Grid item xs={6}>
                <input type="file" onChange={handleFileChange} />
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={isCreating}
                    sx={{ width: "auto", minWidth: 0, px: 3 }}
                  >
                    {isCreating ? "Creating..." : "Create"}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Modal>

      <EditTaskModal
        showModal={showEditTaskModal}
        handleClose={() => setShowEditTaskModal(false)}
        handleSave={handleTaskUpdate}
        selectedTask={selectedTask}
        isSaving={isSaving}
      />
    </div>
  );
}

export default SchedularModule;
