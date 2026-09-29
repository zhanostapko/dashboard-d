export type AppSectionRole = "ADMIN" | "USER";

export type AppSection = {
  id: "users" | "invoices" | "repairs";
  enabled: boolean;
  href: string;
  labelKey: "users" | "invoices" | "repairs";
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
