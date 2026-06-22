import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Plus } from "lucide-react";
import { getUserRole } from "../SignIn/authSlice";
import {
  createClient,
  deleteClient,
  getClientHierarchy,
  updateClient,
} from "../../api/admin";
import FormField from "../../components/forms/FormField";
import {
  Alert,
  AlertDescription,
  Button,
  Card,
  CardContent,
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
import { downloadExcelFromRows } from "../../utils/exportTableData";
import ClientHierarchyTable from "./ClientHierarchyTable";

const emptyForm = {
  name: "",
  code: "",
  type: "Captive Manager",
  parentId: "",
};

function flattenClients(managers) {
  return managers.flatMap((manager) => [
    {
      id: manager.id,
      type: manager.type || "Captive Manager",
      name: manager.name,
      code: manager.code || "",
      parentName: "-",
      parent_id: manager.parent_id,
    },
    ...(manager.captives?.map((captive) => ({
      id: captive.id,
      type: captive.type || "Captive",
      name: captive.name,
      code: captive.code || "",
      parentName: manager.name,
      parent_id: captive.parent_id ?? manager.id,
    })) ?? []),
  ]);
}

export default function AdminClients() {
  const userRole = useSelector(getUserRole);
  const isAllowed = new Set(["admin", "manager"]).has(userRole?.toLowerCase());
  const isAdmin = userRole?.toLowerCase() === "admin";
  const { toast } = useToast();

  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState("add");
  const [editingClientId, setEditingClientId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState("");

  const loadClients = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getClientHierarchy();
      setManagers(response);
    } catch (err) {
      toast({
        title: "Failed to load clients",
        description: err?.response?.data?.error || "Unable to fetch clients.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadClients();
  }, [loadClients]);

  const handleExcelDownload = useCallback(() => {
    downloadExcelFromRows({
      rows: flattenClients(managers),
      columns: [
        { header: "Type", accessor: "type" },
        { header: "Name", accessor: "name" },
        { header: "Code", accessor: "code" },
        { header: "Parent Manager", accessor: "parentName" },
      ],
      fileName: "clients",
    });
  }, [managers]);

  const resetForm = () => {
    setForm(emptyForm);
    setFormError("");
    setEditingClientId(null);
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

  const handleEdit = (client) => {
    if (!isAdmin) return;
    setFormMode("edit");
    setEditingClientId(client.id);
    setForm({
      name: client.name,
      code: client.code || "",
      type: client.type,
      parentId: client.parent_id ? String(client.parent_id) : "",
    });
    setFormError("");
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.code) {
      setFormError("Name and code are required.");
      return;
    }

    setFormError("");
    setIsSaving(true);

    try {
      const payload = {
        name: form.name,
        code: form.code,
        type: form.type,
        parentId: form.type === "Captive" ? form.parentId || null : null,
      };

      if (formMode === "edit" && editingClientId) {
        await updateClient(editingClientId, payload);
        toast({
          title: "Client updated",
          description: "The client was updated successfully.",
          variant: "success",
        });
      } else {
        await createClient(payload);
        toast({
          title: "Client created",
          description: "The client was created successfully.",
          variant: "success",
        });
      }
      handleCloseForm();
      await loadClients();
    } catch (err) {
      setFormError(err?.response?.data?.error || "Unable to save client.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget?.id) return;

    setIsDeleting(true);
    try {
      await deleteClient(deleteTarget.id);
      toast({
        title: "Client deleted",
        description: "The client was removed successfully.",
        variant: "success",
      });
      setDeleteTarget(null);
      await loadClients();
    } catch (err) {
      toast({
        title: "Delete failed",
        description: err?.response?.data?.error || "Unable to delete client.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isAllowed) {
    return (
      <Alert variant="destructive">
        <AlertDescription>You are not authorized to view Clients.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-12rem)] flex-col space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Clients</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {isAdmin
              ? "Manage captive managers and linked captives."
              : "View captive managers and linked captives."}
          </p>
        </div>
        {isAdmin ? (
          <Button onClick={handleOpenForm}>
            <Plus className="h-4 w-4" />
            Add client
          </Button>
        ) : null}
      </div>

      <Card className="flex flex-1 flex-col">
        <CardContent className="flex flex-1 flex-col pt-6">
          {loading ? (
            <div className="flex min-h-[200px] flex-1 items-center justify-center">
              <Spinner label="Loading clients..." />
            </div>
          ) : (
            <ClientHierarchyTable
              className="flex-1"
              managers={managers}
              isAdmin={isAdmin}
              onRefresh={loadClients}
              isRefreshing={loading}
              onExcelDownload={handleExcelDownload}
              onEdit={isAdmin ? handleEdit : undefined}
              onDelete={isAdmin ? setDeleteTarget : undefined}
            />
          )}
        </CardContent>
      </Card>

      <Modal open={showForm} onOpenChange={(open) => !open && handleCloseForm()}>
        <ModalContent className="max-w-lg">
          <ModalHeader>
            <ModalTitle>
              {formMode === "edit" ? "Edit Client" : "Add Client"}
            </ModalTitle>
            <ModalDescription>
              {formMode === "edit"
                ? "Update client name, code, type, and parent manager."
                : "Enter details to create a new client."}
            </ModalDescription>
          </ModalHeader>
          {formError ? (
            <Alert variant="destructive">
              <AlertDescription>{formError}</AlertDescription>
            </Alert>
          ) : null}
          <div className="space-y-4">
            <FormField label="Name" htmlFor="clientName" required>
              <Input
                id="clientName"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </FormField>
            <FormField label="Code" htmlFor="clientCode" required>
              <Input
                id="clientCode"
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value })}
              />
            </FormField>
            <FormField label="Type" required>
              <Select
                value={form.type}
                onValueChange={(value) =>
                  setForm({
                    ...form,
                    type: value,
                    parentId: value === "Captive Manager" ? "" : form.parentId,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Captive Manager">Captive Manager</SelectItem>
                  <SelectItem value="Captive">Captive</SelectItem>
                </SelectContent>
              </Select>
            </FormField>
            {form.type === "Captive" ? (
              <FormField label="Parent Manager">
                <Select
                  value={form.parentId || undefined}
                  onValueChange={(value) => setForm({ ...form, parentId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select parent manager" />
                  </SelectTrigger>
                  <SelectContent>
                    {managers.map((manager) => (
                      <SelectItem key={manager.id} value={String(manager.id)}>
                        {manager.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>
            ) : null}
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
            <ModalTitle>Delete client?</ModalTitle>
            <ModalDescription>
              This will permanently remove{" "}
              <span className="font-medium text-foreground">
                {deleteTarget?.name}
              </span>{" "}
              ({deleteTarget?.code}). This action cannot be undone.
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
