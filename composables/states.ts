import type { Company, Job } from "~/types";

export const useUser = () => {
  return useState<string>("user", () => "user 2");
};

export const useCompanies = () => {
  return useState<Company[]>("companues", () => [
    {
      createdBy: "user 2",
      name: "amazon",
      website: "https://amazon.com",
      id: "1",
      jobs: ["amazon-job1", "amazon-job2", "amazon-job3"],
    },
    {
      createdBy: "user 1",
      name: "ebay",
      website: "https://ebay.com",
      id: "2",
      jobs: ["ebay-job1", "ebay-job2", "ebay-job3"],
    },
    {
      createdBy: "user 2",
      name: "spotify",
      website: "https://spotify.com",
      id: "3",
      jobs: ["spotify-job1", "spotify-job2", "spotify-job3"],
    },
    {
      createdBy: "user 1",
      name: "google",
      website: "https://google.com",
      id: "4",
      jobs: ["google-job1", "google-job2", "google-job3"],
    },
  ]);
};

export const useJobs = () => {
  return useState<Job[]>("jobs", () => [
    {
      companyID: "1",
      contactPerson: {
        email: "emmanuelapabiekun@gamil.com",
        image: "",
        name: "emmanuel apabiekun",
      },
      description: "This is a  role for a senior dev at amazon",
      location: {
        city: "Ikeja",
        country: "Nigeria",
        state: "Lagos",
      },
      remote: "Hybrid",
      salary: {
        amount: "3000",
        frequency: "Monthly",
      },
      title: "Senior Dev",
      type: "Project",
      id: "amazon-job1",

    },
    {
      companyID: "2",
      contactPerson: {
        email: "emmanuelapabiekun@gamil.com",
        image: "",
        name: "emmanuel apabiekun",
      },
      description: "This is a  role for a junior dev at amazon",
      location: {
        city: "Ikeja",
        country: "Nigeria",
        state: "Lagos",
      },
      remote: "Hybrid",
      salary: {
        amount: "3000",
        frequency: "Monthly",
      },
      title: "Junior Dev",
      type: "Project",
      id: "amazon-job2",

    },
    {
      companyID: "3",
      contactPerson: {
        email: "emmanuelapabiekun@gamil.com",
        image: "",
        name: "emmanuel apabiekun",
      },
      description: "This is a  role for a senior dev at ebay",
      location: {
        city: "Ikeja",
        country: "Nigeria",
        state: "Lagos",
      },
      remote: "Hybrid",
      salary: {
        amount: "3000",
        frequency: "Monthly",
      },
      title: "Senior Dev",
      type: "Project",
      id: "ebay-job1",

    },
    {
      companyID: "4",
      contactPerson: {
        email: "emmanuelapabiekun@gamil.com",
        image: "",
        name: "emmanuel apabiekun",
      },
      description: "This is a  role for a senior dev at google",
      location: {
        city: "Ikeja",
        country: "Nigeria",
        state: "Lagos",
      },
      remote: "Hybrid",
      salary: {
        amount: "3000",
        frequency: "Monthly",
      },
      title: "Senior Dev",
      type: "Project",
      id: "google-job1",

    },
  ]);
};
