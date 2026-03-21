import api from "../axiosInstance";

export interface TechStackCategoryItem {
  id: string;
  name: string;
}

export interface TechStackItem {
  id: string;
  name: string;
  iconUrl: string | null;
  category: TechStackCategoryItem | null;
}

export interface ProfileResponse {
  username: string;
  bio_avatar: string | null;
  bio: string | null;
  role: string;
}

export interface WorkExperienceItem {
  id: string;
  company: string;
  position: string;
  description: string | null;
  startDate: string;
  endDate: string | null;
  isCurrent: boolean;
  techStacks: TechStackItem[];
}

export interface SideProjectItem {
  id: string;
  title: string;
  description: string | null;
  startDate: string;
  endDate: string | null;
  link: string | null;
  techStacks: TechStackItem[];
}

export async function updateBio(bio: string): Promise<void> {
  await api.patch("/about/profile/bio", { bio });
}

export async function uploadBioAvatar(file: File): Promise<{ bio_avatar: string }> {
  const formData = new FormData();
  formData.append("avatar", file);
  const res = await api.patch<{ bio_avatar: string }>("/about/profile/avatar", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

export async function fetchProfile(): Promise<ProfileResponse> {
  const res = await api.get<ProfileResponse>("/about/profile");
  return res.data;
}

export async function fetchWorkExperiences(): Promise<WorkExperienceItem[]> {
  const res = await api.get<WorkExperienceItem[]>("/about/work-experiences");
  return res.data;
}

export async function fetchSideProjects(): Promise<SideProjectItem[]> {
  const res = await api.get<SideProjectItem[]>("/about/side-projects");
  return res.data;
}

export async function fetchTechStacks(): Promise<TechStackItem[]> {
  const res = await api.get<TechStackItem[]>("/about/tech-stacks");
  return res.data;
}
