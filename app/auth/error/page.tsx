// pages/auth/error.tsx
import { signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function AuthError() {
  const router = useRouter();
  const { error } = router.query;
  useEffect(() => {
    signOut({ callbackUrl: "/" }); // или на /login
  }, []);

  return (
    <div>
      <h1>Ошибка входа</h1>
      {error === "AccessDenied" ? (
        <p>У вас нет доступа. Обратитесь к администратору.</p>
      ) : (
        <p>Что-то пошло не так. Попробуйте снова.</p>
      )}
    </div>
  );
}
