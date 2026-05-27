import axios from "axios";

export const getAllInvestments = async (clientId, month) => {
  const res = await axios.get(`investments/${clientId}/${month}`);
  return res.data;
};

export const getInvestmentDetails = async (clientId) => {
  const res = await axios.get(`investments/details/${clientId}`);
  return res.data;
};

export const updateInvestmentDetails = async (clientId, data) => {
  const res = await axios.post(`investments/details/${clientId}`, data);
  return res.data;
};
