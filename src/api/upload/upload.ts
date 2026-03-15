import axiosInstance from "@/api/axiosInstance";

export const uploadImage = async (
  file: File,
  accessToken: string
): Promise<string> => {
  const formData = new FormData();
  formData.append("image", file);

  const res = await axiosInstance.post<{ url: string }>(
    "/upload/image",
    formData,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return res.data.url;
};
