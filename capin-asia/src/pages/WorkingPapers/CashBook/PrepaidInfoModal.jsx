import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";

import PropTypes from "prop-types";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  borderRadius: 2,
  pt: 2,
  px: 4,
  pb: 3,
};

export default function PrepaidInfoModal({
  showModal,
  handleClose,
  handleTabChange,
}) {
  return (
    <div>
      <Modal
        open={showModal}
        onClose={handleClose}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box sx={{ ...style, width: 400 }}>
          <h5 id="parent-modal-title">
            {" "}
            More informtion needed for the transaction
          </h5>
          <h6 style={{ marginBottom: 16 }}>please go to reconcile</h6>
          <Grid container spacing={2} rowSpacing={3}>
            <Grid item xs={6}>
              <Button
                onClick={() => {
                  handleTabChange(1); // 5 is the index of prepaid reconcile
                }}
                variant="contained"
              >
                Add details
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button onClick={handleClose}>Do it later</Button>
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </div>
  );
}

PrepaidInfoModal.propTypes = {
  showModal: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleTabChange: PropTypes.func.isRequired,
};
