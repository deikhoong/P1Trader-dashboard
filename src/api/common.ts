import axiosInstance from "./axios";

export const UploadFile = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  try {
    const response = await axiosInstance.post('/file-upload/assets', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'accept': '*/*',
      }
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

