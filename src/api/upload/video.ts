import axiosInstance from "@/api/axiosInstance";

export const uploadVideo = async (
  file: File,
  accessToken: string
): Promise<string> => {
  const formData = new FormData();
  formData.append("video", file);

  const res = await axiosInstance.post<{ url: string }>(
    "/upload/video",
    formData,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return res.data.url;
};
