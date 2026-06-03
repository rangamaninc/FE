import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";

import Box from "@mui/material/Box";
import Select from "react-select";
import Grid from "@mui/material/Grid";
import dayjs from "dayjs";

import {
  getSelectedClient,
  getSelectedClientGLCodes,
  setClientGLCodes,
  setClientGLCodesMap,
} from "../../../redux/globalSlice";
import Loader from "../../../components/Loader";
import { getLedgerData } from "../../../api/accountingModule";
import { getGLCodesByClientId } from "../../../api/user";
import { Typography } from "@mui/material";
import { useDispatch } from "react-redux";

const customStyles = {
  input: (provided) => ({
    ...provided,
    width: 100,
    height: 44,
    display: "flex",
    alignItems: "center",
  }),
  singleValue: (provided) => ({
    ...provided,
    marginTop: 2,
  }),
};
export default function Ledger() {
  const dispatch = useDispatch();
  const selectedClient = useSelector(getSelectedClient);
  const clientGLCodes = useSelector(getSelectedClientGLCodes);
  const [showLoader, setShowLoader] = useState(true);
  const [txnsData, setTxnsData] = useState([]);
  const [balanceDetails, setBalanceDetails] = useState({});
  const [selectedCashBook, setSelectedCashBook] = useState("");

  const options = clientGLCodes.map((glCodeObj) => ({
    value: glCodeObj.code,
    label: `${glCodeObj.code} - ${glCodeObj.name}`,
  }));

  useEffect(() => {
    const loadGlCodes = async () => {
      if (!selectedClient?.id || clientGLCodes.length > 0) return;
      const glCodes = await getGLCodesByClientId(selectedClient.id);
      if (glCodes?.length) {
        const glCodesMap = {};
        glCodes.forEach((gl) => {
          glCodesMap[gl.code] = gl.name;
        });
        dispatch(setClientGLCodes(glCodes));
        dispatch(setClientGLCodesMap(glCodesMap));
        setSelectedCashBook(glCodes[0].code);
      } else {
        setShowLoader(false);
      }
    };
    loadGlCodes();
  }, [selectedClient?.id, clientGLCodes.length, dispatch]);

  useEffect(() => {
    if (!selectedCashBook && clientGLCodes.length > 0) {
      setSelectedCashBook(clientGLCodes[0].code);
    }
  }, [clientGLCodes, selectedCashBook]);

  const fetchTransactions = useCallback(async () => {
    if (!selectedClient?.id || !selectedCashBook) {
      setShowLoader(false);
      return;
    }
    try {
      const txnData = await getLedgerData(selectedClient.id, selectedCashBook);
      setTxnsData(txnData.data?.subtransactions || []);
      setBalanceDetails(txnData.data?.balance_details || {});
    } catch {
      setTxnsData([]);
      setBalanceDetails({});
    } finally {
      setShowLoader(false);
    }
  }, [selectedClient?.id, selectedCashBook]);

  useEffect(() => {
    if (selectedCashBook) {
      setShowLoader(true);
      fetchTransactions();
    }
  }, [fetchTransactions, selectedCashBook]);

  if (!clientGLCodes.length) {
    return (
      <Typography sx={{ p: 3 }}>
        No GL codes available. Sign out and sign in again, or add GL codes for
        this client.
      </Typography>
    );
  }

  return (
    <div>
      <Grid container spacing={3}>
        <Grid item xs={4}>
          <Select
            className="basic-single"
            classNamePrefix="select"
            value={options.find((o) => o.value === selectedCashBook) || options[0]}
            isClearable={false}
            isSearchable={true}
            name="glCode"
            styles={customStyles}
            options={options}
            onChange={(e) => {
              setSelectedCashBook(e?.value || "");
              setShowLoader(true);
            }}
          />
        </Grid>
        {/* <Grid item xs={2}></Grid> */}
        <Grid item xs={4} sx={{ display: "flex", alignItems: "center" }}>
          {Object.keys(balanceDetails).length > 0 && (
            <Typography sx={{ color: "blue" }}>
              Total Balance: {balanceDetails.balance} ({balanceDetails.type})
            </Typography>
          )}
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
        <Box sx={{ margin: 5, width: "75%" }}>
          {txnsData.length > 0 && (
            <>
              <table>
                <thead>
                  <tr>
                    <th>Transaction date</th>
                    <th>Transaction type</th>
                    <th className="num">Transaction Id</th>
                    {/* <th>GLCode</th> */}
                    <th className="num">Amount</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {txnsData.map((balanceObj) => {
                    const {
                      transactionid,
                      amount,
                      transaction_date: transactionDate,
                      description,
                      type,glcode
                    } = balanceObj;
                    return (
                      <tr key={transactionid}>
                        <td>{dayjs(transactionDate).format("MM/DD/YYYY")}</td>
                        <td>{type}</td>
                        <td className="num">{transactionid}</td>
                        {/* <td>{glcode}</td> */}
                        <td className="num">{amount}</td>
                        <td>{description}</td>
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
