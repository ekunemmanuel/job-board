<template>
  <div>
    <NuxtPage />
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  middleware: "auth",
});
useHead({
  title: "Dashboard - Job Board",
});
</script>

<style></style>
