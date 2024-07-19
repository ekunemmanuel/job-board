export const useFirebase = () => {
  const firestore = useMyFirestore();

  const { deleteFile, downloadFile, uploadFile, moveFile } = useMyStorage();
  const auth = useMyAuth();
  return {
    ...firestore,
    deleteFile,
    downloadFile,
    uploadFile,
    moveFile,
    ...auth,
  };
};
