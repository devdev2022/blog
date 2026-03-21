import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AboutPageView from "@pages/About/AboutPageView";
import {
  fetchProfile,
  fetchWorkExperiences,
  fetchSideProjects,
  fetchTechStacks,
  updateBio,
  uploadBioAvatar,
} from "@/api/about/about";
import { useAuth } from "@contexts/AuthContext";

function AboutPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: profile, isLoading: isProfileLoading } = useQuery({
    queryKey: ["about", "profile"],
    queryFn: fetchProfile,
  });

  const { data: workExperiences, isLoading: isWorkLoading } = useQuery({
    queryKey: ["about", "work-experiences"],
    queryFn: fetchWorkExperiences,
  });

  const { data: sideProjects, isLoading: isProjectsLoading } = useQuery({
    queryKey: ["about", "side-projects"],
    queryFn: fetchSideProjects,
  });

  const { data: techStacks, isLoading: isTechLoading } = useQuery({
    queryKey: ["about", "tech-stacks"],
    queryFn: fetchTechStacks,
  });

  const { mutateAsync: saveBio, isPending: isBioSaving } = useMutation({
    mutationFn: (bio: string) => updateBio(bio),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["about", "profile"] }),
  });

  const { mutateAsync: saveAvatar, isPending: isAvatarUploading } = useMutation(
    {
      mutationFn: (file: File) => uploadBioAvatar(file),
      onSuccess: () =>
        queryClient.invalidateQueries({ queryKey: ["about", "profile"] }),
    },
  );

  return (
    <AboutPageView
      profile={profile ?? null}
      workExperiences={workExperiences ?? []}
      sideProjects={sideProjects ?? []}
      techStacks={techStacks ?? []}
      isProfileLoading={isProfileLoading}
      isWorkLoading={isWorkLoading}
      isProjectsLoading={isProjectsLoading}
      isTechLoading={isTechLoading}
      isLoggedIn={!!user}
      onBioSave={saveBio}
      isBioSaving={isBioSaving}
      onAvatarUpload={saveAvatar}
      isAvatarUploading={isAvatarUploading}
    />
  );
}

export default AboutPage;
