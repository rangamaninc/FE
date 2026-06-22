import { store } from "../redux/store";
import { userSignOut } from "../pages/SignIn/authSlice";

/**
 * Clears auth state and redirects to the login page.
 * Used when the API returns 401 (session expired, invalid token, etc.).
 */
export function clearSessionAndRedirect(message) {
  localStorage.removeItem("authToken");

  if (message) {
    sessionStorage.setItem("sessionExpiredMessage", message);
  }

  store.dispatch(userSignOut());

  const onLoginPage =
    window.location.pathname === "/" ||
    window.location.pathname === "/sign-in";

  if (!onLoginPage) {
    window.location.href = "/";
  }
}

export function consumeSessionExpiredMessage() {
  const message = sessionStorage.getItem("sessionExpiredMessage");
  if (message) {
    sessionStorage.removeItem("sessionExpiredMessage");
  }
  return message;
}
