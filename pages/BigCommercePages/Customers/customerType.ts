export type CustomerDetails = {
  description: string;
  customerHeader?: string;
  originChannel?: string;
  firstName: string;
  lastName: string;
  companyName?: string;
  email: string; // can be blank in data to auto-generate
  emailBase?: string; // optional base for generated email (default 'johndoe')
  emailDomain?: string; // optional domain for generated email (default '@gmail.com')
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
