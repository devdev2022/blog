import axiosInstance from "@/api/axiosInstance";

export const uploadVideo = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("video", file);
  const res = await axiosInstance.post<{ url: string }>("/upload/video", formData);
  return res.data.url;
};
