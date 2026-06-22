import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { signIn } from "../../api/SignIn";
import { userSignIn } from "./authSlice";
import {
  setClientGLCodes,
  setClientGLCodesMap,
  setSelectedClient,
} from "../../redux/globalSlice";
import { getGLCodesByClientId } from "../../api/user";
import { Alert, AlertDescription, Button, Input } from "../../components/ui";
import FormField from "../../components/forms/FormField";
import { consumeSessionExpiredMessage } from "../../utils/authSession";

/** SignIn form — same auth logic as before, TailAdmin styling. */
export default function SignIn() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const sessionMessage = consumeSessionExpiredMessage();
    if (sessionMessage) {
      setErrorMessage(sessionMessage);
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = data.get("email");
    const password = data.get("password");

    if (!email || !password) {
      setErrorMessage("Please enter valid username and password");
      return;
    }

    setErrorMessage("");
    setIsSubmitting(true);

    let res;
    try {
      res = await signIn({ id: email, password });
    } catch (error) {
      setErrorMessage(error.message || "Login failed. Please try again.");
      setIsSubmitting(false);
      return;
    }

    if (!res?.token) {
      setErrorMessage(res?.error || "Login failed. Please try again.");
      setIsSubmitting(false);
      return;
    }

    const { token: accessToken, role: userRole, clients, mappedUsers } = res;

    if (!clients?.length) {
      setErrorMessage(
        "No clients assigned to your account. Contact an administrator."
      );
      setIsSubmitting(false);
      return;
    }

    localStorage.setItem("authToken", accessToken);
    dispatch(
      userSignIn({
        accessToken,
        userRole,
        clients,
        userEmail: email,
        mappedUsers,
      })
    );
    const selectedClient = clients[0];
    dispatch(setSelectedClient(selectedClient));
    const glCodes = await getGLCodesByClientId(selectedClient.id);
    const glCodesMap = {};
    glCodes.map((glCodeObj) => {
      glCodesMap[glCodeObj.code] = glCodeObj.name;
    });
    dispatch(setClientGLCodesMap(glCodesMap));
    dispatch(setClientGLCodes(glCodes));
    navigate("/schedular-module");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {errorMessage ? (
        <Alert variant="destructive">
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      ) : null}

      <FormField label="Email Address" htmlFor="email" required>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          autoFocus
          required
        />
      </FormField>

      <FormField label="Password" htmlFor="password" required>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />
      </FormField>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Signing in..." : "Sign In"}
      </Button>

      <p className="pt-2 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} CapinAsia
      </p>
    </form>
  );
}
