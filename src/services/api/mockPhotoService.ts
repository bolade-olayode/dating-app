// src/services/api/mockPhotoService.ts

export const MockPhotoService = {
  /**
   * Simulate uploading a photo to a server.
   * Returns a promise that resolves after a random delay.
   */
  uploadPhoto: async (localUri: string): Promise<{ url: string; id: string }> => {
    return new Promise((resolve, reject) => {
      // 1. Simulate Network Delay (1.0 - 2.5 seconds)
      const delay = Math.random() * 1500 + 1000;

      setTimeout(() => {
        // 2. Simulate Success (90% chance)
        const isSuccess = Math.random() > 0.1;

        if (isSuccess) {
          resolve({
            url: localUri, // In a real app, this would be the S3/Cloudinary URL
            id: Math.random().toString(36).substr(2, 9),
          });
        } else {
          // 3. Simulate Failure (10% chance - good for testing UI error states)
          reject(new Error('Upload failed due to network error.'));
        }
      }, delay);
    });
  },
};