export type AppSectionRole = "ADMIN" | "USER";

export type AppSection = {
  id: "users" | "invoices" | "clients" | "vehicles" | "repairs" | "earnings";
  enabled: boolean;
  href: string;
  labelKey: "users" | "invoices" | "clients" | "vehicles" | "repairs" | "earnings";
  requiredRole?: AppSectionRole;
};

export const appSections: AppSection[] = [
  {
    id: "repairs",
    enabled: true,
    href: "/auth/repairs",
    labelKey: "repairs",
  },
  {
    id: "clients",
    enabled: true,
    href: "/auth/clients",
    labelKey: "clients",
  },
  {
    id: "vehicles",
    enabled: true,
    href: "/auth/vehicles",
    labelKey: "vehicles",
  },
  {
    id: "invoices",
    enabled: true,
    href: "/auth/invoices",
    labelKey: "invoices",
  },
  {
    id: "users",
    enabled: true,
    href: "/auth/users",
    labelKey: "users",
    requiredRole: "ADMIN",
  },
  {
    id: "earnings",
    enabled: true,
    href: "/auth/earnings",
    labelKey: "earnings",
    requiredRole: "ADMIN",
  },
];

export const canAccessSection = (
  section: AppSection,
  role: AppSectionRole
) => {
  if (!section.enabled) return false;
  if (!section.requiredRole) return true;

  return section.requiredRole === role;
};

export const getAvailableSections = (role: AppSectionRole) =>
  appSections.filter((section) => canAccessSection(section, role));

export const getDefaultSection = (role: AppSectionRole) =>
  getAvailableSections(role)[0] ?? null;
