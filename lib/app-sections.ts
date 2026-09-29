export type AppSectionRole = "ADMIN" | "USER";

export type AppSection = {
  id: "users" | "invoices" | "clients" | "repairs";
  enabled: boolean;
  href: string;
  labelKey: "users" | "invoices" | "clients" | "repairs";
  requiredRole?: AppSectionRole;
};

export const appSections: AppSection[] = [
  {
    id: "invoices",
    enabled: true,
    href: "/auth/invoices",
    labelKey: "invoices",
  },
  {
    id: "clients",
    enabled: true,
    href: "/auth/clients",
    labelKey: "clients",
  },
  {
    id: "users",
    enabled: true,
    href: "/auth/users",
    labelKey: "users",
    requiredRole: "ADMIN",
  },
  {
    id: "repairs",
    enabled: false,
    href: "/auth/repairs",
    labelKey: "repairs",
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
