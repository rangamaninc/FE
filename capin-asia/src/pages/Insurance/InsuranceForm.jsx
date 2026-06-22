import PropTypes from "prop-types";
import FormField from "../../components/forms/FormField";
import {
  Button,
  FormActions,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui";
import { INSURANCE_FORM_FIELDS, INSURANCE_FORM_TYPES } from "./consts";
import { fromInputDate, toInputDate } from "./insuranceFormUtils";

export default function InsuranceForm({
  currentFormType,
  onFormTypeChange,
  formData,
  onFormDataChange,
  onSave,
  isSaving = false,
}) {
  const fields = INSURANCE_FORM_FIELDS[currentFormType] ?? [];

  const updateField = (name, value) => {
    onFormDataChange({ ...formData, [name]: value });
  };

  const renderField = (formFieldObj) => {
    const { name, type, label, datatype } = formFieldObj;

    if (type === "TextField") {
      return (
        <FormField key={name} label={label} htmlFor={name} required>
          <Input
            id={name}
            name={name}
            type={datatype === "number" ? "number" : "text"}
            value={formData[name] ?? ""}
            onChange={(event) => updateField(name, event.target.value)}
          />
        </FormField>
      );
    }

    if (type === "Select") {
      return (
        <FormField key={name} label={label || "Earning Methodology"} required>
          <Select
            value={formData[name] || undefined}
            onValueChange={(value) => updateField(name, value)}
          >
            <SelectTrigger id={name}>
              <SelectValue placeholder="Select earning methodology" />
            </SelectTrigger>
            <SelectContent>
              {formFieldObj.options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>
      );
    }

    if (type === "DatePicker") {
      return (
        <FormField key={name} label={label} htmlFor={name} required>
          <Input
            id={name}
            name={name}
            type="date"
            value={toInputDate(formData[name])}
            onChange={(event) =>
              updateField(name, fromInputDate(event.target.value))
            }
          />
        </FormField>
      );
    }

    return null;
  };

  return (
    <div className="space-y-4">
      <FormField label="Insurance Type" required>
        <Select value={currentFormType} onValueChange={onFormTypeChange}>
          <SelectTrigger className="max-w-sm">
            <SelectValue placeholder="Select insurance type" />
          </SelectTrigger>
          <SelectContent>
            {INSURANCE_FORM_TYPES.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormField>

      <div className="grid gap-4 sm:grid-cols-2">{fields.map(renderField)}</div>

      <FormActions align="end" fitContent>
        <Button type="button" onClick={onSave} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save"}
        </Button>
      </FormActions>
    </div>
  );
}

InsuranceForm.propTypes = {
  currentFormType: PropTypes.string.isRequired,
  onFormTypeChange: PropTypes.func.isRequired,
  formData: PropTypes.object.isRequired,
  onFormDataChange: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  isSaving: PropTypes.bool,
};
