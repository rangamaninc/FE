import axios from "axios";

export const signIn = async (data) => {
  const res = await axios.post("/users/login", data);
  return res.data;
};
