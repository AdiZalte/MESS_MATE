import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET } from '../constants/config';

export const uploadImageToCloudinary = async (imageUri: string): Promise<string> => {
  const formData = new FormData();

  // React Native's fetch/FormData expects this specific object shape for files
  formData.append('file', {
    uri: imageUri,
    type: 'image/jpeg',
    name: 'upload.jpg',
  } as any);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
    { method: 'POST', body: formData }
  );

  const data = await response.json();

  if (!data.secure_url) {
    throw new Error('Image upload failed');
  }

  return data.secure_url; // this is the URL you'll save in coverImageUrl1/2/3
};