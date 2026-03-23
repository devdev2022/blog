import axiosInstance from "@/api/axiosInstance";

export const uploadVideo = async (file: File, folder: "posts" | "profile" | "introduction" = "posts"): Promise<string> => {
  const formData = new FormData();
  formData.append("video", file);
  const res = await axiosInstance.post<{ url: string }>(`/upload/video?folder=${folder}`, formData);
  return res.data.url;
};
