<template>
  <UContainer>
    <Suspense>
      <JobDetails :id="jobId" who="admin" />
      <template #fallback> loading... </template>
    </Suspense>
  </UContainer>
</template>

<script lang="ts" setup>
const route = useRoute();
const { id } = route.params;
const jobId = id as string;
</script>

<style></style>
