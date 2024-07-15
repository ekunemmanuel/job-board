<template>
  <div class="">
    <UContainer class="flex justify-between p-2">
      <NUxtlink class="uppercase"> Job Board </NUxtlink>

      <div class="flex gap-4">
        <UButton> Create Job </UButton>
        <UButton variant="outline" color="rose" class="duration-300">
          Log out
        </UButton>
      </div>
    </UContainer>

    <section>
      <UContainer
        class="flex justify-center w-full items-center flex-col gap-2 pt-10"
      >
        <h1 class="text-3xl font-bold">Find your dream job</h1>
        <p class="text-gray-500">Find your dream job</p>
        <UInput
          placeholder="Search for jobs"
          class="w-1/2"
          icon="material-symbols:search-rounded"
          iconPosition="right"
        />
      </UContainer>
    </section>
  </div>
</template>

<script lang="ts" setup>
useNotification();
</script>

<style></style>
