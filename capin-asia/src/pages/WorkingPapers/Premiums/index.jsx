import { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import dayjs from "dayjs";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

import Loader from "../../../components/Loader";
import { getSelectedClient } from "../../../redux/globalSlice";
import { getAllInsurancePolicies } from "../../../api/insurance";
import { MONTHS } from "../constants";

const Premiums = () => {
  const selectedClient = useSelector(getSelectedClient);
  const [policies, setPolicies] = useState([]);
  const [showLoader, setShowLoader] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(MONTHS[0]);

  const fetchAllPolices = useCallback(async () => {
    const insurancePolicies = await getAllInsurancePolicies(
      selectedClient.id,
      selectedMonth
    );
    setPolicies(insurancePolicies.policyDetails);
    setShowLoader(false);
  }, [selectedClient, selectedMonth]);

  useEffect(() => {
    fetchAllPolices();
  }, [fetchAllPolices]);

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  return (
    <div>
      <Grid>
        <Grid item xs={3}>
          <Select
            value={selectedMonth}
            displayEmpty
            inputProps={{ "aria-label": "Without label" }}
            onChange={handleMonthChange}
          >
            {MONTHS.map((month) => {
              return (
                <MenuItem key={month} value={month} defaultChecked>
                  {month}
                </MenuItem>
              );
            })}
          </Select>
        </Grid>
      </Grid>
      {showLoader ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "50vh",
          }}
        >
          <Loader />
        </div>
      ) : (
        <Box sx={{ marginTop: 3, marginBottom: 3, width: "95%" }}>
          {policies.length > 0 && (
            <>
              <table>
                <thead>
                  <tr>
                    <th>GL code</th>
                    <th>Policy number</th>
                    <th className="num">Total Policy</th>
                    <th className="num">Premium received</th>
                    <th className="num">Premium receivable</th>
                    <th>Policy start date</th>
                    <th>Policy end date</th>
                    <th className="num">Policy period days</th>
                    <th className="num">Policy inception days</th>
                    <th className="num">Policy earned days</th>
                    <th>Earning Method</th>
                    <th className="num">Current year earning</th>
                    <th className="num">Unearned Premium</th>
                    <th className="num">Remaining policy days</th>
                  </tr>
                </thead>
                <tbody>
                  {policies.map((balanceObj, index) => {
                    const {
                      glcode,
                      policyNumber,
                      totalPolicy,
                      preimumRecevied,
                      balanceReceivable,
                      policyStartDate,
                      policyEndDate,
                      policyPeriodDays,
                      currentYearEarning,
                      earningMethod,
                      policyEarnedDays,
                      policyInceptionDays,
                      remainingPolicyDays,
                      unearnedPremium,
                    } = balanceObj;
                    return (
                      <tr key={index}>
                        <td>{glcode}</td>
                        <td>{policyNumber}</td>
                        <td className="num">{totalPolicy}</td>
                        <td className="num">{preimumRecevied}</td>
                        <td className="num">{balanceReceivable}</td>
                        <td>{dayjs(policyStartDate).format("MM/DD/YYYY")}</td>
                        <td>{dayjs(policyEndDate).format("MM/DD/YYYY")}</td>
                        <td className="num">{policyPeriodDays}</td>
                        <td className="num">{policyInceptionDays}</td>
                        <td className="num">{policyEarnedDays}</td>
                        <td>{earningMethod}</td>
                        <td className="num">{currentYearEarning}</td>
                        <td className="num">{unearnedPremium}</td>
                        <td className="num">{remainingPolicyDays}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </>
          )}
        </Box>
      )}
    </div>
  );
};

export default Premiums;
