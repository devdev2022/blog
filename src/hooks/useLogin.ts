import { useCallback } from "react";
import { useAppDispatch } from "@/store/hooks";
import { closeLoginModal } from "@/store/modalSlice";
import { useAuth } from "@/contexts/AuthContext";

export function useLogin() {
  const dispatch = useAppDispatch();
  const { login } = useAuth();

  return useCallback(() => {
    dispatch(closeLoginModal());
    login();
  }, [dispatch, login]);
}
