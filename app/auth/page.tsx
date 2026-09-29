import { redirect } from "next/navigation";
import { requirePageUser } from "@/lib/authz";
import { getDefaultSection } from "@/lib/app-sections";

const page = async () => {
  const currentUser = await requirePageUser();
  const defaultSection = getDefaultSection(currentUser.role);

  if (defaultSection) {
    redirect(defaultSection.href);
  }

  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-semibold">Разделы временно недоступны</h1>
      <p className="text-muted-foreground">
        Сейчас активен рефакторинг users/auth/shared. Остальные разделы будут
        включаться по одному.
      </p>
    </div>
  );
};

export default page;
