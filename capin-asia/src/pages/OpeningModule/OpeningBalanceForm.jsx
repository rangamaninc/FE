import PropTypes from "prop-types";
import FormField from "../../components/forms/FormField";
import { Button, FormActions, Input, TextArea } from "../../components/ui";
import { RadioGroup, RadioGroupItem } from "../../components/ui/RadioGroup";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/Select";
import { deriveFinancialYear, fromInputDate, toInputDate } from "./openingBalanceUtils";

const CURRENCY_OPTIONS = ["USD", "EUR", "GBP", "INR", "SGD"];

/** OpeningBalanceForm — add opening balance form using the design system. */
export default function OpeningBalanceForm({
  glOptions,
  currentGLRow,
  setCurrentGLRow,
  onSave,
  onCancel,
  isSaving = false,
  saveLabel = "Save",
}) {
  const handleDateChange = (event) => {
    const openingBalanceDate = fromInputDate(event.target.value);
    setCurrentGLRow({
      ...currentGLRow,
      openingBalanceDate,
      financialYear: deriveFinancialYear(openingBalanceDate),
    });
  };

  return (
    <div className="space-y-4">
      <FormField label="GL Code" required>
        <Select
          value={currentGLRow.glCode || undefined}
          onValueChange={(value) =>
            setCurrentGLRow({ ...currentGLRow, glCode: value })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select GL code" />
          </SelectTrigger>
          <SelectContent>
            {glOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormField>

      <FormField label="Financial Year" htmlFor="financialYear" required>
        <Input
          id="financialYear"
          name="financialYear"
          placeholder="e.g. 2025-26"
          value={currentGLRow.financialYear}
          onChange={(event) =>
            setCurrentGLRow({ ...currentGLRow, financialYear: event.target.value })
          }
        />
      </FormField>

      <FormField label="Balance Date" htmlFor="openingBalanceDate" required>
        <Input
          id="openingBalanceDate"
          name="openingBalanceDate"
          type="date"
          value={toInputDate(currentGLRow.openingBalanceDate)}
          onChange={handleDateChange}
        />
      </FormField>

      <FormField label="Opening Amount" htmlFor="glAmount" required>
        <Input
          id="glAmount"
          name="glAmount"
          type="number"
          min="0"
          step="0.01"
          value={currentGLRow.amount}
          onChange={(event) =>
            setCurrentGLRow({ ...currentGLRow, amount: event.target.value })
          }
        />
      </FormField>

      <FormField label="Currency" required>
        <Select
          value={currentGLRow.currencyCode || "USD"}
          onValueChange={(value) =>
            setCurrentGLRow({ ...currentGLRow, currencyCode: value })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select currency" />
          </SelectTrigger>
          <SelectContent>
            {CURRENCY_OPTIONS.map((code) => (
              <SelectItem key={code} value={code}>
                {code}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormField>

      <FormField label="Type" required>
        <RadioGroup
          className="flex flex-row gap-6"
          value={currentGLRow.type}
          onValueChange={(value) =>
            setCurrentGLRow({ ...currentGLRow, type: value })
          }
        >
          <label className="flex cursor-pointer items-center gap-2 text-sm">
            <RadioGroupItem value="credit" id="type-credit" />
            <span>Credit</span>
          </label>
          <label className="flex cursor-pointer items-center gap-2 text-sm">
            <RadioGroupItem value="debit" id="type-debit" />
            <span>Debit</span>
          </label>
        </RadioGroup>
      </FormField>

      <FormField label="Remarks" htmlFor="remarks">
        <TextArea
          id="remarks"
          name="remarks"
          rows={3}
          value={currentGLRow.remarks}
          onChange={(event) =>
            setCurrentGLRow({ ...currentGLRow, remarks: event.target.value })
          }
          placeholder="Optional notes"
        />
      </FormField>

      <FormActions>
        <Button type="button" onClick={onSave} disabled={isSaving}>
          {isSaving ? "Saving..." : saveLabel}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSaving}>
          Cancel
        </Button>
      </FormActions>
    </div>
  );
}

OpeningBalanceForm.propTypes = {
  glOptions: PropTypes.array.isRequired,
  currentGLRow: PropTypes.object.isRequired,
  setCurrentGLRow: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  isSaving: PropTypes.bool,
  saveLabel: PropTypes.string,
};
