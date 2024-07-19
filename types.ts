import { z } from "zod";
export interface Form {
  email: string;
  password: string;
  firstname?: string;
  lastname?: string;
}

export interface User {
  id?: string;
  uid?: string;
  email: string;
  name: string;
  // role: string;
  createdAt?: string;
  updatedAt?: string;
}

type Remote = "On-site" | "Remote" | "Hybrid";
type Type = "Project" | "Part-time" | "Full-time";
// Job type
export interface Job {
  id?: string;
  companyID: string;
  companyName?: string;
  title: string;
  remote: Remote;
  type: Type;
  salary: {
    amount: string;
    frequency: "Monthly" | "Yearly";
  };
  location: {
    country: string;
    state: string;
    city: string;
  };
  contact: {
    email: string;
    name: string;
    social: string; // URL
  };
  description: string;
  createdAt?: string;
  updatedAt?: string;
}

// Company type
export interface Company {
  id?: string;
  createdBy: string;
  name: string;
  // logo: string; // URL
  website: string;
  description?: string;
  jobs?: string[]; // Array of jobIDs
  createdAt?: string;
  updatedAt?: string;
}

export type Schema = z.output<typeof schema>;

export type State = {
  title?: string;
  remote?: string;
  type?: string;
  salary: {
    amount?: string;
    frequency?: string;
  };
  location: {
    country?: string;
    state?: string;
    city?: string;
  };
  contact: {
    email?: string;
    name?: string;
    social?: string; // URL
  };
  description?: string;
  createdAt?: string;
  updatedAt?: string;
};

export interface BatchOperations {
  type: "set" | "update" | "delete";
  collection: string;
  docId: string;
  data?: any;
}
