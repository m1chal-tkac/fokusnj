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
  }
  if (code >= 400) {
    throw new Error(error);
  }
}
