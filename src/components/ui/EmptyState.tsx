import type { ReactNode } from "react";

export interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={[
        "surface-card flex flex-col items-center px-6 py-10 text-center sm:px-10",
        className ?? "",
      ].join(" ")}
    >
      {icon ? (
        <span
          aria-hidden="true"
          className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-primary-soft text-link"
        >
          {icon}
        </span>
      ) : null}
      <h3 className="text-lg font-bold">{title}</h3>
      <p className="mt-2 max-w-md text-sm text-ink-soft text-balance-pretty">
        {description}
      </p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
