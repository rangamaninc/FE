export const INSURANCE_FORM_TYPES = [
  {
    value: "direct",
    label: "Direct",
  },
  {
    value: "assumed",
    label: "Assumed",
  },
  {
    value: "ceded",
    label: "Ceded",
  },
  {
    value: "retroCeded",
    label: "Retro Ceded",
  },
];

const POLICY_NUMBER_FIELD = {
  name: "policyNumber",
  type: "TextField",
  label: "Policy Number",
  datatype: "text",
};

const PARENT_COMPANY_FIELD = {
  name: "parentCompany",
  type: "TextField",
  label: "Parent Company",
  datatype: "text",
};

const RE_INSURANCE_COMPANY_FIELD = {
  name: "reinsuranceCompany",
  type: "TextField",
  label: "Re-Insurance Company",
  datatype: "text",
};

const FRONTING_COMPANY_FIELD = {
  name: "frontingCompany",
  type: "TextField",
  label: "Fronting Company",
  datatype: "text",
};

const FRONTING_RISK_FIELD = {
  name: "frontingRisk",
  type: "TextField",
  label: "Fronting Risk",
  datatype: "number",
};

const RISK_SHARE_FIELD = {
  name: "riskShare",
  type: "TextField",
  label: "Risk Share",
  datatype: "number",
};

const RE_INSURANCE_RECOVERY_FIELD = {
  name: "reInsRecovery",
  type: "TextField",
  label: "Re-Insurance Recovery",
  datatype: "number",
};

const FRONTING_COMMISSION_FIELD = {
  name: "frontingCommission",
  type: "TextField",
  label: "Fronting Commision",
  datatype: "number",
};

const BROKERAGE_COMMISSION_FIELD = {
  name: "brokerageCommission",
  type: "TextField",
  label: "Brokerage Commission",
  datatype: "number",
};

const DEDUCTIBILITY_FIELD = {
  name: "deductibility",
  type: "TextField",
  label: "Deductibility",
  datatype: "number",
};

const POLICY_START_DATE_FIELD = {
  name: "policyStartDate",
  type: "DatePicker",
  label: "Policy Start Date",
};

const POLICY_EXPIRY_DATE_FIELD = {
  name: "policyExpiryDate",
  type: "DatePicker",
  label: "Policy Expiry Date",
};

const RENEW_DATE_FIELD = {
  name: "policyRenewDate",
  type: "DatePicker",
  label: "Renew Date",
};

const PREMIUM_FIELD = {
  name: "policyPremium",
  type: "TextField",
  label: "Premium",
  datatype: "number",
};

const EARNING_METHODOLOGY_FIELD = {
  name: "earningMethodology",
  type: "Select",
  label: "Earning Methodology",
  options: [
    {
      value: "Days Basis",
      label: "Days Basis",
    },
    {
      value: "Month Basis",
      label: "Month Basis",
    },
    {
      value: "Risk Basis",
      label: "Risk Basis",
    },
  ],
};

const CONTACT_PERSON_NAME_FIELD = {
  name: "contactName",
  type: "TextField",
  label: "Contact Person Name",
};

const CONTACT_PERSON_NUMBER_FIELD = {
  name: "contactPhone",
  type: "TextField",
  label: "Contact Person Number",
  datatype: "number",
};

export const INSURANCE_FORM_FIELDS = {
  direct: [
    POLICY_NUMBER_FIELD,
    PARENT_COMPANY_FIELD,
    RISK_SHARE_FIELD,
    BROKERAGE_COMMISSION_FIELD,
    DEDUCTIBILITY_FIELD,
    PREMIUM_FIELD,
    EARNING_METHODOLOGY_FIELD,
    CONTACT_PERSON_NAME_FIELD,
    CONTACT_PERSON_NUMBER_FIELD,
    POLICY_START_DATE_FIELD,
    POLICY_EXPIRY_DATE_FIELD,
    RENEW_DATE_FIELD,
  ],
  assumed: [
    POLICY_NUMBER_FIELD,
    PARENT_COMPANY_FIELD,
    FRONTING_COMPANY_FIELD,
    FRONTING_RISK_FIELD,
    RISK_SHARE_FIELD,
    FRONTING_COMMISSION_FIELD,
    BROKERAGE_COMMISSION_FIELD,
    DEDUCTIBILITY_FIELD,
    PREMIUM_FIELD,
    EARNING_METHODOLOGY_FIELD,
    CONTACT_PERSON_NAME_FIELD,
    CONTACT_PERSON_NUMBER_FIELD,
    POLICY_START_DATE_FIELD,
    POLICY_EXPIRY_DATE_FIELD,
    RENEW_DATE_FIELD,
  ],
  ceded: [
    POLICY_NUMBER_FIELD,
    PARENT_COMPANY_FIELD,
    FRONTING_COMPANY_FIELD,
    RE_INSURANCE_COMPANY_FIELD,
    RISK_SHARE_FIELD,
    RE_INSURANCE_RECOVERY_FIELD,
    BROKERAGE_COMMISSION_FIELD,
    DEDUCTIBILITY_FIELD,
    PREMIUM_FIELD,
    EARNING_METHODOLOGY_FIELD,
    CONTACT_PERSON_NAME_FIELD,
    CONTACT_PERSON_NUMBER_FIELD,
    POLICY_START_DATE_FIELD,
    POLICY_EXPIRY_DATE_FIELD,
    RENEW_DATE_FIELD,
  ],
  retroCeded: [
    POLICY_NUMBER_FIELD,
    PARENT_COMPANY_FIELD,
    FRONTING_COMPANY_FIELD,
    RE_INSURANCE_COMPANY_FIELD,
    FRONTING_RISK_FIELD,
    RISK_SHARE_FIELD,
    RE_INSURANCE_RECOVERY_FIELD,
    FRONTING_COMMISSION_FIELD,
    BROKERAGE_COMMISSION_FIELD,
    DEDUCTIBILITY_FIELD,
    PREMIUM_FIELD,
    EARNING_METHODOLOGY_FIELD,
    CONTACT_PERSON_NAME_FIELD,
    CONTACT_PERSON_NUMBER_FIELD,
    POLICY_START_DATE_FIELD,
    POLICY_EXPIRY_DATE_FIELD,
    RENEW_DATE_FIELD,
  ],
};
