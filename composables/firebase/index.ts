export const useFirebase = () => {
  const { getCollection, createDoc, getDoc, modifyDoc, removeDoc } =
    useMyFirestore();

  const { deleteFile, downloadFile, uploadFile, moveFile } = useMyStorage();

  return {
    getCollection,
    createDoc,
    getDoc,
    modifyDoc,
    removeDoc,
    deleteFile,
    downloadFile,
    uploadFile,
    moveFile,
  };
};
