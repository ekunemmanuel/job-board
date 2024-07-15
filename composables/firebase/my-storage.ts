import {
  ref as storageRef,
  deleteObject,
  StorageError,
  type FullMetadata,
  getDownloadURL,
  uploadBytes,
} from "firebase/storage";

import { useFirebaseStorage, useStorageFile } from "vuefire";
import { type ShallowRef } from "vue";

export const useMyStorage = () => {
  const storage = useFirebaseStorage();

  /**
   * Uploads a file to Firebase Storage and monitors the progress.
   *
   * @param {string} path - The path in Firebase Storage where the file should be uploaded.
   * @param {File | Blob} file - The file to upload.
   * @returns { Promise<{ url: globalThis.Ref<string | null | undefined>, uploadProgress:globalThis.ComputedRef<number | null>, uploadError:  ShallowRef<StorageError | null | undefined>, metadata: ShallowRef<FullMetadata | null | undefined>}>} An object containing the file URL, upload progress, and any upload error.
   * @example
   * const { uploadFile, uploadProgress, uploadError, fileUrl } = useMyStorage();
   * uploadFile('images/myImage.jpg', file)
   *   .then(() => console.log('File available at', fileUrl.value))
   *   .catch(error => console.error('Upload failed', uploadError.value));
   */
  const uploadFile = async (
    path: string,
    file: File | Blob
  ): Promise<{
    url: globalThis.Ref<string | null | undefined>;
    uploadProgress: globalThis.ComputedRef<number | null>;
    uploadError: ShallowRef<StorageError | null | undefined>;
    metadata: ShallowRef<FullMetadata | null | undefined>;
  }> => {
    try {
      const fileRef = storageRef(storage, path);
      const { url, uploadProgress, uploadError, upload, metadata, refresh } =
        useStorageFile(fileRef);
      await upload(file);
      await refresh();
      // // console.log(data[0]);
      // console.log(url.value);

      return { url, uploadProgress, uploadError, metadata };
    } catch (error) {
      throw error;
    }
  };

  /**
   * Downloads a file from Firebase Storage.
   *
   * @param {string} path - The path in Firebase Storage where the file is located.
   * @returns {globalThis.Ref<string | null | undefined>} A promise that resolves with the download URL of the file.
   * @example
   * downloadFile('images/myImage.jpg')
   *   .then(url => console.log('File available at', url))
   *   .catch(error => console.error('Download failed', error));
   */
  const downloadFile = (
    path: string
  ): globalThis.Ref<string | null | undefined> => {
    try {
      const fileRef = storageRef(storage, path);
      const { url, metadata } = useStorageFile(fileRef);
      return url;
    } catch (error) {
      console.error("Error downloading file:", error);
      throw error;
    }
  };

  /**
   * Deletes a file from Firebase Storage.
   *
   * @param {string} path - The path in Firebase Storage where the file is located.
   * @returns {Promise<void>} A promise that resolves when the file has been successfully deleted.
   * @example
   * deleteFile('images/myImage.jpg')
   *   .then(() => console.log('File deleted successfully'))
   *   .catch(error => console.error('Deletion failed', error));
   */
  const deleteFile = async (path: string): Promise<void> => {
    try {
      const fileRef = storageRef(storage, path);
      await deleteObject(fileRef);
    } catch (error) {
      console.error("Error deleting file:", error);
      throw error;
    }
  };

  /**
   * Moves a file in Firebase Storage from one path to another.
   *
   * @param {string} originalPath - The original path of the file.
   * @param {string} newPath - The new path to move the file to.
   * @returns {Promise<void>} A promise that resolves when the file has been successfully moved.
   * @example
   * moveFile('images/oldImage.jpg', 'images/newImage.jpg')
   *   .then(() => console.log('File moved successfully'))
   *   .catch(error => console.error('Move failed', error));
   */
  const moveFile = async (
    originalPath: string,
    newPath: string
  ): Promise<void> => {
    try {
      const originalFileRef = storageRef(storage, originalPath);
      const newFileRef = storageRef(storage, newPath);

      // Step 1: Download the file from the original path
      const downloadURL = await getDownloadURL(originalFileRef);
      const response = await fetch(downloadURL);
      const fileBlob = await response.blob();

      // Step 2: Upload the file to the new path
      await uploadBytes(newFileRef, fileBlob);

      // // Step 3: Delete the original file
      // await deleteObject(originalFileRef);

      console.log(
        `File moved from ${originalPath} to ${newPath} successfully.`
      );
    } catch (error) {
      console.error("Error moving file:", error);
      throw error;
    }
  };

  return {
    uploadFile,
    downloadFile,
    deleteFile,
    moveFile,
  };
};

// import { ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

// export const useMyStorage = () => {
//   const storage = useFirebaseStorage();

//   /**
//    * Uploads a file to Firebase Storage.
//    *
//    * @param {string} path - The path in Firebase Storage where the file should be uploaded.
//    * @param {File | Blob} file - The file to upload.
//    * @returns {Promise<string>} A promise that resolves with the download URL of the uploaded file.
//    * @example
//    * uploadFile('images/myImage.jpg', file)
//    *   .then(url => console.log('File available at', url))
//    *   .catch(error => console.error('Upload failed', error));
//    */
//   async function uploadFile(path: string, file: File | Blob): Promise<string> {
//     try {
//       const fileRef = storageRef(storage, path);
//       await uploadBytes(fileRef, file);
//       const downloadURL = await getDownloadURL(fileRef);
//       return downloadURL;
//     } catch (error) {
//       console.error("Error uploading file:", error);
//       throw error;
//     }
//   }

//   /**
//    * Downloads a file from Firebase Storage.
//    *
//    * @param {string} path - The path in Firebase Storage where the file is located.
//    * @returns {Promise<string>} A promise that resolves with the download URL of the file.
//    * @example
//    * downloadFile('images/myImage.jpg')
//    *   .then(url => console.log('File available at', url))
//    *   .catch(error => console.error('Download failed', error));
//    */
//   async function downloadFile(path: string): Promise<string> {
//     try {
//       const fileRef = storageRef(storage, path);
//       const downloadURL = await getDownloadURL(fileRef);
//       return downloadURL;
//     } catch (error) {
//       console.error("Error downloading file:", error);
//       throw error;
//     }
//   }

//   /**
//    * Deletes a file from Firebase Storage.
//    *
//    * @param {string} path - The path in Firebase Storage where the file is located.
//    * @returns {Promise<void>} A promise that resolves when the file has been successfully deleted.
//    * @example
//    * deleteFile('images/myImage.jpg')
//    *   .then(() => console.log('File deleted successfully'))
//    *   .catch(error => console.error('Deletion failed', error));
//    */
//   async function deleteFile(path: string): Promise<void> {
//     try {
//       const fileRef = storageRef(storage, path);
//       await deleteObject(fileRef);
//     } catch (error) {
//       console.error("Error deleting file:", error);
//       throw error;
//     }
//   }

//   /**
//    * Uploads multiple files to Firebase Storage.
//    *
//    * @param {Array<{ path: string; file: File | Blob }>} files - An array of objects containing the file paths and files to upload.
//    * @returns {Promise<string[]>} A promise that resolves with an array of download URLs of the uploaded files.
//    * @example
//    * uploadMultipleFiles([
//    *   { path: 'images/file1.jpg', file: file1 },
//    *   { path: 'images/file2.jpg', file: file2 }
//    * ]).then(urls => console.log('Files available at', urls))
//    *   .catch(error => console.error('Upload failed', error));
//    */
//   async function uploadMultipleFiles(
//     files: Array<{ path: string; file: File | Blob }>
//   ): Promise<string[]> {
//     try {
//       const uploadPromises = files.map(({ path, file }) => uploadFile(path, file));
//       return await Promise.all(uploadPromises);
//     } catch (error) {
//       console.error("Error uploading multiple files:", error);
//       throw error;
//     }
//   }

//   /**
//    * Deletes multiple files from Firebase Storage.
//    *
//    * @param {string[]} paths - An array of paths in Firebase Storage where the files are located.
//    * @returns {Promise<void[]>} A promise that resolves when all files have been successfully deleted.
//    * @example
//    * deleteMultipleFiles(['images/file1.jpg', 'images/file2.jpg'])
//    *   .then(() => console.log('Files deleted successfully'))
//    *   .catch(error => console.error('Deletion failed', error));
//    */
//   async function deleteMultipleFiles(paths: string[]): Promise<void[]> {
//     try {
//       const deletePromises = paths.map(path => deleteFile(path));
//       return await Promise.all(deletePromises);
//     } catch (error) {
//       console.error("Error deleting multiple files:", error);
//       throw error;
//     }
//   }

//   return {
//     uploadFile,
//     downloadFile,
//     deleteFile,
//     uploadMultipleFiles,
//     deleteMultipleFiles,
//   };
// };
