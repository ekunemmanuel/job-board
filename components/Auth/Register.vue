<template>
  <div>
    <AuthForm type="register" @register="register" :loading />
  </div>
</template>

<script lang="ts" setup>
import type { Form, User } from "~/types";
import {
  createUserWithEmailAndPassword,
  type AuthError,
  updateProfile,
} from "firebase/auth";
import { collection, doc, setDoc } from "firebase/firestore";

const auth = useFirebaseAuth();
const db = useFirestore();
const notification = useNotification();
const loading = ref(false);

async function register(data: Form) {
  try {
    loading.value = true;
    const { email, password, firstname, lastname } = data;

    if (!auth) return;
    const usercred = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    const user = usercred.user;
    const idToken = await user.getIdToken();
    // const role = "admin";
    // await $fetch("/api/v1/roles", {
    //   method: "POST",
    //   body: {
    //     idToken,
    //     role,
    //   },
    // });
    const displayName = `${firstname?.toLowerCase()} ${lastname?.toLowerCase()}`;

    if (!user) return;

    await updateProfile(user, { displayName });

    const userRef = doc(collection(db, "users"), user.uid);
    const newUser: User = {
      email: email,
      uid: user.uid,
      name: displayName,
      // role,
      createdAt: new Date().toISOString(),
    };
    await setDoc(userRef, newUser);

    navigateTo("/auth/login");

    notification.success({
      title: "Register Success",
      message: "You have successfully registered",
    });
  } catch (error: any) {
    const authError = error as AuthError;
    notification.error({
      message: authError.message,
      title: "Authentication Error",
    });
    console.error(authError.code, authError.message);
  } finally {
    loading.value = false;
  }
}


</script>

<style></style>
