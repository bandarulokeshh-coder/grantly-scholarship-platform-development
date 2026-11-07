import {
  CATEGORY_LABELS,
  GENDER_LABELS,
  INCOME_LABELS,
  INCOME_RANGES,
  LEVEL_LABELS,
} from "@/types";
import type { Scholarship, StudentProfile } from "@/types";
import { formatInr } from "@/lib/format";

export const CRITERION_WEIGHTS = {
  level: 25,
  category: 20,
  income: 20,
  state: 20,
  course: 10,
  gender: 5,
} as const;

export type CriterionKey = keyof typeof CRITERION_WEIGHTS;
export type CriterionStatus = "met" | "not-met" | "unknown";

export interface EligibilityCriterion {
  key: CriterionKey;
  label: string;
  /** What the scholarship asks for, in student-friendly words. */
  requirement: string;
  /** A short plain-language sentence for Simple mode. */
  simple: string;
  status: CriterionStatus;
  /** Why this status applies to the student's profile. */
  detail: string;
}

export interface MatchResult {
  /** null when no profile exists yet. */
  score: number | null;
  criteria: EligibilityCriterion[];
  reasons: string[];
  missing: string[];
  unknown: string[];
  metCount: number;
  evaluatedCount: number;
  summary: string;
  simpleSummary: string;
}

const NO_PROFILE_SUMMARY =
  "Complete your profile to see your match.";

function normalize(value: string): string {
  return value.toLowerCase().trim();
}

function courseMatches(profile: StudentProfile, scholarship: Scholarship): boolean {
  const keywords = scholarship.eligibility.courses?.map(normalize) ?? [];
  const course = normalize(profile.course);
  return keywords.some((keyword) => course.includes(keyword) || keyword.includes(course));
}

function criterion(
  key: CriterionKey,
  label: string,
  requirement: string,
  simple: string,
  status: CriterionStatus,
  detail: string,
): EligibilityCriterion {
  return { key, label, requirement, simple, status, detail };
}

/**
 * Pure, readable eligibility checker. Every scholarship criterion becomes one
 * of three states: met, not-met (missing) or unknown (profile has no info).
 */
export function evaluateCriteria(
  profile: StudentProfile | null,
  scholarship: Scholarship,
): EligibilityCriterion[] {
  const { eligibility } = scholarship;

  const levelCriterion = (() => {
    const requirement = scholarship.level
      .map((level) => LEVEL_LABELS[level])
      .join(" or ");
    if (!profile) {
      return criterion(
        "level",
        "Education level",
        requirement,
        "You are studying at the right level.",
        "unknown",
        "Add your education level to check this.",
      );
    }
    const met = scholarship.level.includes(profile.level);
    return criterion(
      "level",
      "Education level",
      requirement,
      met ? "Your study level is supported." : "This one is for a different study level.",
      met ? "met" : "not-met",
      `You selected ${LEVEL_LABELS[profile.level]}.`,
    );
  })();

  const categoryCriterion = (() => {
    const requirement = scholarship.category
      .map((category) => CATEGORY_LABELS[category])
      .join(", ");
    if (!profile) {
      return criterion(
        "category",
        "Community category",
        requirement,
        "Your community category is accepted.",
        "unknown",
        "Add your category to check this.",
      );
    }
    const met = scholarship.category.includes(profile.category);
    return criterion(
      "category",
      "Community category",
      requirement,
      met
        ? "Your community category is accepted."
        : "This scheme is reserved for other categories.",
      met ? "met" : "not-met",
      `You selected ${CATEGORY_LABELS[profile.category]}.`,
    );
  })();

  const incomeCriterion = (() => {
    const maxIncome = eligibility.maxIncome;
    if (!maxIncome) {
      return criterion(
        "income",
        "Family income",
        "No family income limit",
        "There is no family income limit here.",
        "met",
        "Everyone can apply regardless of income.",
      );
    }
    const requirement = `Family income up to ${formatInr(maxIncome)} per year`;
    if (!profile) {
      return criterion(
        "income",
        "Family income",
        requirement,
        "Your family income is within the limit.",
        "unknown",
        "Add your income bracket to check this.",
      );
    }
    const range = INCOME_RANGES[profile.income];
    if (range.upper <= maxIncome) {
      return criterion(
        "income",
        "Family income",
        requirement,
        "Your family income is within the limit.",
        "met",
        `Your bracket: ${INCOME_LABELS[profile.income]}.`,
      );
    }
    if (range.lower > maxIncome) {
      return criterion(
        "income",
        "Family income",
        requirement,
        "Your family income is above this scheme's limit.",
        "not-met",
        `Your bracket: ${INCOME_LABELS[profile.income]}, which is above the limit.`,
      );
    }
    return criterion(
      "income",
      "Family income",
      requirement,
      "Check your exact income against the limit.",
      "unknown",
      "Your bracket straddles the limit, so confirm the exact figure before applying.",
    );
  })();

  const stateCriterion = (() => {
    const states = eligibility.states;
    if (!states || states.length === 0) {
      return criterion(
        "state",
        "State",
        "Open to students from every state",
        "Students from any state can apply.",
        "met",
        "This is a national scheme.",
      );
    }
    const requirement = `Student from ${states.join(" or ")}`;
    if (!profile) {
      return criterion(
        "state",
        "State",
        requirement,
        "You live in a state this scheme covers.",
        "unknown",
        "Add your state to check this.",
      );
    }
    const met = states.includes(profile.state);
    return criterion(
      "state",
      "State",
      requirement,
      met ? "Your state is covered." : "This scheme is limited to other states.",
      met ? "met" : "not-met",
      `You selected ${profile.state}.`,
    );
  })();

  const courseCriterion = (() => {
    const courses = eligibility.courses;
    if (!courses || courses.length === 0) {
      return criterion(
        "course",
        "Course",
        "Any course is welcome",
        "Any course can apply.",
        "met",
        "There is no course restriction.",
      );
    }
    const requirement = `Studying ${courses.join(", ")}`;
    if (!profile || !profile.course) {
      return criterion(
        "course",
        "Course",
        requirement,
        "Your course is on the supported list.",
        "unknown",
        "Add your course to check this.",
      );
    }
    const met = courseMatches(profile, scholarship);
    return criterion(
      "course",
      "Course",
      requirement,
      met ? "Your course is on the supported list." : "Your course is not on the supported list.",
      met ? "met" : "not-met",
      `You are studying ${profile.course}.`,
    );
  })();

  const genderCriterion = (() => {
    const gender = eligibility.gender;
    if (!gender) {
      return criterion(
        "gender",
        "Gender",
        "Open to all genders",
        "All genders can apply.",
        "met",
        "There is no gender restriction.",
      );
    }
    const requirement = `Open to ${GENDER_LABELS[gender]} applicants`;
    if (!profile || !profile.gender) {
      return criterion(
        "gender",
        "Gender",
        requirement,
        "Your gender matches this scheme.",
        "unknown",
        "Add your gender to check this.",
      );
    }
    const met = profile.gender === gender;
    return criterion(
      "gender",
      "Gender",
      requirement,
      met ? "Your gender matches this scheme." : "This scheme is for another gender.",
      met ? "met" : "not-met",
      `You selected ${GENDER_LABELS[profile.gender]}.`,
    );
  })();

  return [
    levelCriterion,
    categoryCriterion,
    incomeCriterion,
    stateCriterion,
    courseCriterion,
    genderCriterion,
  ];
}

/**
 * Weighted match score (0–100) plus the reasons behind it.
 * Met criteria earn full weight, unknown criteria earn half weight.
 */
export function matchScore(
  profile: StudentProfile | null,
  scholarship: Scholarship,
): MatchResult {
  const criteria = evaluateCriteria(profile, scholarship);
  const met = criteria.filter((item) => item.status === "met");
  const missing = criteria.filter((item) => item.status === "not-met");
  const unknown = criteria.filter((item) => item.status === "unknown");

  const reasons = met.map((item) => item.label);
  const missingLabels = missing.map((item) => item.label);
  const unknownLabels = unknown.map((item) => item.label);

  if (!profile) {
    return {
      score: null,
      criteria,
      reasons: [],
      missing: missingLabels,
      unknown: unknownLabels,
      metCount: 0,
      evaluatedCount: criteria.length,
      summary: NO_PROFILE_SUMMARY,
      simpleSummary: NO_PROFILE_SUMMARY,
    };
  }

  const totalWeight = criteria.reduce(
    (sum, item) => sum + CRITERION_WEIGHTS[item.key],
    0,
  );
  const earned = criteria.reduce((sum, item) => {
    if (item.status === "met") {
      return sum + CRITERION_WEIGHTS[item.key];
    }
    if (item.status === "unknown") {
      return sum + CRITERION_WEIGHTS[item.key] / 2;
    }
    return sum;
  }, 0);

  const score = Math.max(0, Math.min(100, Math.round((earned / totalWeight) * 100)));

  const summaryParts = [
    `You meet ${met.length} of ${criteria.length} criteria.`,
  ];
  if (missingLabels.length > 0) {
    summaryParts.push(`Missing: ${missingLabels.join(", ")}.`);
  } else {
    summaryParts.push("Nothing is blocking you on paper.");
  }
  const summary = summaryParts.join(" ");

  const simpleParts = [`You match ${met.length} of ${criteria.length} checks.`];
  if (missingLabels.length > 0) {
    simpleParts.push(`Not matching: ${missingLabels.join(", ")}.`);
  }
  if (unknownLabels.length > 0) {
    simpleParts.push("Some checks need one more detail from your profile.");
  }

  return {
    score,
    criteria,
    reasons,
    missing: missingLabels,
    unknown: unknownLabels,
    metCount: met.length,
    evaluatedCount: criteria.length,
    summary,
    simpleSummary: simpleParts.join(" "),
  };
}

export function matchLabel(score: number | null): string {
  if (score === null) {
    return "Complete your profile to see your match";
  }
  if (score >= 85) {
    return "Strong match";
  }
  if (score >= 65) {
    return "Good match";
  }
  if (score >= 40) {
    return "Possible match";
  }
  return "Low match";
}
