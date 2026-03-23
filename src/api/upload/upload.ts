import axiosInstance from "@/api/axiosInstance";

export const uploadImage = async (file: File, folder: "posts" | "profile" | "introduction" = "posts"): Promise<string> => {
  const formData = new FormData();
  formData.append("image", file);
  const res = await axiosInstance.post<{ url: string }>(`/upload/image?folder=${folder}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data.url;
};
