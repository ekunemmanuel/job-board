<template>
  <UContainer class="space-y-4">
    <div class="flex flex-wrap gap-4 justify-between items-center">
      <div class="space-y-1">
        <h1 class="text-xl font-bold">Your Companies</h1>
        <p>Select a company to create a JOB for</p>
      </div>
      <UButton
        label="Create Company"
        color="gray"
        @click="isOpen = true"
        icon="material-symbols:add-rounded"
      />
    </div>
    <Suspense>
      <Company v-model="isOpen" />
      <template #fallback>
        <span>Loading...</span>
      </template>
    </Suspense>
  </UContainer>
</template>

<script lang="ts" setup>
const isOpen = ref(false);
</script>

<style></style>
