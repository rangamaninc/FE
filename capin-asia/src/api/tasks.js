import axios from "axios";

export const getAllTasks = async (clientId) => {
  const res = await axios.get(`/tasks?clientId=${clientId}`);
  return res.data;
};

export const AddNewTask = async (data) => {
  const res = await axios.post("/tasks/create", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const updateTask = async (taskId, data) => {
  const res = await axios.put(`/tasks/${taskId}/edit`, data);
  return res.data;
};
