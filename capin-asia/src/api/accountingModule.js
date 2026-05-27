import axios from "axios";

export const getTrialBalanceData = async (clientId) => {
  const res = await axios.get(`/accounting/trail-balance/${clientId}`);
  return res.data;
};

export const getLedgerData = async (clientId, glCode) => {
  const res = await axios.get(`/accounting/ledger/${clientId}?glcode=${glCode}`);
  return res.data;
};
