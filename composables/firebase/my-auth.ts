import { signOut } from "firebase/auth";
export const useMyAuth = () => {
  const auth = useFirebaseAuth();
  async function logOut() {
    try {
      await signOut(auth!);
    } catch (error) {
      throw error;
    }
  }
  return {
    logOut,
  };
};
