export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export const APPLICATION_STATUS = {
  DRAFT: "draft",
  SUBMITTED: "submitted",
  UNDER_REVIEW: "under_review",
  APPROVED: "approved",
  REJECTED: "rejected",
};

export const APPLICATION_TYPES = {
  INDIVIDUAL: "individual",
  BUSINESS: "business",
};

export const STATUS_COLORS = {
  draft: "bg-gray-100 text-gray-800",
  submitted: "bg-blue-100 text-blue-800",
  under_review: "bg-yellow-100 text-yellow-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
};

export const RISK_LEVELS = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
};

export const RISK_COLORS = {
  low: "bg-green-100 text-green-800",
  medium: "bg-yellow-100 text-yellow-800",
  high: "bg-red-100 text-red-800",
};
