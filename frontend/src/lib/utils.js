import Compressor from "compressorjs";

export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    new Compressor(file, {
      quality: 0.75, // Compression quality, between 0 and 1
      convertSize: 0, // Convert all images to JPEGs if size is greater than this value in bytes
      success(result) {
        const reader = new FileReader();
        reader.readAsDataURL(result);
        reader.onloadend = () => {
          resolve(reader.result);
        };
        reader.onerror = (error) => {
          reject(error);
        };
      },
      error(err) {
        reject(err);
      },
    });
  });
};
