import axios from "axios";

export const lossRunsUpload = async (clientId, formData) => {
  const res = await axios.post(`lossruns/${clientId}/upload`, formData);
  return res.data;
};

export const getLossRunsData = async (
  clientId,
  frequencyKey,
  frequencyValue
) => {
  const res = await axios.get(
    `lossruns/${clientId}?frequency=${frequencyKey}&value=${frequencyValue}`
  );
  return res.data;
};
