import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  Alert,
  Box,
  Button,
  Grid,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { getUserRole } from "../SignIn/authSlice";
import { createUser, deleteUser, getUsers, updateUser } from "../../api/admin";

const roles = ["Admin", "Manager", "Operator", "User"];

export default function AdminUsers() {
  const userRole = useSelector(getUserRole);
  const isAllowed = new Set(["admin", "manager"]).has(userRole?.toLowerCase());
  const isAdmin = userRole?.toLowerCase() === "admin";
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    username: "",
    email: "",
    firstName: "",
    lastName: "",
    password: "",
    roleName: "User",
    isActive: 1,
  });
  const [users, setUsers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const loadUsers = async () => {
    try {
      const usersData = await getUsers();
      setUsers(usersData);
    } catch (err) {
      setError(err?.response?.data?.error || "Unable to fetch users.");
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const onChange = (key) => (event) => {
    setForm((prev) => ({ ...prev, [key]: event.target.value }));
  };

  const handleCreate = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");
    try {
      if (editingId) {
        await updateUser(editingId, {
          username: form.username,
          email: form.email,
          firstName: form.firstName,
          lastName: form.lastName,
          roleName: form.roleName,
          isActive: Number(form.isActive),
        });
        setMessage("User updated successfully.");
        setEditingId(null);
      } else {
        await createUser(form);
        setMessage("User created successfully.");
      }
      setForm({
        username: "",
        email: "",
        firstName: "",
        lastName: "",
        password: "",
        roleName: "User",
        isActive: 1,
      });
      setShowForm(false);
      await loadUsers();
    } catch (err) {
      setError(err?.response?.data?.error || "Unable to save user.");
    }
  };

  const handleEdit = (user) => {
    setEditingId(user.id);
    setShowForm(true);
    setForm({
      username: user.username || "",
      email: user.email || "",
      firstName: user.first_name || "",
      lastName: user.last_name || "",
      password: "",
      roleName: user.role_name || "User",
      isActive: user.is_active ?? 1,
    });
  };

  const handleDelete = async (id) => {
    setMessage("");
    setError("");
    try {
      await deleteUser(id);
      setMessage("User deleted successfully.");
      await loadUsers();
    } catch (err) {
      setError(err?.response?.data?.error || "Unable to delete user.");
    }
  };

  if (!isAllowed) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6">You are not authorized to view Users.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Users
      </Typography>
      {!isAdmin && (
        <Alert severity="info" sx={{ mb: 2 }}>
          Manager role has view-only access. Create/update actions are disabled.
        </Alert>
      )}

      {isAdmin && (
        <Paper sx={{ p: 2, mb: 2 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Typography variant="h6">{editingId ? "Update User" : "Add User"}</Typography>
            {!showForm && (
              <Button
                variant="contained"
                onClick={() => {
                  setEditingId(null);
                  setForm({
                    username: "",
                    email: "",
                    firstName: "",
                    lastName: "",
                    password: "",
                    roleName: "User",
                    isActive: 1,
                  });
                  setShowForm(true);
                }}
              >
                Add User
              </Button>
            )}
          </Box>
          {message && <Alert sx={{ mb: 2 }}>{message}</Alert>}
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          {showForm && (
            <Box component="form" onSubmit={handleCreate}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField fullWidth label="Username" value={form.username} onChange={onChange("username")} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField fullWidth label="Email" value={form.email} onChange={onChange("email")} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField fullWidth label="First Name" value={form.firstName} onChange={onChange("firstName")} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField fullWidth label="Last Name" value={form.lastName} onChange={onChange("lastName")} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Password"
                    type="password"
                    value={form.password}
                    onChange={onChange("password")}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField select fullWidth label="Role" value={form.roleName} onChange={onChange("roleName")}>
                    {roles.map((role) => (
                      <MenuItem key={role} value={role}>
                        {role}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField select fullWidth label="Status" value={form.isActive} onChange={onChange("isActive")}>
                    <MenuItem value={1}>Active</MenuItem>
                    <MenuItem value={0}>Inactive</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12}>
                  <Button type="submit" variant="contained" sx={{ mr: 1 }}>
                    {editingId ? "Update User" : "Create User"}
                  </Button>
                  <Button
                    type="button"
                    variant="outlined"
                    onClick={() => {
                      setShowForm(false);
                      setEditingId(null);
                    }}
                  >
                    Cancel
                  </Button>
                </Grid>
              </Grid>
            </Box>
          )}
        </Paper>
      )}

      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          User List
        </Typography>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Username</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role_name}</TableCell>
                <TableCell>{user.is_active ? "Active" : "Inactive"}</TableCell>
                <TableCell align="right">
                  <Button size="small" onClick={() => handleEdit(user)} disabled={!isAdmin}>
                    Edit
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    onClick={() => handleDelete(user.id)}
                    disabled={!isAdmin}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}
