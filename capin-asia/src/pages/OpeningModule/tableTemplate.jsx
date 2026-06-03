/** Table markup for opening balance list (kept separate from page logic). */

export function renderOpeningBalanceTableHead() {
  return (
    <thead>
      <tr>
        <th>GL Code</th>
        <th>Date</th>
        <th className="num">Amount</th>
        <th>Type</th>
        <th>Updated By</th>
      </tr>
    </thead>
  );
}

export function formatGlCodeLabel(glCode, glName) {
  if (!glCode) return "";
  return glName ? `${glCode} - ${glName}` : glCode;
}

export function renderOpeningBalanceTableBody(
  records,
  formatDate,
  formatType,
  formatGlCode
) {
  if (records.length === 0) {
    return (
      <tbody>
        <tr>
          <td colSpan={5} className="text-center">
            No opening balance records found.
          </td>
        </tr>
      </tbody>
    );
  }

  return (
    <tbody>
      {records.map((record, index) => (
        <tr key={record.id ?? `${record.glCode}-${index}`}>
          <td>
            {formatGlCode
              ? formatGlCode(record.glCode, record.glName)
              : formatGlCodeLabel(record.glCode, record.glName)}
          </td>
          <td>{formatDate(record.openingBalanceDate)}</td>
          <td className="num">{record.amount}</td>
          <td>{formatType(record.isDebit)}</td>
          <td>{record.updatedBy || "-"}</td>
        </tr>
      ))}
    </tbody>
  );
}

export function renderOpeningBalanceTable(
  records,
  formatDate,
  formatType,
  formatGlCode
) {
  return (
    <table>
      {renderOpeningBalanceTableHead()}
      {renderOpeningBalanceTableBody(
        records,
        formatDate,
        formatType,
        formatGlCode
      )}
    </table>
  );
}
