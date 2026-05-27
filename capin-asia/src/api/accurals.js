import axios from "axios";

export const addNewAccuralEntry = async (clientId, data) => {
  const res = await axios.post(`/accurals/${clientId}/`, data);
  return res.data;
};

export const getAccurals = async (clientId, month) => {
  const res = await axios.get(`/accurals/${clientId}/${month}`);
  return res.data;
};
