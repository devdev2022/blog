import { useQuery, useMutation } from "@tanstack/react-query";
import { refreshAccessToken, serverLogout } from "@/api/auth/auth";

export const authSessionQueryOptions = {
  queryKey: ["auth", "session"],
  queryFn: refreshAccessToken,
  staleTime: 0,
  gcTime: 0,
  refetchOnWindowFocus: false,
  retry: false,
} as const;

export const useRefreshAccessToken = () => useQuery(authSessionQueryOptions);

export const useLogout = () =>
  useMutation({
    mutationFn: (accessToken: string) => serverLogout(accessToken),
  });
