import dayjs from "dayjs";

export function deriveFinancialYear(mmddyyyy) {
  const parsed = dayjs(mmddyyyy, "MM/DD/YYYY", true);
  if (!parsed.isValid()) return "";

  const month = parsed.month() + 1;
  const year = parsed.year();

  if (month >= 4) {
    return `${year}-${String(year + 1).slice(-2)}`;
  }
  return `${year - 1}-${String(year).slice(-2)}`;
}

export function normalizeRecord(row) {
  const balanceType = row.balanceType ?? row.balance_type;
  const isDebit =
    row.isDebit ??
    row.is_debit ??
    (balanceType === "D" ? true : balanceType === "C" ? false : undefined);

  return {
    id: row.id ?? row.opening_balance_id ?? row.openingBalanceId,
    glCode: row.glCode ?? row.gl_code ?? row.glcode,
    glName: row.glName ?? row.glname ?? null,
    openingBalanceDate:
      row.openingBalanceDate ?? row.balanceDate ?? row.balance_date,
    openingAmount: row.openingAmount ?? row.opening_amount ?? row.amount,
    amount: row.openingAmount ?? row.opening_amount ?? row.amount,
    balanceType,
    isDebit,
    financialYear: row.financialYear ?? row.financial_year ?? "",
    currencyCode: row.currencyCode ?? row.currency_code ?? "USD",
    remarks: row.remarks ?? "",
    postingStatus: row.postingStatus ?? row.posting_status ?? "DRAFT",
    batchId: row.batchId ?? row.batch_id ?? null,
    journalId: row.journalId ?? row.journal_id ?? null,
    updatedBy:
      row.updatedByName ?? row.updatedBy ?? row.updated_by_name ?? row.updated_by,
  };
}

export function formatGlCodeLabel(glCode, glName) {
  if (!glCode) return "";
  return glName ? `${glCode} - ${glName}` : glCode;
}

export function formatOpeningDate(dateStr) {
  if (!dateStr) return "";
  const parsed = dayjs(dateStr, "MM/DD/YYYY", true);
  return parsed.isValid() ? parsed.format("MM/DD/YYYY") : String(dateStr);
}

export function formatBalanceAmount(amount, currencyCode = "USD") {
  const value = Number(amount);
  const formatted = Number.isFinite(value)
    ? value.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    : "0.00";
  return `${formatted} ${currencyCode || "USD"}`;
}

export function formatBalanceType(value) {
  if (value === "D" || value === "d" || value === "debit") return "Debit";
  if (value === "C" || value === "c" || value === "credit") return "Credit";
  if (value === "1" || value === 1 || value === true) return "Debit";
  return "Credit";
}

export function toInputDate(mmddyyyy) {
  const parsed = dayjs(mmddyyyy, "MM/DD/YYYY", true);
  return parsed.isValid() ? parsed.format("YYYY-MM-DD") : "";
}

export function fromInputDate(yyyymmdd) {
  const parsed = dayjs(yyyymmdd);
  return parsed.isValid() ? parsed.format("MM/DD/YYYY") : "";
}

export const emptyFormState = {
  id: null,
  glCode: "",
  amount: 0,
  openingBalanceDate: "",
  financialYear: "",
  currencyCode: "USD",
  remarks: "",
  type: "credit",
};

export function recordToFormState(record) {
  return {
    id: record.id,
    glCode: record.glCode || "",
    amount: record.amount ?? 0,
    openingBalanceDate: record.openingBalanceDate || "",
    financialYear: record.financialYear || "",
    currencyCode: record.currencyCode || "USD",
    remarks: record.remarks || "",
    type:
      record.isDebit || record.balanceType === "D" ? "debit" : "credit",
  };
}
