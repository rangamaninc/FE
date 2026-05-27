import axios from "axios";

export const addNewInsurancePolicy = async (clientId, data) => {
  const res = await axios.post(`/insurance/${clientId}/policy`, data);
  return res.data;
};

export const getUntaggedInsurancePolicies = async (clientId, glCode) => {
  const res = await axios.get(`/reconcile/insurance/${clientId}/${glCode}`);
  return res.data;
};

export const getAllInsurancePolicies = async (clientId, month) => {
  const res = await axios.get(`/insurance/${clientId}/policy/${month}`);
  return res.data;
};
