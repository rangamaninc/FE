import axios from "axios";

export const signIn = async (data) => {
  try {
    const res = await axios.post("/users/login", data);
    return res.data;
  } catch (error) {
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }
    if (error.code === "ERR_NETWORK") {
      throw new Error(
        "Unable to connect to the server. Please ensure the backend is running."
      );
    }
    throw new Error("Login failed. Please try again.");
  }
};
