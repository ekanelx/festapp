export type FestivalStatus = "draft" | "published" | "archived";
export type EditionStatus = "draft" | "published" | "archived";
export type EventStatus = "scheduled" | "updated" | "cancelled" | "finished";
export type ReviewStatus = "draft" | "in_review" | "ready" | "published";
export type AlertPriority = "low" | "medium" | "high" | "critical";
export type AlertStatus = "draft" | "published" | "expired";
export type AppRole = "admin" | "editor";
export type SourceKind = "manual" | "csv" | "excel" | "pdf" | "ai";

export type EventCard = {
  title: string;
  slug: string;
  startsAt: string;
  status: EventStatus;
  location: string;
  category: string;
  highlight?: string;
};

export type AlertItem = {
  title: string;
  priority: AlertPriority;
  message: string;
};

export type EditionScaffold = {
  festivalName: string;
  festivalSlug: string;
  editionName: string;
  editionSlug: string;
  now: EventCard[];
  today: EventCard[];
  upcoming: EventCard[];
  historical: EventCard[];
  alerts: AlertItem[];
};

