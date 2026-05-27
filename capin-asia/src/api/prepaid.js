import axios from "axios";

export const getPrepaidMonthlyReport = async (clientId, month) => {
  const res = await axios.get(`prepaid/${clientId}/${month}`);
  return res.data?.getPrepaidSummary;
};
