export function handleResponse(code: number, error: string) {
  if (code === 401) {
    sessionStorage.setItem(
      "formMessage",
      JSON.stringify({
        message: "Musíte se znovu přihlásit",
        type: "error",
        formId: "login0",
      })
    );
    sessionStorage.setItem;
    window.location.href = "/login";
  } else if (error === "Vyžádejte si nový email") {
    sessionStorage.setItem(
      "formMessage",
      JSON.stringify({
        message: "Vyžádejte si nový email",
        type: "error",
        formId: "forgotPassword0",
      })
    );
    sessionStorage.setItem;
    window.location.href = "/forgot-password";
  }
  if (code >= 400) {
    throw new Error(error);
  }
}
