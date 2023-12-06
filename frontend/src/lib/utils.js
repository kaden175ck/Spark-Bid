import Compressor from "compressorjs";
import { supabase_client } from "./supabase-client";

export const compressImage = (file) => {
  return new Promise((resolve, reject) => {
    new Compressor(file, {
      quality: 0.6, // Compression quality, between 0 and 1
      convertSize: 0, // Convert all images to JPEGs if size is greater than this value in bytes
      success(result) {
        // Directly resolve the result which is a Blob object
        resolve(result);
      },
      error(err) {
        reject(err);
      },
    });
  });
};

export const getPublicUrl = (user_id, image_id) => {
  const {
    data: { publicUrl },
  } = supabase_client.storage
    .from("images")
    .getPublicUrl(`${user_id}/${image_id}.jpg`);
  return publicUrl;
};
