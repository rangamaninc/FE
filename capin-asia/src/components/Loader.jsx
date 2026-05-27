import LinearProgress from "@mui/material/LinearProgress";
import Box from "@mui/material/Box";

export default function Loader() {
  return (
    <Box sx={{ width: 500 }}>
      <LinearProgress />
    </Box>
  );
}
