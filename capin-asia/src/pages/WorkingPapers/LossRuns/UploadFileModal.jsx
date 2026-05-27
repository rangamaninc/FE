import PropTypes from "prop-types";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Button, Grid } from "@mui/material";
import { useState } from "react";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 575,
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: 1,
  overflow: "scroll",
  maxHeight: "80vh",
  p: 2,
};

const UploadFileModal = ({
  showModal,
  handleClose,
  handleSave,
  fileValidation,
  errorMsg,
}) => {
  const [selectedFile, setSelectedFile] = useState(null);

  const onFileChange = (files) => {
    const file = files[0];
    setSelectedFile(file);
  };

  const onSaveClick = () => {
    const formData = new FormData();
    formData.append("file", selectedFile);
    handleSave(formData);
  };

  return (
    <Modal
      open={showModal}
      onClose={() => {
        setSelectedFile(null);
        handleClose();
      }}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography
          sx={{ marginBottom: 2 }}
          id="modal-modal-title"
          variant="h6"
          component="h2"
        >
          Upload new file
        </Typography>
        <Button variant="contained" component="label" sx={{ marginBottom: 2 }}>
          Upload File
          <input
            type="file"
            hidden
            onChange={(e) => onFileChange(e.target.files)}
          />
        </Button>
        {selectedFile && (
          <Typography sx={{ marginBottom: 2 }} id="modal-modal-file-name">
            {selectedFile.name}
          </Typography>
        )}

        {errorMsg && (
          <Typography
            sx={{ marginBottom: 2, color: "#f44336" }}
            id="modal-modal-error-msg"
          >
            {errorMsg}
          </Typography>
        )}

        {fileValidation && fileValidation.length > 0 && (
          <div>
            <p style={{ marginBottom: 10, color: "red" }}>
              Please check the following errors
            </p>
            <table>
              <thead>
                <th>Row</th>
                <th>Col</th>
                <th>Error</th>
              </thead>
              <tbody>
                {fileValidation.map((element, index) => {
                  return (
                    <tr key={index}>
                      <td>{element.row}</td>
                      <td>{element.column}</td>
                      <td>{element.error}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <Box sx={{ marginTop: 5 }}>
          <Grid container>
            <Grid
              item
              xs={6}
              sx={{ justifyContent: "center", display: "flex" }}
            >
              <Button
                onClick={() => {
                  setSelectedFile(null);
                  handleClose();
                }}
              >
                Cancel
              </Button>
            </Grid>
            <Grid
              item
              xs={6}
              sx={{ justifyContent: "center", display: "flex" }}
            >
              <Button variant="contained" onClick={onSaveClick}>
                Save
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Modal>
  );
};

UploadFileModal.propTypes = {
  showModal: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleSave: PropTypes.func.isRequired,
  fileValidation: PropTypes.array.isRequired,
  errorMsg: PropTypes.string.isRequired,
};

export default UploadFileModal;
