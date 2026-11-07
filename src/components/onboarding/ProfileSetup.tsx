"use client";

import Link from "next/link";
import { useState } from "react";
import type { FormEvent } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Pencil,
  ShieldCheck,
  Sparkles,
  Trash2,
} from "lucide-react";

import { useGrantly } from "@/components/providers/GrantlyProvider";
import { Badge } from "@/components/ui/Badge";
import { Button, buttonClasses } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { COURSE_SUGGESTIONS } from "@/lib/courses";
import { cn } from "@/lib/cn";
import { sanitizeText, studentProfileSchema } from "@/lib/schemas";
import {
  CATEGORIES,
  CATEGORY_LABELS,
  EDUCATION_LEVELS,
  GENDERS,
  GENDER_LABELS,
  INCOME_BRACKETS,
  INCOME_LABELS,
  INDIAN_STATES,
  LEVEL_LABELS,
} from "@/types";
import type {
  Category,
  EducationLevel,
  Gender,
  IncomeBracket,
} from "@/types";

interface FormValues {
  level: EducationLevel | "";
  course: string;
  state: string;
  category: Category | "";
  income: IncomeBracket | "";
  gender: Gender | "";
}

const EMPTY_VALUES: FormValues = {
  level: "",
  course: "",
  state: "",
  category: "",
  income: "",
  gender: "",
};

const STEPS = [
  {
    title: "Where are you studying?",
    hint: "We use this to show schemes for your current stage.",
  },
  {
    title: "Which state are you from?",
    hint: "State schemes depend on your domicile.",
  },
  {
    title: "Which community do you belong to?",
    hint: "Reserved-category schemes need the certificate you already hold.",
  },
  {
    title: "What is your family's yearly income?",
    hint: "Most schemes use income limits to decide eligibility.",
  },
] as const;

const controlClass =
  "min-h-11 w-full rounded-xl border border-line bg-surface px-3 py-2 text-sm text-ink transition-colors hover:border-primary/50 focus-ring";

function optionClass(selected: boolean): string {
  return cn(
    "flex min-h-11 cursor-pointer items-center gap-3 rounded-xl border px-3 py-2.5 text-sm font-semibold transition-colors",
    selected
      ? "border-primary bg-primary-soft text-link"
      : "border-line bg-surface text-ink-soft hover:bg-surface-muted hover:text-ink",
  );
}

function validateStep(step: number, values: FormValues): Record<string, string> {
  const errors: Record<string, string> = {};

  if (step === 0) {
    if (!values.level) {
      errors.level = "Choose your education level so we can match the right schemes.";
    }
    if (values.course.trim().length > 60) {
      errors.course = "Keep your course name under 60 characters.";
    }
  }
  if (step === 1 && !values.state) {
    errors.state = "Choose the state you are a resident of.";
  }
  if (step === 2 && !values.category) {
    errors.category = "Choose the category printed on your certificate.";
  }
  if (step === 3 && !values.income) {
    errors.income = "Choose the bracket closest to your family's yearly income.";
  }

  return errors;
}

export function ProfileSetup() {
  const { ready, profile, saveProfile, clearProfile } = useGrantly();
  const [values, setValues] = useState<FormValues>(EMPTY_VALUES);
  const [stepIndex, setStepIndex] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [editing, setEditing] = useState(false);
  const [skipped, setSkipped] = useState(false);
  const [announcement, setAnnouncement] = useState("");

  const startEditing = (): void => {
    if (!profile) {
      return;
    }
    setValues({
      level: profile.level,
      course: profile.course,
      state: profile.state,
      category: profile.category,
      income: profile.income,
      gender: profile.gender ?? "",
    });
    setStepIndex(0);
    setErrors({});
    setEditing(true);
  };

  const resetForm = (): void => {
    setValues(EMPTY_VALUES);
    setStepIndex(0);
    setErrors({});
    setSkipped(false);
    setEditing(false);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    const stepErrors = validateStep(stepIndex, values);
    setErrors(stepErrors);
    if (Object.keys(stepErrors).length > 0) {
      return;
    }

    if (stepIndex < STEPS.length - 1) {
      setStepIndex(stepIndex + 1);
      setAnnouncement(`Step ${stepIndex + 2} of ${STEPS.length}: ${STEPS[stepIndex + 1].title}`);
      return;
    }

    const candidate = {
      level: values.level,
      course: sanitizeText(values.course, 60),
      state: values.state,
      category: values.category,
      income: values.income,
      ...(values.gender ? { gender: values.gender } : {}),
    };

    const parsed = studentProfileSchema.safeParse(candidate);
    if (!parsed.success) {
      setErrors({ form: "Something is not right yet. Check each step and try again." });
      return;
    }

    saveProfile(parsed.data);
    setAnnouncement("Profile saved. Your match scores are ready.");
    resetForm();
  };

  if (!ready) {
    return (
      <section
        aria-labelledby="profile-loading-heading"
        className="surface-card p-6 sm:p-8"
      >
        <h2 id="profile-loading-heading" className="text-xl font-bold">
          Your profile
        </h2>
        <p className="mt-1 text-sm text-ink-soft">
          Checking this browser for a saved profile…
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
        <Skeleton className="mt-6 h-11 w-40 rounded-full" />
      </section>
    );
  }

  if (profile && !editing) {
    return (
      <section
        aria-labelledby="profile-summary-heading"
        className="surface-card p-6 sm:p-8"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-ink-faint">
              Your profile
            </p>
            <h2 id="profile-summary-heading" className="mt-1 text-xl font-bold sm:text-2xl">
              Matches are switched on
            </h2>
          </div>
          <Badge tone="success" icon={<Check size={13} />}>
            Profile saved
          </Badge>
        </div>

        <p className="mt-2 text-sm text-ink-soft">
          Grantly now explains why each scholarship fits you. You can change any
          detail later.
        </p>

        <dl className="mt-5 grid gap-x-6 gap-y-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-bold uppercase tracking-wide text-ink-faint">
              Studying
            </dt>
            <dd className="mt-0.5 text-sm font-semibold">{LEVEL_LABELS[profile.level]}</dd>
          </div>
          <div>
            <dt className="text-xs font-bold uppercase tracking-wide text-ink-faint">
              Course
            </dt>
            <dd className="mt-0.5 text-sm font-semibold">
              {profile.course || "Not added"}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-bold uppercase tracking-wide text-ink-faint">
              State
            </dt>
            <dd className="mt-0.5 text-sm font-semibold">{profile.state}</dd>
          </div>
          <div>
            <dt className="text-xs font-bold uppercase tracking-wide text-ink-faint">
              Category
            </dt>
            <dd className="mt-0.5 text-sm font-semibold">
              {CATEGORY_LABELS[profile.category]}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-bold uppercase tracking-wide text-ink-faint">
              Family income
            </dt>
            <dd className="mt-0.5 text-sm font-semibold">
              {INCOME_LABELS[profile.income]}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-bold uppercase tracking-wide text-ink-faint">
              Gender
            </dt>
            <dd className="mt-0.5 text-sm font-semibold">
              {profile.gender ? GENDER_LABELS[profile.gender] : "Prefer not to say"}
            </dd>
          </div>
        </dl>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/discover" className={buttonClasses("primary", "md")}>
            See my matches
            <ArrowRight aria-hidden="true" size={17} />
          </Link>
          <button
            type="button"
            onClick={startEditing}
            className={buttonClasses("secondary", "md")}
          >
            <Pencil aria-hidden="true" size={16} />
            Edit profile
          </button>
          <button
            type="button"
            onClick={() => {
              clearProfile();
              resetForm();
              setAnnouncement("Profile cleared. You can still browse all scholarships.");
            }}
            className={buttonClasses("ghost", "md")}
          >
            <Trash2 aria-hidden="true" size={16} />
            Clear
          </button>
        </div>

        <p className="mt-4 flex items-start gap-2 text-xs text-ink-faint">
          <ShieldCheck aria-hidden="true" size={14} className="mt-0.5 shrink-0" />
          Your answers stay in this browser only. Grantly has no account and no
          server copy.
        </p>
        <p aria-live="polite" className="sr-only">
          {announcement}
        </p>
      </section>
    );
  }

  if (skipped) {
    return (
      <section
        aria-labelledby="profile-skip-heading"
        className="surface-card p-6 sm:p-8"
      >
        <h2 id="profile-skip-heading" className="text-xl font-bold">
          Browsing without a profile
        </h2>
        <p className="mt-2 max-w-xl text-sm text-ink-soft">
          You can explore every scholarship now. Match scores stay locked until
          you add four quick details — it takes about a minute.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link href="/discover" className={buttonClasses("primary", "md")}>
            Browse scholarships
          </Link>
          <Button variant="secondary" onClick={() => setSkipped(false)}>
            <Sparkles aria-hidden="true" size={16} />
            Add my details
          </Button>
        </div>
      </section>
    );
  }

  const currentStep = STEPS[stepIndex];
  const stepNumber = stepIndex + 1;

  return (
    <section
      aria-labelledby="profile-form-heading"
      className="surface-card p-5 sm:p-8"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-ink-faint">
            Step {stepNumber} of {STEPS.length}
          </p>
          <h2 id="profile-form-heading" className="mt-1 text-xl font-bold sm:text-2xl">
            {editing ? "Update your profile" : "Build your profile once"}
          </h2>
          <p className="mt-1 text-sm text-ink-soft">
            Four short questions. Everything stays on this device.
          </p>
        </div>
        {editing ? (
          <Button variant="ghost" size="sm" onClick={resetForm}>
            Cancel
          </Button>
        ) : null}
      </div>

      <ol className="mt-5 flex items-center gap-1.5" aria-label="Profile progress">
        {STEPS.map((step, index) => {
          const isDone = index < stepIndex;
          const isCurrent = index === stepIndex;
          return (
            <li key={step.title} className="flex-1">
              <button
                type="button"
                onClick={() => {
                  if (index < stepIndex) {
                    setStepIndex(index);
                    setErrors({});
                  }
                }}
                disabled={index > stepIndex}
                aria-current={isCurrent ? "step" : undefined}
                aria-label={`Step ${index + 1}: ${step.title}`}
                className={cn(
                  "focus-ring flex h-11 w-full items-center rounded-lg",
                  index > stepIndex && "cursor-not-allowed",
                )}
              >
                <span
                  className={cn(
                    "block h-2.5 w-full rounded-full",
                    isDone || isCurrent ? "bg-primary" : "bg-surface-muted",
                  )}
                />
              </button>
            </li>
          );
        })}
      </ol>

      <form onSubmit={handleSubmit} noValidate className="mt-6">
        <fieldset>
          <legend className="text-base font-bold sm:text-lg">
            {currentStep.title}
          </legend>
          <p className="mt-1 text-sm text-ink-soft">{currentStep.hint}</p>

          <div className="mt-4 space-y-4">
            {stepIndex === 0 ? (
              <>
                <div>
                  <p className="mb-2 text-sm font-semibold">Education level</p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {EDUCATION_LEVELS.map((level) => (
                      <label key={level} className={optionClass(values.level === level)}>
                        <input
                          type="radio"
                          name="level"
                          value={level}
                          checked={values.level === level}
                          onChange={() => {
                            setValues((prev) => ({ ...prev, level }));
                            setErrors({});
                          }}
                          aria-describedby={errors.level ? "level-error" : undefined}
                          className="size-4 accent-[var(--primary)]"
                        />
                        {LEVEL_LABELS[level]}
                      </label>
                    ))}
                  </div>
                  {errors.level ? (
                    <p id="level-error" role="alert" className="mt-2 text-sm font-semibold text-danger">
                      {errors.level}
                    </p>
                  ) : null}
                </div>

                <div>
                  <label htmlFor="course" className="mb-1.5 block text-sm font-semibold">
                    Course or class <span className="font-normal text-ink-faint">(optional)</span>
                  </label>
                  <input
                    id="course"
                    name="course"
                    type="text"
                    list="course-suggestions"
                    maxLength={80}
                    autoComplete="off"
                    value={values.course}
                    onChange={(event) =>
                      setValues((prev) => ({
                        ...prev,
                        course: event.target.value,
                      }))
                    }
                    aria-describedby={errors.course ? "course-error" : "course-hint"}
                    aria-invalid={Boolean(errors.course)}
                    placeholder="e.g. Engineering (B.Tech)"
                    className={controlClass}
                  />
                  <datalist id="course-suggestions">
                    {COURSE_SUGGESTIONS.map((course) => (
                      <option key={course} value={course} />
                    ))}
                  </datalist>
                  <p id="course-hint" className="mt-1 text-xs text-ink-faint">
                    Course helps us spot subject-specific schemes. Max 60 characters saved.
                  </p>
                  {errors.course ? (
                    <p id="course-error" role="alert" className="mt-1 text-sm font-semibold text-danger">
                      {errors.course}
                    </p>
                  ) : null}
                </div>
              </>
            ) : null}

            {stepIndex === 1 ? (
              <div>
                <label htmlFor="state" className="mb-1.5 block text-sm font-semibold">
                  State of residence
                </label>
                <select
                  id="state"
                  name="state"
                  value={values.state}
                  onChange={(event) => {
                    setValues((prev) => ({ ...prev, state: event.target.value }));
                    setErrors({});
                  }}
                  aria-invalid={Boolean(errors.state)}
                  aria-describedby={errors.state ? "state-error" : undefined}
                  className={controlClass}
                >
                  <option value="">Select your state</option>
                  {INDIAN_STATES.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
                {errors.state ? (
                  <p id="state-error" role="alert" className="mt-2 text-sm font-semibold text-danger">
                    {errors.state}
                  </p>
                ) : null}
              </div>
            ) : null}

            {stepIndex === 2 ? (
              <div>
                <p className="mb-2 text-sm font-semibold">Community category</p>
                <div className="grid gap-2 sm:grid-cols-3">
                  {CATEGORIES.map((category) => (
                    <label
                      key={category}
                      className={optionClass(values.category === category)}
                    >
                      <input
                        type="radio"
                        name="category"
                        value={category}
                        checked={values.category === category}
                        onChange={() => {
                          setValues((prev) => ({ ...prev, category }));
                          setErrors({});
                        }}
                        aria-describedby={errors.category ? "category-error" : undefined}
                        className="size-4 accent-[var(--primary)]"
                      />
                      {CATEGORY_LABELS[category]}
                    </label>
                  ))}
                </div>
                {errors.category ? (
                  <p id="category-error" role="alert" className="mt-2 text-sm font-semibold text-danger">
                    {errors.category}
                  </p>
                ) : null}
              </div>
            ) : null}

            {stepIndex === 3 ? (
              <>
                <div>
                  <label htmlFor="income" className="mb-1.5 block text-sm font-semibold">
                    Annual family income
                  </label>
                  <select
                    id="income"
                    name="income"
                    value={values.income}
                    onChange={(event) => {
                      setValues((prev) => ({
                        ...prev,
                        income: event.target.value as IncomeBracket | "",
                      }));
                      setErrors({});
                    }}
                    aria-invalid={Boolean(errors.income)}
                    aria-describedby={errors.income ? "income-error" : "income-hint"}
                    className={controlClass}
                  >
                    <option value="">Select a bracket</option>
                    {INCOME_BRACKETS.map((bracket) => (
                      <option key={bracket} value={bracket}>
                        {INCOME_LABELS[bracket]}
                      </option>
                    ))}
                  </select>
                  <p id="income-hint" className="mt-1 text-xs text-ink-faint">
                    An approximate bracket is enough. You can refine it later.
                  </p>
                  {errors.income ? (
                    <p id="income-error" role="alert" className="mt-1 text-sm font-semibold text-danger">
                      {errors.income}
                    </p>
                  ) : null}
                </div>

                <div>
                  <p className="mb-2 text-sm font-semibold">
                    Gender <span className="font-normal text-ink-faint">(optional)</span>
                  </p>
                  <div className="grid gap-2 sm:grid-cols-3">
                    {GENDERS.map((gender) => (
                      <label key={gender} className={optionClass(values.gender === gender)}>
                        <input
                          type="radio"
                          name="gender"
                          value={gender}
                          checked={values.gender === gender}
                          onChange={() => {
                            setValues((prev) => ({
                              ...prev,
                              gender: prev.gender === gender ? "" : gender,
                            }));
                          }}
                          className="size-4 accent-[var(--primary)]"
                        />
                        {GENDER_LABELS[gender]}
                      </label>
                    ))}
                  </div>
                  <p className="mt-1 text-xs text-ink-faint">
                    Some scholarships are reserved for girls. Tap again to clear.
                  </p>
                </div>
              </>
            ) : null}
          </div>
        </fieldset>

        {errors.form ? (
          <p role="alert" className="mt-4 text-sm font-semibold text-danger">
            {errors.form}
          </p>
        ) : null}

        <p aria-live="polite" className="sr-only">
          {announcement}
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          {stepIndex > 0 ? (
            <Button
              variant="secondary"
              onClick={() => {
                setStepIndex((current) => Math.max(0, current - 1));
                setErrors({});
              }}
            >
              <ArrowLeft aria-hidden="true" size={16} />
              Back
            </Button>
          ) : null}
          <Button type="submit">
            {stepIndex === STEPS.length - 1 ? "Save my profile" : "Continue"}
            <ArrowRight aria-hidden="true" size={16} />
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              setSkipped(true);
              setAnnouncement("Profile setup skipped. You can browse without a profile.");
            }}
          >
            Skip for now
          </Button>
        </div>
      </form>
    </section>
  );
}
