import { useState, useCallback, useEffect } from "react";
import { useSelector } from "react-redux";

import Box from "@mui/material/Box";

import Loader from "../../../components/Loader";
import {
  getSelectedClient,
  getSelectedClientGLCodesMap,
} from "../../../redux/globalSlice";
import { getTrialBalanceData } from "../../../api/accountingModule";

export default function TrialBalance() {
  const selectedClient = useSelector(getSelectedClient);
  const [trialBalanceData, setTrialBalanceData] = useState([]);
  const [showLoader, setShowLoader] = useState(true);
  const clientGLCodesMap = useSelector(getSelectedClientGLCodesMap);

  const fetchTrialBalanceData = useCallback(async () => {
    if (!selectedClient?.id) {
      setShowLoader(false);
      return;
    }
    try {
      const res = await getTrialBalanceData(selectedClient.id);
      setTrialBalanceData(res.data || []);
    } catch {
      setTrialBalanceData([]);
    } finally {
      setShowLoader(false);
    }
  }, [selectedClient?.id]);

  useEffect(() => {
    fetchTrialBalanceData();
  }, [fetchTrialBalanceData]);

  return (
    <div>
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
          {trialBalanceData.length > 0 && (
            <>
              <table>
                <thead>
                  <tr>
                    <th>GL code</th>
                    <th>GL description</th>
                    <th className="num">Balance</th>
                    <th>Credit/Debit</th>
                  </tr>
                </thead>
                <tbody>
                  {trialBalanceData.map((balanceObj, index) => {
                    const { glcode, balance, type } = balanceObj;
                    return (
                      <tr key={index}>
                        <td>{glcode}</td>
                        <td>{clientGLCodesMap[glcode]}</td>
                        <td className="num">{balance}</td>
                        <td>{type}</td>
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
}
