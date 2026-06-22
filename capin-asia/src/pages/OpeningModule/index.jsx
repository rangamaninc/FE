import { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { Plus, Send } from "lucide-react";
import {
  addOpeningBalance,
  deleteOpeningBalance,
  getOpeningBalances,
  postOpeningBalances,
  updateOpeningBalance,
} from "../../api/cashbook";
import { getGLCodesByClientId } from "../../api/user";
import {
  getSelectedClient,
  getSelectedClientGLCodesMap,
} from "../../redux/globalSlice";
import {
  Alert,
  AlertDescription,
  Button,
  Card,
  CardContent,
  Modal,
  ModalContent,
  ModalDescription,
  ModalHeader,
  ModalTitle,
  Spinner,
  EmptyState,
  useToast,
  FormActions,
} from "../../components/ui";
import OpeningBalanceForm from "./OpeningBalanceForm";
import OpeningBalanceTable from "./OpeningBalanceTable";
import {
  deriveFinancialYear,
  emptyFormState,
  normalizeRecord,
  recordToFormState,
} from "./openingBalanceUtils";

function buildSavePayload(currentGLRow) {
  const financialYear =
    currentGLRow.financialYear ||
    deriveFinancialYear(currentGLRow.openingBalanceDate);

  return {
    openingBalanceDate: currentGLRow.openingBalanceDate,
    amount: Number(currentGLRow.amount),
    glCode: currentGLRow.glCode,
    isDebit: currentGLRow.type === "debit",
    financialYear,
    currencyCode: currentGLRow.currencyCode || "USD",
    remarks: currentGLRow.remarks || undefined,
  };
}

export default function OpeningModule() {
  const selectedClient = useSelector(getSelectedClient);
  const glCodesMap = useSelector(getSelectedClientGLCodesMap);
  const clientId = selectedClient?.id;
  const clientName = selectedClient?.name;
  const { toast } = useToast();

  const [refreshKey, setRefreshKey] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState("add");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [tableError, setTableError] = useState("");
  const [formError, setFormError] = useState("");
  const [clientGLCodes, setClientGLCodes] = useState([]);
  const [currentGLRow, setCurrentGLRow] = useState(emptyFormState);
  const [postResult, setPostResult] = useState(null);
  const [showPostDialog, setShowPostDialog] = useState(false);

  useEffect(() => {
    if (!clientId) {
      setRecords([]);
      return;
    }

    let cancelled = false;

    async function loadRecords() {
      setLoading(true);
      setTableError("");
      try {
        const res = await getOpeningBalances(clientId);
        if (cancelled) return;

        const list = res?.openingBalances;
        if (Array.isArray(list)) {
          setRecords(list.map(normalizeRecord));
        } else if (res?.success === false) {
          setRecords([]);
          setTableError(res.error || "Failed to load opening balances.");
        } else {
          setRecords([]);
        }
      } catch (err) {
        if (!cancelled) {
          setRecords([]);
          const status = err.response?.status;
          setTableError(
            err.response?.data?.error ||
              (status === 500
                ? "Server error loading opening balances. Restart the API and check the database connection."
                : "Failed to load opening balances. Ensure the API server is running.")
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadRecords();
    return () => {
      cancelled = true;
    };
  }, [clientId, refreshKey]);

  useEffect(() => {
    if (!clientId || !showForm) {
      return;
    }

    getGLCodesByClientId(clientId, true)
      .then(setClientGLCodes)
      .catch(() => setClientGLCodes([]));
  }, [clientId, showForm]);

  const glOptions = clientGLCodes.map((glCodeObj) => ({
    value: glCodeObj.code,
    label: `${glCodeObj.code} - ${glCodeObj.name}`,
  }));

  const resetForm = () => {
    setCurrentGLRow(emptyFormState);
    setFormError("");
    setFormMode("add");
  };

  const handleSaved = () => {
    setRefreshKey((key) => key + 1);
    setShowForm(false);
    resetForm();
  };

  const handleSave = async () => {
    if (!clientId) {
      setFormError("Please select a client");
      return;
    }

    const financialYear =
      currentGLRow.financialYear ||
      deriveFinancialYear(currentGLRow.openingBalanceDate);

    if (!currentGLRow.glCode || !currentGLRow.openingBalanceDate) {
      setFormError("Please select a GL code and balance date");
      return;
    }

    if (!financialYear) {
      setFormError("Please enter a valid financial year");
      return;
    }

    setFormError("");
    setIsSaving(true);

    const payload = buildSavePayload(currentGLRow);
    const isEdit = formMode === "edit" && currentGLRow.id;

    try {
      const res = isEdit
        ? await updateOpeningBalance(clientId, currentGLRow.id, payload)
        : await addOpeningBalance(clientId, payload);

      if (res.success) {
        toast({
          title: isEdit ? "Opening balance updated" : "Opening balance added",
          description: isEdit
            ? "The record was updated successfully."
            : "The record was saved successfully.",
          variant: "success",
        });
        handleSaved();
      } else {
        setFormError(res.error || "Please provide valid details");
      }
    } catch (err) {
      const apiError = err.response?.data?.error;
      if (apiError) {
        setFormError(apiError);
      } else if (err.code === "ERR_NETWORK") {
        setFormError(
          "Cannot reach the server. Check that the API and database are running."
        );
      } else {
        setFormError(
          isEdit
            ? "Failed to update opening balance."
            : "Failed to save opening balance. Check GL code and date."
        );
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleOpenForm = () => {
    resetForm();
    setFormMode("add");
    setShowForm(true);
  };

  const handleEdit = (record) => {
    setFormMode("edit");
    setCurrentGLRow(recordToFormState(record));
    setFormError("");
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    resetForm();
  };

  const handleDelete = async () => {
    if (!clientId || !deleteTarget?.id) {
      return;
    }

    setIsDeleting(true);

    try {
      const res = await deleteOpeningBalance(clientId, deleteTarget.id);

      if (res.success) {
        toast({
          title: "Opening balance deleted",
          description: "The record was removed successfully.",
          variant: "success",
        });
        setDeleteTarget(null);
        setRefreshKey((key) => key + 1);
      } else {
        toast({
          title: "Delete failed",
          description: res.error || "Could not delete the record.",
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: "Delete failed",
        description:
          err.response?.data?.error ||
          "Failed to delete opening balance. Try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handlePost = async () => {
    if (!clientId) {
      toast({
        title: "No client selected",
        description: "Please select a client to post opening balances.",
        variant: "destructive",
      });
      return;
    }

    const draftRecords = records.filter(
      (r) => !r.postingStatus || r.postingStatus === "DRAFT"
    );

    if (draftRecords.length === 0) {
      toast({
        title: "Nothing to post",
        description: "No draft opening balances found to post.",
        variant: "destructive",
      });
      return;
    }

    setIsPosting(true);
    setPostResult(null);

    try {
      const res = await postOpeningBalances(clientId);

      if (res.success) {
        setPostResult(res);
        setShowPostDialog(true);
        setRefreshKey((key) => key + 1);
      } else {
        toast({
          title: "Post failed",
          description: res.error || "Failed to post opening balances.",
          variant: "destructive",
        });
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.error || err.message || "Failed to post opening balances.";
      toast({
        title: "Post failed",
        description: errorMsg,
        variant: "destructive",
      });
    } finally {
      setIsPosting(false);
    }
  };

  const draftCount = records.filter(
    (r) => !r.postingStatus || r.postingStatus === "DRAFT"
  ).length;

  const postedCount = records.filter(
    (r) => r.postingStatus === "POSTED"
  ).length;

  const subtitle = clientName
    ? `Manage opening balance entries for ${clientName}.`
    : "Manage opening balance entries for the selected client.";

  return (
    <div className="flex min-h-[calc(100vh-12rem)] flex-col space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Opening Balance</h1>
          <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
        </div>
        {clientId ? (
          <div className="flex items-center gap-2">
            {draftCount > 0 && (
              <Button
                variant="default"
                onClick={handlePost}
                disabled={isPosting}
              >
                <Send className="h-4 w-4 mr-1" />
                {isPosting ? "Posting..." : `Post (${draftCount})`}
              </Button>
            )}
            <Button onClick={handleOpenForm}>
              <Plus className="h-4 w-4" />
              Add new balance
            </Button>
          </div>
        ) : null}
      </div>

      {draftCount > 0 && postedCount > 0 && (
        <div className="text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-yellow-500" />
            {draftCount} draft
          </span>
          <span className="mx-2">|</span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            {postedCount} posted
          </span>
        </div>
      )}

      <Card className="flex flex-1 flex-col">
        <CardContent className="flex flex-1 flex-col pt-6">
          {!clientId ? (
            <EmptyState
              title="No client selected"
              description="Choose a client from the main header to load opening balances."
            />
          ) : loading ? (
            <div className="flex min-h-[200px] flex-1 items-center justify-center">
              <Spinner label="Loading opening balances..." />
            </div>
          ) : (
            <>
              {tableError ? (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{tableError}</AlertDescription>
                </Alert>
              ) : null}
              <OpeningBalanceTable
                className="flex-1"
                records={records}
                glCodesMap={glCodesMap}
                onEdit={handleEdit}
                onDelete={setDeleteTarget}
                onRefresh={() => setRefreshKey((key) => key + 1)}
                isRefreshing={loading}
                excelFileName={
                  clientName
                    ? `opening-balances-${clientName}`
                    : "opening-balances"
                }
              />
            </>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Form Modal */}
      <Modal open={showForm} onOpenChange={(open) => !open && handleCloseForm()}>
        <ModalContent className="max-w-lg">
          <ModalHeader>
            <ModalTitle>
              {formMode === "edit" ? "Edit Opening Balance" : "Add Opening Balance"}
            </ModalTitle>
            <ModalDescription>
              {formMode === "edit"
                ? "Update GL code, financial year, balance date, amount, and type."
                : "Enter GL code, financial year, balance date, amount, and type."}
            </ModalDescription>
          </ModalHeader>
          {formError ? (
            <Alert variant="destructive">
              <AlertDescription>{formError}</AlertDescription>
            </Alert>
          ) : null}
          <OpeningBalanceForm
            glOptions={glOptions}
            currentGLRow={currentGLRow}
            setCurrentGLRow={setCurrentGLRow}
            onSave={handleSave}
            onCancel={handleCloseForm}
            isSaving={isSaving}
            saveLabel={formMode === "edit" ? "Update" : "Save"}
          />
        </ModalContent>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && !isDeleting && setDeleteTarget(null)}
      >
        <ModalContent className="max-w-md">
          <ModalHeader>
            <ModalTitle>Delete opening balance?</ModalTitle>
            <ModalDescription>
              This will permanently remove the opening balance for{" "}
              <span className="font-medium text-foreground">
                {deleteTarget?.glCode}
              </span>{" "}
              ({deleteTarget?.financialYear}). This action cannot be undone.
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

      {/* Post Success Dialog */}
      <Modal
        open={showPostDialog}
        onOpenChange={(open) => !open && setShowPostDialog(false)}
      >
        <ModalContent className="max-w-md">
          <ModalHeader>
            <ModalTitle>Opening Balances Posted Successfully</ModalTitle>
            <ModalDescription>
              {postResult && (
                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Journal Number:</span>
                    <span className="font-medium">{postResult.journalNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Journal ID:</span>
                    <span className="font-medium">{postResult.journalId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Records Posted:</span>
                    <span className="font-medium">{postResult.recordsPosted}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Debit:</span>
                    <span className="font-medium">
                      ${Number(postResult.totalDebit).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Credit:</span>
                    <span className="font-medium">
                      ${Number(postResult.totalCredit).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              )}
            </ModalDescription>
          </ModalHeader>
          <FormActions>
            <Button
              type="button"
              onClick={() => setShowPostDialog(false)}
            >
              Close
            </Button>
          </FormActions>
        </ModalContent>
      </Modal>

    </div>
  );
}