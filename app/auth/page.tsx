import { redirect } from "next/navigation";
import { requirePageUser } from "@/lib/authz";
import { getDefaultSection } from "@/lib/app-sections";
import { getServerLabels } from "@/lib/i18n";

const page = async () => {
  const currentUser = await requirePageUser();
  const labels = await getServerLabels();
  const defaultSection = getDefaultSection(currentUser.role);

  if (defaultSection) {
    redirect(defaultSection.href);
  }

  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-semibold">{labels.common.unavailable}</h1>
      <p className="text-muted-foreground">
        {labels.common.unavailable}
      </p>
    </div>
  );
};

export default page;
