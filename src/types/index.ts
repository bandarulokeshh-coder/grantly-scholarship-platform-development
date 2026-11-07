export const EDUCATION_LEVELS = [
  "school",
  "diploma",
  "undergraduate",
  "postgraduate",
] as const;

export type EducationLevel = (typeof EDUCATION_LEVELS)[number];

export const LEVEL_LABELS: Record<EducationLevel, string> = {
  school: "School (Class 9–12)",
  diploma: "Diploma / ITI",
  undergraduate: "Undergraduate",
  postgraduate: "Postgraduate",
};

export const CATEGORIES = [
  "general",
  "ews",
  "obc",
  "sc",
  "st",
  "minority",
] as const;

export type Category = (typeof CATEGORIES)[number];

export const CATEGORY_LABELS: Record<Category, string> = {
  general: "General",
  ews: "EWS",
  obc: "OBC",
  sc: "SC",
  st: "ST",
  minority: "Minority",
};

export const ALL_CATEGORIES: Category[] = [...CATEGORIES];

export const GENDERS = ["female", "male", "other"] as const;

export type Gender = (typeof GENDERS)[number];

export const GENDER_LABELS: Record<Gender, string> = {
  female: "Female",
  male: "Male",
  other: "Another identity",
};

export const INCOME_BRACKETS = [
  "below-1l",
  "1l-2.5l",
  "2.5l-5l",
  "5l-8l",
  "above-8l",
] as const;

export type IncomeBracket = (typeof INCOME_BRACKETS)[number];

export const INCOME_LABELS: Record<IncomeBracket, string> = {
  "below-1l": "Below ₹1,00,000",
  "1l-2.5l": "₹1,00,000 – ₹2,50,000",
  "2.5l-5l": "₹2,50,000 – ₹5,00,000",
  "5l-8l": "₹5,00,000 – ₹8,00,000",
  "above-8l": "Above ₹8,00,000",
};

/** Numeric range used by the match explanation. */
export const INCOME_RANGES: Record<
  IncomeBracket,
  { lower: number; upper: number }
> = {
  "below-1l": { lower: 0, upper: 100_000 },
  "1l-2.5l": { lower: 100_001, upper: 250_000 },
  "2.5l-5l": { lower: 250_001, upper: 500_000 },
  "5l-8l": { lower: 500_001, upper: 800_000 },
  "above-8l": { lower: 800_001, upper: 5_000_000 },
};

export const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chandigarh",
  "Chhattisgarh",
  "Delhi",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jammu & Kashmir",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Ladakh",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Puducherry",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
] as const;

export const PROVIDER_TYPES = ["National", "State", "Private"] as const;

export type ProviderType = (typeof PROVIDER_TYPES)[number];

export interface ScholarshipEligibility {
  maxIncome?: number;
  states?: string[];
  gender?: Gender;
  courses?: string[];
}

export interface Scholarship {
  id: string;
  name: string;
  provider: string;
  providerType: ProviderType;
  /** Amount in INR per year. */
  amount: number;
  /** ISO date (YYYY-MM-DD), computed at runtime from the sample offset. */
  deadline: string;
  level: EducationLevel[];
  category: Category[];
  eligibility: ScholarshipEligibility;
  documents: string[];
  steps: string[];
  summary: string;
  link: string;
}

export interface StudentProfile {
  level: EducationLevel;
  course: string;
  state: string;
  category: Category;
  income: IncomeBracket;
  gender?: Gender;
}

export const APPLICATION_STATUSES = [
  "saved",
  "preparing",
  "applied",
  "won",
  "waiting",
  "not-selected",
] as const;

export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

export const STATUS_LABELS: Record<ApplicationStatus, string> = {
  saved: "Saved",
  preparing: "Preparing",
  applied: "Applied",
  won: "Won",
  waiting: "Waiting for result",
  "not-selected": "Not selected",
};

export type StatusFilter = "saved" | "preparing" | "applied" | "result";

export const STATUS_BOARD: {
  key: StatusFilter;
  title: string;
  description: string;
  statuses: ApplicationStatus[];
}[] = [
  {
    key: "saved",
    title: "Saved",
    description: "Shortlisted, not started yet",
    statuses: ["saved"],
  },
  {
    key: "preparing",
    title: "Preparing",
    description: "Collecting documents and filling forms",
    statuses: ["preparing"],
  },
  {
    key: "applied",
    title: "Applied",
    description: "Submitted, waiting to hear back",
    statuses: ["applied"],
  },
  {
    key: "result",
    title: "Result",
    description: "Won, waiting, or not selected",
    statuses: ["won", "waiting", "not-selected"],
  },
];

export interface TrackerEntry {
  status: ApplicationStatus;
  updatedAt: string;
}

export type TrackerMap = Record<string, TrackerEntry>;

export const SORT_OPTIONS = [
  "best-match",
  "closing-soon",
  "highest-amount",
] as const;

export type SortOption = (typeof SORT_OPTIONS)[number];

export const SORT_LABELS: Record<SortOption, string> = {
  "best-match": "Best match",
  "closing-soon": "Closing soon",
  "highest-amount": "Highest amount",
};

export interface DiscoverFilters {
  search: string;
  minAmount: number;
  maxAmount: number;
  deadlineWindow: "any" | "7" | "21" | "30" | "60";
  category: Category | "all";
  level: EducationLevel | "all";
  providerType: ProviderType | "all";
  sort: SortOption;
}
