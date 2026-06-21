import { useQuery } from "@tanstack/react-query";
import AboutPageView from "@pages/About/AboutPageView";
import {
  fetchProfile,
  fetchWorkExperiences,
  fetchSideProjects,
  fetchTechStacks,
} from "@/api/about/about";

function AboutPage() {
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
    />
  );
}

export default AboutPage;
