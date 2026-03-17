import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

function AuthCallbackPage() {
  const [searchParams] = useSearchParams();
  const { user, accessToken, isLoading } = useAuth();
  const navigate = useNavigate();

  const isPopup = !!window.opener;
  const isNewUser = searchParams.get("isNewUser") === "true";

  useEffect(() => {
    if (isLoading) return;

    if (isPopup) {
      if (user && accessToken) {
        window.opener.postMessage(
          { type: "AUTH_SUCCESS", user, accessToken, isNewUser },
          window.location.origin
        );
      } else {
        window.opener.postMessage({ type: "AUTH_ERROR" }, window.location.origin);
      }
      window.close();
      return;
    }

    // 팝업이 아닌 경우 fallback
    navigate("/", { replace: true });
  }, [isLoading, user, accessToken, isPopup, isNewUser, navigate]);

  return null;
}

export default AuthCallbackPage;
