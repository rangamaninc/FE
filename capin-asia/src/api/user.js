import axios from "axios";

export const getGLCodesByClientId = async (clientId, masterOnly = false) => {
  const res = await axios.get(`/clientdata/${clientId}/gl-codes`, {
    params: masterOnly ? { masterOnly: "true" } : {},
  });
  return res.data.glcodes;
};
