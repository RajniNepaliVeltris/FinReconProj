export type CustomerDetails = {
  customerHeader?: string;
  originChannel?: string;
  firstName: string;
  lastName: string;
  companyName?: string;
  email: string;
  customerGroup?: string;
  phone?: string;
  storeCredit?: string;
  receiveACSEmails?: string;
  forcePasswordReset?: string;
  taxExemptCode?: string;
  lineOfCredit?: string;
  paymentTerms?: string;
  password: string;
  confirmPassword: string;

  // 👇 Nested address object
  address?: {
    firstName: string;
    lastName: string;
    companyName?: string;
    phone?: string;
    street: string;
    line2?: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    type: string;
    poNumber?: string;
    taxId?: string;
  };
};
