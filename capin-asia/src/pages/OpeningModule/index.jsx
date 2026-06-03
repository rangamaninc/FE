import React from "react";
import { useSelector } from "react-redux";
import { Box, Button, Typography, Snackbar } from "@mui/material";
import dayjs from "dayjs";

import { addOpeningBalance, getOpeningBalances } from "../../api/cashbook";
import { getGLCodesByClientId } from "../../api/user";
import {
  getSelectedClient,
  getSelectedClientGLCodesMap,
} from "../../redux/globalSlice";
import {
  formatGlCodeLabel,
  renderOpeningBalanceTable,
} from "./tableTemplate";
import { renderOpeningBalanceForm } from "./formTemplate";

function normalizeRecord(row) {
  return {
    id: row.id,
    glCode: row.glCode ?? row.glcode,
    glName: row.glName ?? row.glname ?? null,
    openingBalanceDate: row.openingBalanceDate ?? row.date,
    amount: row.amount,
    isDebit: row.isDebit ?? row.is_debit,
    updatedBy: row.updatedBy ?? row.updated_by,
  };
}

function OpeningModule() {
  const selectedClient = useSelector(getSelectedClient);
  const glCodesMap = useSelector(getSelectedClientGLCodesMap);
  const clientId = selectedClient?.id;

  const [refreshKey, setRefreshKey] = React.useState(0);
  const [showForm, setShowForm] = React.useState(false);
  const [records, setRecords] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [tableError, setTableError] = React.useState("");
  const [formError, setFormError] = React.useState("");
  const [showSnackbar, setShowSnackbar] = React.useState(false);
  const [clientGLCodes, setClientGLCodes] = React.useState([]);
  const [currentGLRow, setCurrentGLRow] = React.useState({
    glCode: "",
    amount: 0,
    openingBalanceDate: "",
    type: "credit",
  });

  React.useEffect(() => {
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

  React.useEffect(() => {
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

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const parsed = dayjs(dateStr, "MM/DD/YYYY", true);
    return parsed.isValid() ? parsed.format("MM/DD/YYYY") : String(dateStr);
  };

  const formatType = (isDebit) =>
    isDebit === "1" || isDebit === 1 || isDebit === true ? "Debit" : "Credit";

  const formatGlCode = (glCode, glName) =>
    formatGlCodeLabel(glCode, glName ?? glCodesMap[glCode]);

  const resetForm = () => {
    setCurrentGLRow({
      glCode: "",
      amount: 0,
      openingBalanceDate: "",
      type: "credit",
    });
    setFormError("");
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

    if (!currentGLRow.glCode || !currentGLRow.openingBalanceDate) {
      setFormError("Please select a GL code and date");
      return;
    }

    setFormError("");
    try {
      const res = await addOpeningBalance(clientId, {
        openingBalanceDate: currentGLRow.openingBalanceDate,
        amount: Number(currentGLRow.amount),
        glCode: currentGLRow.glCode,
        isDebit: currentGLRow.type === "debit",
      });

      if (res.success) {
        setShowSnackbar(true);
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
        setFormError("Failed to save opening balance. Check GL code and date.");
      }
    }
  };

  return (
    <div className="m-4">
      <Typography variant="h6" component="h1" sx={{ mb: 1 }}>
        Opening Balance
      </Typography>

      <div style={{ marginTop: 16, marginBottom: 32 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 1,
          }}
        >
          <Typography variant="subtitle1" component="h2">
            Opening Balance Records
          </Typography>
          {!showForm && (
            <Button variant="contained" onClick={() => setShowForm(true)}>
              Add new balance
            </Button>
          )}
        </Box>

        {!clientId ? (
          <Typography color="text.secondary">
            Select a client to view opening balances.
          </Typography>
        ) : loading ? (
          <Typography color="text.secondary">Loading...</Typography>
        ) : (
          <>
            {tableError && (
              <Typography sx={{ color: "#f44336", mb: 1 }}>
                {tableError}
              </Typography>
            )}
            {renderOpeningBalanceTable(
              records,
              formatDate,
              formatType,
              formatGlCode
            )}
          </>
        )}
      </div>

      {showForm && (
        <>
          <Typography variant="h6" component="h2" sx={{ mt: 2 }}>
            Add Opening Balance
          </Typography>
          {renderOpeningBalanceForm({
            glOptions,
            currentGLRow,
            setCurrentGLRow,
            onSave: handleSave,
            onCancel: () => {
              setShowForm(false);
              resetForm();
            },
          })}
          {formError && (
            <Typography sx={{ color: "#f44336" }}>{formError}</Typography>
          )}
        </>
      )}

      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={showSnackbar}
        autoHideDuration={5000}
        onClose={() => setShowSnackbar(false)}
        message="Opening Balance added"
      />
    </div>
  );
}

export default OpeningModule;
