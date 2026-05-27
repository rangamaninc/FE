import { DataGrid } from "@mui/x-data-grid";
import PropTypes from "prop-types";
import Button from "@mui/material/Button";
import dayjs from "dayjs";

export default function TaskList({ tasksList, setShowEditTaskModal }) {
  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "name", headerName: "Task Name", width: 220 },
    { field: "assigned_to", headerName: "Assignee", width: 150 },
    {
      field: "start_date",
      headerName: "Start Date",
      width: 100,
      renderCell: (params) => {
        return <p>{dayjs(params.row.start_date).format("MM/DD/YYYY")}</p>;
      },
    },
    {
      field: "end_date",
      headerName: "Due Date",
      width: 100,
      renderCell: (params) => {
        return <p>{dayjs(params.row.end_date).format("MM/DD/YYYY")}</p>;
      },
    },
    {
      field: "status",
      headerName: "Status",
      width: 150,
    },
    {
      field: "action",
      headerName: "Action",
      width: 150,
      renderCell: (params) => {
        const onClick = () => {
          const currentRow = params.row;
          setShowEditTaskModal(currentRow);
          return;
        };

        return (
          <Button variant="outlined" size="small" onClick={onClick}>
            Edit
          </Button>
        );
      },
    },
  ];
  return (
    <div style={{ height: 600, width: "100%", marginTop: 30 }}>
      <DataGrid
        rows={tasksList}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 20 },
          },
        }}
        pageSizeOptions={[20]}
      />
    </div>
  );
}

TaskList.propTypes = {
  tasksList: PropTypes.array.isRequired,
  setShowEditTaskModal: PropTypes.func.isRequired,
};
