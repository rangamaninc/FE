import { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Plus } from "lucide-react";
import { getUserRole } from "../SignIn/authSlice";
import { createUser, deleteUser, getUsers, updateUser } from "../../api/admin";
import { downloadExcelFromRows } from "../../utils/exportTableData";
import FormField from "../../components/forms/FormField";
import {
  Alert,
  AlertDescription,
  Badge,
  Button,
  Card,
  CardContent,
  DataTable,
  FormActions,
  Input,
  Modal,
  ModalContent,
  ModalDescription,
  ModalHeader,
  ModalTitle,
  Spinner,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  useToast,
} from "../../components/ui";

const ROLES = ["Admin", "Manager", "Operator", "User"];

const emptyForm = {
  username: "",
  email: "",
  firstName: "",
  lastName: "",
  password: "",
  roleName: "User",
  isActive: "1",
};

export default function AdminUsers() {
  const userRole = useSelector(getUserRole);
  const isAllowed = new Set(["admin", "manager"]).has(userRole?.toLowerCase());
  const isAdmin = userRole?.toLowerCase() === "admin";
  const { toast } = useToast();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState("add");
  const [editingId, setEditingId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState("");

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const usersData = await getUsers();
      setUsers(usersData);
    } catch (err) {
      toast({
        title: "Failed to load users",
        description: err?.response?.data?.error || "Unable to fetch users.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleExcelDownload = useCallback(() => {
    downloadExcelFromRows({
      rows: users,
      columns: [
        { header: "Username", accessor: "username" },
        { header: "Email", accessor: "email" },
        { header: "Role", accessor: "role_name" },
        {
          header: "Status",
          accessor: (row) => (row.is_active ? "Active" : "Inactive"),
        },
      ],
      fileName: "users",
    });
  }, [users]);

  const resetForm = () => {
    setForm(emptyForm);
    setFormError("");
    setEditingId(null);
    setFormMode("add");
  };

  const handleOpenForm = () => {
    resetForm();
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    resetForm();
  };

  const handleEdit = (user) => {
    if (!isAdmin) return;
    setFormMode("edit");
    setEditingId(user.id);
    setForm({
      username: user.username || "",
      email: user.email || "",
      firstName: user.first_name || "",
      lastName: user.last_name || "",
      password: "",
      roleName: user.role_name || "User",
      isActive: String(user.is_active ?? 1),
    });
    setFormError("");
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.username || !form.email) {
      setFormError("Username and email are required.");
      return;
    }
    if (formMode === "add" && !form.password) {
      setFormError("Password is required for new users.");
      return;
    }

    setFormError("");
    setIsSaving(true);

    try {
      if (formMode === "edit" && editingId) {
        await updateUser(editingId, {
          username: form.username,
          email: form.email,
          firstName: form.firstName,
          lastName: form.lastName,
          roleName: form.roleName,
          isActive: Number(form.isActive),
        });
        toast({
          title: "User updated",
          description: "The user was updated successfully.",
          variant: "success",
        });
      } else {
        await createUser({
          ...form,
          isActive: Number(form.isActive),
        });
        toast({
          title: "User created",
          description: "The user was created successfully.",
          variant: "success",
        });
      }
      handleCloseForm();
      await loadUsers();
    } catch (err) {
      setFormError(err?.response?.data?.error || "Unable to save user.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget?.id) return;

    setIsDeleting(true);
    try {
      await deleteUser(deleteTarget.id);
      toast({
        title: "User deleted",
        description: "The user was removed successfully.",
        variant: "success",
      });
      setDeleteTarget(null);
      await loadUsers();
    } catch (err) {
      toast({
        title: "Delete failed",
        description: err?.response?.data?.error || "Unable to delete user.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const columns = useMemo(
    () => [
      { accessorKey: "username", header: "Username" },
      { accessorKey: "email", header: "Email" },
      { accessorKey: "role_name", header: "Role" },
      {
        accessorKey: "is_active",
        header: "Status",
        cell: ({ row }) => (
          <Badge variant={row.original.is_active ? "success" : "warning"}>
            {row.original.is_active ? "Active" : "Inactive"}
          </Badge>
        ),
        meta: {
          exportValue: (row) => (row.is_active ? "Active" : "Inactive"),
        },
      },
    ],
    []
  );

  if (!isAllowed) {
    return (
      <Alert variant="destructive">
        <AlertDescription>You are not authorized to view Users.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-12rem)] flex-col space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Users</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {isAdmin
              ? "Manage user accounts, roles, and access."
              : "View user accounts and roles."}
          </p>
        </div>
        {isAdmin ? (
          <Button onClick={handleOpenForm}>
            <Plus className="h-4 w-4" />
            Add user
          </Button>
        ) : null}
      </div>

      <Card className="flex flex-1 flex-col">
        <CardContent className="flex flex-1 flex-col pt-6">
          {loading ? (
            <div className="flex min-h-[200px] flex-1 items-center justify-center">
              <Spinner label="Loading users..." />
            </div>
          ) : (
            <DataTable
              className="flex-1"
              columns={columns}
              data={users}
              pageSize={10}
              emptyTitle="No users found"
              emptyDescription="Add a user to get started."
              onRefresh={loadUsers}
              isRefreshing={loading}
              onExcelDownload={handleExcelDownload}
              showRowActions={isAdmin}
              onEdit={isAdmin ? handleEdit : undefined}
              onDelete={isAdmin ? setDeleteTarget : undefined}
            />
          )}
        </CardContent>
      </Card>

      <Modal open={showForm} onOpenChange={(open) => !open && handleCloseForm()}>
        <ModalContent className="max-w-lg">
          <ModalHeader>
            <ModalTitle>{formMode === "edit" ? "Edit User" : "Add User"}</ModalTitle>
            <ModalDescription>
              {formMode === "edit"
                ? "Update user account details and role."
                : "Enter details to create a new user account."}
            </ModalDescription>
          </ModalHeader>
          {formError ? (
            <Alert variant="destructive">
              <AlertDescription>{formError}</AlertDescription>
            </Alert>
          ) : null}
          <div className="space-y-4">
            <FormField label="Username" htmlFor="username" required>
              <Input
                id="username"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
              />
            </FormField>
            <FormField label="Email" htmlFor="email" required>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </FormField>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="First Name" htmlFor="firstName">
                <Input
                  id="firstName"
                  value={form.firstName}
                  onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                />
              </FormField>
              <FormField label="Last Name" htmlFor="lastName">
                <Input
                  id="lastName"
                  value={form.lastName}
                  onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                />
              </FormField>
            </div>
            {formMode === "add" ? (
              <FormField label="Password" htmlFor="password" required>
                <Input
                  id="password"
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
              </FormField>
            ) : null}
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Role" required>
                <Select
                  value={form.roleName}
                  onValueChange={(value) => setForm({ ...form, roleName: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {ROLES.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>
              <FormField label="Status" required>
                <Select
                  value={form.isActive}
                  onValueChange={(value) => setForm({ ...form, isActive: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Active</SelectItem>
                    <SelectItem value="0">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>
            </div>
            <FormActions>
              <Button type="button" onClick={handleSave} disabled={isSaving}>
                {isSaving ? "Saving..." : formMode === "edit" ? "Update" : "Save"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseForm}
                disabled={isSaving}
              >
                Cancel
              </Button>
            </FormActions>
          </div>
        </ModalContent>
      </Modal>

      <Modal
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && !isDeleting && setDeleteTarget(null)}
      >
        <ModalContent className="max-w-md">
          <ModalHeader>
            <ModalTitle>Delete user?</ModalTitle>
            <ModalDescription>
              This will permanently remove{" "}
              <span className="font-medium text-foreground">
                {deleteTarget?.username}
              </span>
              . This action cannot be undone.
            </ModalDescription>
          </ModalHeader>
          <FormActions>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteTarget(null)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
          </FormActions>
        </ModalContent>
      </Modal>
    </div>
  );
}
