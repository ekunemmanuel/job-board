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
  role: string;
  createdAt?: string;
  updatedAt?: string;
}

// Job type
export interface Job {
  id?: string;
  companyID: string;
  jobTitle: string;
  remote: "On-site" | "Remote" | "Hybrid";
  type: "Project" | "Part-time" | "Full-time";
  salary: {
    amount: number;
    frequency: "Monthly" | "Yearly";
  };
  location: {
    country: string;
    state: string;
    city: string;
  };
  contactPerson: {
    email: string;
    name: string;
    number: string;
    image: string; // URL
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
  logo: string; // URL
  website: string;
  description: string;
  jobs: string[]; // Array of jobIDs
  createdAt?: string;
  updatedAt?: string;
}

// Job summary type for company job page
export interface JobSummary {
  jobID: string;
  jobTitle: string;
  type: "Project" | "Part-time" | "Full-time";
  location: {
    country: string;
    state: string;
    city: string;
  };
  timeOfCreation: Date;
  updatedAt: Date;
}

// Company job page type
export interface CompanyJobPage {
  companyID: string;
  jobs: JobSummary[];
}
