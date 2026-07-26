import { useQuery } from "@tanstack/react-query";
import { getMyProfile } from "@/api/users/users";

export const MY_PROFILE_QUERY_KEY = ["users", "me"] as const;

export const useMyProfile = (enabled: boolean) =>
  useQuery({
    queryKey: MY_PROFILE_QUERY_KEY,
    queryFn: getMyProfile,
    staleTime: 1000 * 60 * 5,
    enabled,
  });
