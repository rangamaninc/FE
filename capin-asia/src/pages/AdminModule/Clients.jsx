import { Fragment, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  Alert,
  Box,
  Button,
  Collapse,
  Grid,
  IconButton,
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
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { getUserRole } from "../SignIn/authSlice";
import {
  createClient,
  deleteClient,
  getClientHierarchy,
  updateClient,
} from "../../api/admin";

export default function AdminClients() {
  const userRole = useSelector(getUserRole);
  const isAllowed = new Set(["admin", "manager"]).has(userRole?.toLowerCase());
  const isAdmin = userRole?.toLowerCase() === "admin";
  const [expanded, setExpanded] = useState({});
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [data, setData] = useState([]);
  const [editingClientId, setEditingClientId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    code: "",
    type: "Captive Manager",
    parentId: "",
  });

  const loadClients = async () => {
    try {
      const response = await getClientHierarchy();
      setData(response);
    } catch (err) {
      setError(err?.response?.data?.error || "Unable to fetch clients.");
    }
  };

  useEffect(() => {
    loadClients();
  }, []);

  const onChange = (key) => (event) => {
    setForm((prev) => ({ ...prev, [key]: event.target.value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");
    try {
      const payload = {
        name: form.name,
        code: form.code,
        type: form.type,
        parentId: form.parentId || null,
      };
      if (editingClientId) {
        await updateClient(editingClientId, payload);
        setMessage("Client updated successfully.");
      } else {
        await createClient(payload);
        setMessage("Client created successfully.");
      }
      setEditingClientId(null);
      setForm({ name: "", code: "", type: "Captive Manager", parentId: "" });
      setShowForm(false);
      await loadClients();
    } catch (err) {
      setError(err?.response?.data?.error || "Unable to save client.");
    }
  };

  const handleDelete = async (id) => {
    setMessage("");
    setError("");
    try {
      await deleteClient(id);
      setMessage("Client deleted successfully.");
      await loadClients();
    } catch (err) {
      setError(err?.response?.data?.error || "Unable to delete client.");
    }
  };

  const handleEdit = (client) => {
    setEditingClientId(client.id);
    setShowForm(true);
    setForm({
      name: client.name,
      code: client.code || "",
      type: client.type,
      parentId: client.parent_id || "",
    });
  };

  if (!isAllowed) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6">You are not authorized to view Clients.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Clients
      </Typography>

      {!isAdmin && (
        <Alert severity="info" sx={{ mb: 2 }}>
          Manager role has view-only access. Update actions are disabled.
        </Alert>
      )}

      {message && <Alert sx={{ mb: 2 }}>{message}</Alert>}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {isAdmin && (
        <Paper sx={{ p: 2, mb: 2 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Typography variant="h6">{editingClientId ? "Update Client" : "Add Client"}</Typography>
            {!showForm && (
              <Button
                variant="contained"
                onClick={() => {
                  setEditingClientId(null);
                  setForm({ name: "", code: "", type: "Captive Manager", parentId: "" });
                  setShowForm(true);
                }}
              >
                Add Client
              </Button>
            )}
          </Box>
          {showForm && (
            <Box component="form" onSubmit={onSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={3}>
                  <TextField fullWidth label="Name" value={form.name} onChange={onChange("name")} />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField fullWidth label="Code" value={form.code} onChange={onChange("code")} />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField select fullWidth label="Type" value={form.type} onChange={onChange("type")}>
                    <MenuItem value="Captive Manager">Captive Manager</MenuItem>
                    <MenuItem value="Captive">Captive</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    select
                    fullWidth
                    label="Parent Manager"
                    value={form.parentId}
                    onChange={onChange("parentId")}
                    disabled={form.type !== "Captive"}
                  >
                    <MenuItem value="">None</MenuItem>
                    {data.map((manager) => (
                      <MenuItem key={manager.id} value={manager.id}>
                        {manager.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12}>
                  <Button type="submit" variant="contained" sx={{ mr: 1 }}>
                    {editingClientId ? "Update Client" : "Create Client"}
                  </Button>
                  <Button
                    type="button"
                    variant="outlined"
                    onClick={() => {
                      setShowForm(false);
                      setEditingClientId(null);
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
          Captive Managers
        </Typography>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Name</TableCell>
              <TableCell>Code</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((manager) => (
              <Fragment key={manager.id}>
                <TableRow>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() => setExpanded((prev) => ({ ...prev, [manager.id]: !prev[manager.id] }))}
                    >
                      {expanded[manager.id] ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                  </TableCell>
                  <TableCell>{manager.name}</TableCell>
                  <TableCell>{manager.code}</TableCell>
                  <TableCell align="right">
                    <Button size="small" onClick={() => handleEdit(manager)} disabled={!isAdmin}>
                      Edit
                    </Button>
                    <Button size="small" color="error" onClick={() => handleDelete(manager.id)} disabled={!isAdmin}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={4} sx={{ py: 0 }}>
                    <Collapse in={!!expanded[manager.id]} timeout="auto" unmountOnExit>
                      <Box sx={{ p: 1 }}>
                        <Typography variant="subtitle2" sx={{ mb: 1 }}>
                          Linked Captives
                        </Typography>
                        <Table size="small">
                          <TableBody>
                            {manager.captives?.map((captive) => (
                              <TableRow key={captive.id}>
                                <TableCell>{captive.name}</TableCell>
                                <TableCell>{captive.code}</TableCell>
                                <TableCell align="right">
                                  <Button size="small" onClick={() => handleEdit(captive)} disabled={!isAdmin}>
                                    Edit
                                  </Button>
                                  <Button
                                    size="small"
                                    color="error"
                                    onClick={() => handleDelete(captive.id)}
                                    disabled={!isAdmin}
                                  >
                                    Delete
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                            {!manager.captives?.length && (
                              <TableRow>
                                <TableCell colSpan={3}>No linked captives.</TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </Box>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </Fragment>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}
