export type TContactStatus =
  | "new"
  | "contacted"
  | "qualified"
  | "site-visit"
  | "proposal-sent"
  | "won"
  | "lost";

export type TContactSource =
  | "website"
  | "phone"
  | "referral"
  | "other";

export type TContactProjectType =
  | "residential"
  | "commercial"
  | "industrial"
  | "warehouse"
  | "factory"
  | "hospital"
  | "school"
  | "hotel"
  | "office"
  | "shopping-mall"
  | "sports-facility"
  | "other";

export type TContactProjectTimeline =
  | "immediate"
  | "within-1-month"
  | "1-3-months"
  | "3-6-months"
  | "6-plus-months"
  | "not-decided";

export type TContactAreaUnit = "sqft" | "sqm";

export interface IContactProjectLocation {
  address?: string;
  area?: string;
  city: string;
  country: string;
}

export interface IContact {
  _id: string;

  // Customer information
  fullName: string;
  phoneNumber: string;
  email: string;
  companyName?: string;
  jobTitle?: string;

  // Service requirement
  serviceId?: string | { _id: string; name: string };

  // Project information
  projectName?: string;
  projectType?: TContactProjectType;
  projectLocation?: IContactProjectLocation;
  projectAreaSize?: number;
  projectAreaUnit?: TContactAreaUnit;

  // Project requirements
  siteVisitRequired?: boolean;
  projectTimeline?: TContactProjectTimeline;
  message?: string;

  // Lead management
  status: TContactStatus;
  source: TContactSource;
  adminNotes?: string;

  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface IContactResponse {
  success: boolean;
  statusCode: number;
  message: string;
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  data: IContact[];
}

export interface IContactSingleResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: IContact;
}

export const CONTACT_STATUS_TRANSITIONS: Record<
  TContactStatus,
  readonly TContactStatus[]
> = {
  new: ["contacted"],
  contacted: ["qualified", "lost"],
  qualified: ["site-visit", "proposal-sent", "lost"],
  "site-visit": ["proposal-sent", "lost"],
  "proposal-sent": ["won", "lost"],
  won: [],
  lost: [],
} as const;

export const getAllowedContactStatusTransitions = (
  currentStatus: TContactStatus,
): readonly TContactStatus[] => {
  return CONTACT_STATUS_TRANSITIONS[currentStatus] ?? [];
};

export const isAllowedContactStatusTransition = (
  currentStatus: TContactStatus,
  nextStatus: TContactStatus,
): boolean => {
  return (getAllowedContactStatusTransitions(currentStatus) as readonly string[]).includes(nextStatus);
};

