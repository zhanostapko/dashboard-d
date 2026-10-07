export const authMessages = {
  accessDenied: "Вашему аккаунту не разрешен доступ к этой панели.",
  authenticationRequired: "Требуется вход в систему.",
  forbidden: "Недостаточно прав для этого действия.",
  genericSignInError: "Во время входа произошла ошибка. Попробуйте снова.",
  clientApiDisabled:
    "Clients API is disabled. Use server actions for client management.",
  repairApiDisabled:
    "Repairs API is disabled. Use server actions for repair management.",
  userApiDisabled:
    "Users API is disabled. Use server actions for user management.",
};

export const getAuthErrorMessage = (error: string | null) => {
  if (error === "AccessDenied") {
    return authMessages.accessDenied;
  }

  return authMessages.genericSignInError;
};
