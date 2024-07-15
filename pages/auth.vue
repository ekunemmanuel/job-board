<template>
  <div>
    <NuxtPage/>
  </div>
</template>

<script lang="ts" setup>

definePageMeta({
  middleware: "alread-logged-in",
  redirect: "/auth/login",
});
</script>

<style></style>
