<template>
  <div class="flex flex-col min-h-screen">
    <MyHeader class="w-full sticky z-10" />

    <div class="flex-1">
      <slot />
    </div>
    <footer>
      <UContainer>
        <p class="text-center">
          Built by <span class="font-bold text-primary">Pablo</span>
        </p>
      </UContainer>
    </footer>
  </div>
</template>

<script lang="ts" setup></script>

<style></style>
