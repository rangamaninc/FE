import axios from "axios";

export const getReconcileRecords = async (clientId) => {
  const res = await axios.get(`/reconcile/${clientId}`);
  return res.data;
};

export const updateReconcileRecord = async (clientId, data) => {
  const res = await axios.post(
    `/reconcile/${clientId}/update-transaction`,
    data
  );
  return res.data;
};

export const getAllInvestments = async (clientId) => {
  const res = await axios.get(`/reconcile/investment/${clientId}`);
  return res.data;
};

export const getUntaggedAccurals = async (clientId, glCode) => {
  const res = await axios.get(`/reconcile/accural/${clientId}/${glCode}`);
  return res.data;
};
