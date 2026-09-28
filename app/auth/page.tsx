import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/authz";

const page = async () => {
  const currentUser = await getCurrentUser();

  if (currentUser?.role === "ADMIN") {
    redirect("/auth/users");
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
