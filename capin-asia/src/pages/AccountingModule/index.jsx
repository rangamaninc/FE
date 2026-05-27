import * as React from "react";
import PropTypes from "prop-types";
import { useSearchParams } from "react-router-dom";

import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Ledger from "./Legder";
import TrialBalance from "./TrialBalance";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <div>{children}</div>
        </Box>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function AccountingModule() {
  let [searchParams, setSearchParams] = useSearchParams();
  const [value, setValue] = React.useState(
    parseInt(searchParams.get("tab")) || 0
  );

  const handleChange = (_, newValue) => {
    setValue(newValue);
    let updatedSearchParams = new URLSearchParams(searchParams.toString());
    updatedSearchParams.set("tab", newValue);
    setSearchParams(updatedSearchParams.toString());
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="Ledger" {...a11yProps(0)} />
          <Tab label="Trial Balance" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <Ledger />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <TrialBalance />
      </CustomTabPanel>
    </Box>
  );
}
