<template>
  <div>
    <AuthForm type="login" @login="login" :loading />
  </div>
</template>

<script lang="ts" setup>
import type { Form } from "~/types";
import { signInWithEmailAndPassword, type AuthError } from "firebase/auth";

const auth = useFirebaseAuth();
const notification = useNotification();
const loading = ref(false);
const route = useRoute();
const { redirect } = route.query;

async function login(data: Form) {
  try {
    loading.value = true;
    const { email, password } = data;
    if (!auth) return;
    const usercred = await signInWithEmailAndPassword(auth, email, password);
    const user = usercred.user;
    const idTokenResult = await user.getIdTokenResult();
    const role = idTokenResult.claims.role;
    
    if(redirect && typeof redirect === "string") {
      navigateTo(redirect);
      return;
    }
    navigateTo(role === "admin" ? "/admin" : "/");

    notification.success({
      title: "Login Success",
      message: "You have successfully logged in",
    });
  } catch (error) {
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
