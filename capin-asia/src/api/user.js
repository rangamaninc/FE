import axios from "axios";

export const getGLCodesByClientId = async (clientId) => {
  const res = await axios.get(`/clientdata/${clientId}/gl-codes`);
  return res.data.glcodes;
};
