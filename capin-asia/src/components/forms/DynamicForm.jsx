import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import PropTypes from "prop-types";
import { Input } from "../ui/Input";
import { TextArea } from "../ui/TextArea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/Select";
import { Checkbox } from "../ui/Checkbox";
import { Button } from "../ui/Button";
import FormField from "./FormField";

const fieldRenderers = {
  text: ({ field, props }) => <Input {...field} {...props} />,
  email: ({ field, props }) => <Input type="email" {...field} {...props} />,
  password: ({ field, props }) => <Input type="password" {...field} {...props} />,
  number: ({ field, props }) => <Input type="number" {...field} {...props} />,
  textarea: ({ field, props }) => <TextArea {...field} {...props} />,
  select: ({ field, props }) => (
    <Select value={field.value} onValueChange={field.onChange}>
      <SelectTrigger>
        <SelectValue placeholder={props.placeholder || "Select option"} />
      </SelectTrigger>
      <SelectContent>
        {(props.options || []).map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  ),
  checkbox: ({ field, props }) => (
    <Checkbox checked={field.value} onCheckedChange={field.onChange} {...props} />
  ),
};

/**
 * DynamicForm — schema-driven form renderer using React Hook Form + Zod.
 */
export default function DynamicForm({
  schema,
  fields,
  defaultValues,
  onSubmit,
  submitLabel = "Submit",
  isSubmitting = false,
}) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      {fields.map((fieldConfig) => {
        const {
          name,
          label,
          type = "text",
          helperText,
          required,
          ...props
        } = fieldConfig;
        const error = errors[name]?.message;
        const renderer = fieldRenderers[type] || fieldRenderers.text;

        if (type === "checkbox" || type === "select") {
          const value = watch(name);
          return (
            <FormField
              key={name}
              label={type === "checkbox" ? undefined : label}
              htmlFor={name}
              error={error}
              helperText={helperText}
              required={required}
            >
              {renderer({
                field: {
                  name,
                  value,
                  onChange: (nextValue) =>
                    setValue(name, nextValue, { shouldValidate: true }),
                },
                props,
              })}
              {type === "checkbox" && label ? (
                <label htmlFor={name} className="ml-2 text-sm">
                  {label}
                </label>
              ) : null}
            </FormField>
          );
        }

        return (
          <FormField
            key={name}
            label={label}
            htmlFor={name}
            error={error}
            helperText={helperText}
            required={required}
          >
            {renderer({ field: register(name), props: { id: name, ...props } })}
          </FormField>
        );
      })}
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : submitLabel}
      </Button>
    </form>
  );
}

DynamicForm.propTypes = {
  schema: PropTypes.object.isRequired,
  fields: PropTypes.array.isRequired,
  defaultValues: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  submitLabel: PropTypes.string,
  isSubmitting: PropTypes.bool,
};
