<template>
  <UModal v-model="loading" :prevent-close="loading">
    <div class="p-4">
      <slot>
        <p class="uppercase text-primary text-xl font-bold text-center">
          Loading <span class="animate-ping">...</span>
        </p>
      </slot>
      <slot name="display"></slot>
    </div>
  </UModal>
</template>

<script lang="ts" setup>
const loading = defineModel({
  default: false,
});
</script>

<style></style>
