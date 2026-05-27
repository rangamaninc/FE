import axios from "axios";

export const getCashbookMonthlyBalances = async (clientId, cashbookId) => {
  const res = await axios.get(`/cashbook/${clientId}/${cashbookId}`);
  return res.data;
};

export const createNewTransaction = async (clientId, cashbookId, data) => {
  const res = await axios.post(
    `/cashbook/${clientId}/${cashbookId}/create`,
    data
  );
  return res.data;
};

export const addOpeningBalance = async (clientId, data) => {
  const res = await axios.post(`/cashbook/${clientId}/opening-balance`, data);
  return res.data;
};

export const getAllTransactionsOfClient = async (
  clientId,
  cashbookId,
  month
) => {
  const res = await axios.get(
    `/cashbook/${clientId}/${cashbookId}?month=${month}`
  );
  return res.data;
};

export const getSubTransactionsByTransactionId = async (
  clientId,
  glCode,
  transactionId
) => {
  const res = await axios.get(
    `/cashbook/transaction/${clientId}/${glCode}/${transactionId}`
  );
  return res.data;
};

export const updateSubTransactions = async (
  clientId,
  glCode,
  transactionId,
  body
) => {
  const res = await axios.post(
    `/cashbook/transaction/${clientId}/${glCode}/${transactionId}`,
    body
  );
  return res.data;
};
