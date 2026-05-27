import * as React from "react";
import PropTypes from "prop-types";
import { useSearchParams } from "react-router-dom";

import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";

import CashBook from "./CashBook";
import Reconcile from "./Reconcile";
import Accurals from "./Accurals";
import Prepaid from "./Prepaid";
import Premiums from "./Premiums";
import EditTransactions from "./EditTransactions";
import LossRuns from "./LossRuns";
import Investments from "./Investments";

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

export default function WorkingPapers() {
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
          <Tab label="Cash Book" {...a11yProps(0)} />
          <Tab label="Reconcile" {...a11yProps(1)} />
          <Tab label="Accurals" {...a11yProps(2)} />
          <Tab label="Investment" {...a11yProps(3)} />
          <Tab label="Prepaid" {...a11yProps(4)} />
          <Tab label="Premiums" {...a11yProps(5)} />
          <Tab label="Edit Transactions" {...a11yProps(6)} />
          <Tab label="Loss Runs" {...a11yProps(7)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <CashBook handleTabChange={(newValue) => setValue(newValue)} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <Reconcile />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <Accurals />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={3}>
        <Investments />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={4}>
        <Prepaid />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={5}>
        <Premiums />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={6}>
        <EditTransactions />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={7}>
        <LossRuns />
      </CustomTabPanel>
    </Box>
  );
}
