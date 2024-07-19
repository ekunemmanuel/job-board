import { z } from "zod";
import type { State } from "~/types";

/**
 * Converts a timestamp into a human-readable time-ago format.
 * @param timestamp - The timestamp to convert.
 * @returns A string representing how long ago the timestamp was.
 */
function timeAgo(timestamp?: string): string | undefined {
  if (!timestamp) return;
  const date = new Date(timestamp);
  const now = new Date();
  const diff = Math.abs(now.getTime() - date.getTime()); // Difference in milliseconds

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days} day${days > 1 ? "s" : ""} ago`;
  }
  if (hours > 0) {
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  }
  if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  }
  if (seconds > 0) {
    return `${seconds} second${seconds > 1 ? "s" : ""} ago`;
  }

  return "Just now";
}

// Computed property for displaying time ago
export const time = computed(() => (t?: string) => timeAgo(t));

// Schema validation using Zod
export const schema = z.object({
  contact: z.object({
    name: z.string({ message: "Name is required" }).min(3, { message: "Name must be at least 3 characters long" }),
    email: z.string({ message: "Email is required" }).email({ message: "Invalid email address" }),
    social: z.string({ message: "Social URL is required" }).url({ message: "Invalid URL" }),
  }),
  description: z.string({ message: "Job Description is required" }).min(10, { message: "Description must be at least 10 characters long" }),
  title: z.string({ message: "Job title is required" }).min(2, { message: "Title must be at least 2 characters long" }),
  location: z.object({
    city: z.string({ message: "City is required" }),
    country: z.string({ message: "Country is required" }),
    state: z.string({ message: "State is required" }),
  }),
  remote: z.enum(["Hybrid", "On-site", "Remote"], { message: "Remote status is required" }),
  salary: z.object({
    amount: z.string({ message: "Amount is required" }),
    frequency: z.enum(["Monthly", "Yearly"], { message: "Frequency is required" }),
  }),
  type: z.enum(["Project", "Part-time", "Full-time"], { message: "Job type is required" }),
});

// Initial state for the reactive form
export const state = reactive<State>({
  title: undefined,
  description: undefined,
  type: undefined,
  remote: undefined,
  salary: {
    amount: undefined,
    frequency: undefined,
  },
  location: {
    city: undefined,
    state: undefined,
    country: undefined,
  },
  contact: {
    name: undefined,
    email: undefined,
    social: undefined,
  },
});

// Options for radio buttons
export const remoteOptions = [
  { label: "Hybrid", value: "Hybrid" },
  { label: "On-site", value: "On-site" },
  { label: "Remote", value: "Remote" },
];

export const frequencyOptions = [
  { label: "Monthly", value: "Monthly" },
  { label: "Yearly", value: "Yearly" },
];

export const typeOptions = [
  { label: "Project", value: "Project" },
  { label: "Part-time", value: "Part-time" },
  { label: "Full-time", value: "Full-time" },
];

export const optionsMap: { [key: string]: { label: string; value: string }[] } = {
  remote: remoteOptions,
  frequency: frequencyOptions,
  type: typeOptions,
};

