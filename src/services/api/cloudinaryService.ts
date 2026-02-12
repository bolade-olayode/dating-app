// src/services/api/cloudinaryService.ts

import { ENV, devLog, errorLog } from '@config/environment';

const { CLOUD_NAME, UPLOAD_PRESET } = ENV.CLOUDINARY;
const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

/**
 * Upload a local image to Cloudinary using unsigned upload.
 * Returns the Cloudinary secure URL on success.
 */
export const uploadToCloudinary = async (localUri: string): Promise<string> => {
  devLog('☁️ Cloudinary: Uploading image...');

  // Build FormData — React Native's fetch handles file:// URIs natively
  const formData = new FormData();
  const filename = localUri.split('/').pop() || 'photo.jpg';
  const match = /\.(\w+)$/.exec(filename);
  const type = match ? `image/${match[1]}` : 'image/jpeg';

  formData.append('file', {
    uri: localUri,
    name: filename,
    type,
  } as any);
  formData.append('upload_preset', UPLOAD_PRESET);

  const response = await fetch(CLOUDINARY_URL, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    errorLog('Cloudinary upload failed:', response.status, errorText);
    throw new Error(`Cloudinary upload failed: ${response.status}`);
  }

  const data = await response.json();
  devLog('☁️ Cloudinary: Upload success →', data.secure_url);
  return data.secure_url;
};

export default { uploadToCloudinary };
