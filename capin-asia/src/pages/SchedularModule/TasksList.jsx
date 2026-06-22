import { useMemo } from "react";
import PropTypes from "prop-types";
import dayjs from "dayjs";
import { Badge, DataTable } from "../../components/ui";

function statusVariant(status) {
  const normalized = String(status || "").toLowerCase();
  if (normalized === "done") return "success";
  if (normalized.includes("progress")) return "warning";
  return "secondary";
}

export default function TaskList({
  tasksList,
  setShowEditTaskModal,
  onRefresh,
  isRefreshing,
  isLoading,
  className,
}) {
  const columns = useMemo(
    () => [
      { accessorKey: "id", header: "ID" },
      { accessorKey: "name", header: "Task Name" },
      { accessorKey: "assigned_to", header: "Assignee" },
      {
        accessorKey: "start_date",
        header: "Start Date",
        meta: {
          exportValue: (row) => dayjs(row.start_date).format("MM/DD/YYYY"),
        },
        cell: ({ row }) => dayjs(row.original.start_date).format("MM/DD/YYYY"),
      },
      {
        accessorKey: "end_date",
        header: "Due Date",
        meta: {
          exportValue: (row) => dayjs(row.end_date).format("MM/DD/YYYY"),
        },
        cell: ({ row }) => dayjs(row.original.end_date).format("MM/DD/YYYY"),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          <Badge variant={statusVariant(row.original.status)}>
            {row.original.status || "-"}
          </Badge>
        ),
        meta: {
          exportValue: (row) => row.status,
        },
      },
    ],
    []
  );

  return (
    <DataTable
      className={className}
      columns={columns}
      data={tasksList}
      pageSize={10}
      isLoading={isLoading}
      isRefreshing={isRefreshing}
      emptyTitle="No tasks found"
      emptyDescription="Create a task to get started."
      onRefresh={onRefresh}
      excelFileName="tasks"
      onEdit={(task) => setShowEditTaskModal(task)}
    />
  );
}

TaskList.propTypes = {
  tasksList: PropTypes.array.isRequired,
  setShowEditTaskModal: PropTypes.func.isRequired,
  onRefresh: PropTypes.func,
  isRefreshing: PropTypes.bool,
  isLoading: PropTypes.bool,
  className: PropTypes.string,
};
