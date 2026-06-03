import axios from "axios";

export const createUser = async (payload) => {
  const res = await axios.post("/users/register", payload);
  return res.data;
};

export const getUsers = async () => {
  const res = await axios.get("/users");
  return res.data.users || [];
};

export const updateUser = async (id, payload) => {
  const res = await axios.put(`/users/${id}`, payload);
  return res.data;
};

export const deleteUser = async (id) => {
  const res = await axios.delete(`/users/${id}`);
  return res.data;
};

export const getClientHierarchy = async () => {
  const res = await axios.get("/clients/hierarchy");
  return res.data.clients || [];
};

export const createClient = async (payload) => {
  const res = await axios.post("/clients", payload);
  return res.data;
};

export const updateClient = async (id, payload) => {
  const res = await axios.put(`/clients/${id}`, payload);
  return res.data;
};

export const deleteClient = async (id) => {
  const res = await axios.delete(`/clients/${id}`);
  return res.data;
};
