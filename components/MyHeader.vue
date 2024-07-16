<template>
  <UContainer class="flex justify-between p-2 py-4">
    <NuxtLink to="/" class="uppercase">Job Board</NuxtLink>

    <div class="flex gap-2">
      <div class="flex gap-4">
        <UButton variant="outline" color="rose" class="duration-300">
          Log out
        </UButton>
        <UButton to="/dashboard"> Dashboard </UButton>
      </div>
      <ColorMode />
    </div>
  </UContainer>
</template>

<script lang="ts" setup></script>

<style></style>
