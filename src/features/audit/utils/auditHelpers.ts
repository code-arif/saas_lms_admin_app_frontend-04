/** Simple typed union for Badge variants used in audit */
type AuditBadgeVariant = "default" | "secondary" | "outline";

/** Format a Date to YYYY-MM-DD string for the API */
export const formatDateParam = (date: Date | undefined): string | undefined => {
  if (!date) return undefined;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const eventCategoryColor = (category: string | null | undefined): string => {
  switch (category) {
    case "auth":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
    case "security":
      return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
    case "billing":
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
    case "content":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400";
    case "user":
      return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400";
    case "tenant":
      return "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400";
    case "notification":
      return "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400";
    case "integration":
      return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400";
    case "system":
      return "bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-400";
    case "ai":
      return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
  }
};

export const eventCategoryBg = (category: string | null | undefined): string => {
  switch (category) {
    case "auth":
      return "bg-blue-500/10";
    case "security":
      return "bg-red-500/10";
    case "billing":
      return "bg-green-500/10";
    case "content":
      return "bg-purple-500/10";
    case "user":
      return "bg-amber-500/10";
    case "tenant":
      return "bg-cyan-500/10";
    case "notification":
      return "bg-pink-500/10";
    case "integration":
      return "bg-indigo-500/10";
    case "system":
      return "bg-slate-500/10";
    case "ai":
      return "bg-emerald-500/10";
    default:
      return "bg-muted";
  }
};

export const eventIconComponent = (category: string | null | undefined): string => {
  switch (category) {
    case "auth": return "Fingerprint";
    case "security": return "ShieldAlert";
    case "billing": return "Activity";
    case "content": return "FileCode";
    case "user": return "User";
    case "tenant": return "Globe";
    case "notification": return "AlertTriangle";
    case "integration": return "Monitor";
    case "system": return "Activity";
    case "ai": return "Activity";
    default: return "Info";
  }
};

export const methodColor = (method: string | null | undefined): string => {
  switch ((method || "").toUpperCase()) {
    case "GET":
      return "text-green-600 dark:text-green-400";
    case "POST":
      return "text-blue-600 dark:text-blue-400";
    case "PUT":
    case "PATCH":
      return "text-amber-600 dark:text-amber-400";
    case "DELETE":
      return "text-red-600 dark:text-red-400";
    default:
      return "text-muted-foreground";
  }
};

export const userTypeVariant = (type: string | null): AuditBadgeVariant => {
  switch (type) {
    case "admin":
      return "default";
    case "tenant":
      return "secondary";
    case "instructor":
      return "outline";
    case "student":
      return "outline";
    default:
      return "outline";
  }
};

export const formatUserType = (type: string | null): string => {
  if (!type) return "N/A";
  return type.charAt(0).toUpperCase() + type.slice(1);
};

export const categoryLabels: Record<string, string> = {
  auth: "Authentication",
  security: "Security",
  billing: "Billing",
  content: "Content",
  user: "User Management",
  tenant: "Tenant",
  notification: "Notification",
  integration: "Integration",
  system: "System",
  ai: "AI Services",
};
