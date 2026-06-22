import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import dayjs from "dayjs";
import {
  Button,
  FormActions,
  Modal,
  ModalContent,
  ModalDescription,
  ModalHeader,
  ModalTitle,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui";

const STATUS_OPTIONS = [
  { value: "Todo", label: "Todo" },
  { value: "In progress", label: "In progress" },
  { value: "Done", label: "Done" },
];

function normalizeStatus(status) {
  if (!status) return "";
  const match = STATUS_OPTIONS.find(
    (option) =>
      option.value.toLowerCase() === String(status).toLowerCase() ||
      option.label.toLowerCase() === String(status).toLowerCase()
  );
  return match?.value ?? status;
}

export default function EditTaskModal({
  showModal,
  handleClose,
  handleSave,
  selectedTask,
  isSaving = false,
}) {
  const [status, setStatus] = useState("");
  const isDone = normalizeStatus(selectedTask?.status) === "Done";

  useEffect(() => {
    if (showModal) {
      setStatus(normalizeStatus(selectedTask?.status));
    }
  }, [showModal, selectedTask]);

  const handleOpenChange = (open) => {
    if (!open && !isSaving) {
      handleClose();
    }
  };

  return (
    <Modal open={showModal} onOpenChange={handleOpenChange}>
      <ModalContent className="max-w-md">
        <ModalHeader>
          <ModalTitle>Task details</ModalTitle>
          <ModalDescription>Review task information and update status.</ModalDescription>
        </ModalHeader>

        <div className="space-y-4 text-sm">
          <div className="grid grid-cols-2 gap-2">
            <span className="text-muted-foreground">Assignee</span>
            <span className="font-medium text-foreground">
              {selectedTask?.assigned_to || "-"}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <span className="text-muted-foreground">Start date</span>
            <span className="font-medium text-foreground">
              {selectedTask?.start_date
                ? dayjs(selectedTask.start_date).format("MM/DD/YYYY")
                : "-"}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <span className="text-muted-foreground">End date</span>
            <span className="font-medium text-foreground">
              {selectedTask?.end_date
                ? dayjs(selectedTask.end_date).format("MM/DD/YYYY")
                : "-"}
            </span>
          </div>
          <div className="grid grid-cols-2 items-center gap-2">
            <span className="text-muted-foreground">Status</span>
            <Select
              value={status || undefined}
              onValueChange={setStatus}
              disabled={isDone}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <FormActions align="end" fitContent>
          <Button
            type="button"
            onClick={() => handleSave({ status })}
            disabled={isDone || isSaving || !status}
          >
            {isSaving ? "Saving..." : "Save"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isSaving}
          >
            Cancel
          </Button>
        </FormActions>
      </ModalContent>
    </Modal>
  );
}

EditTaskModal.propTypes = {
  showModal: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleSave: PropTypes.func.isRequired,
  selectedTask: PropTypes.object.isRequired,
  isSaving: PropTypes.bool,
};
