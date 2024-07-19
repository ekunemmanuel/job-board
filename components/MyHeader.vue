<template>
  <UContainer class="flex justify-between p-2 items-center py-4">
    <NuxtLink to="/" class="uppercase text-primary font-bold">Job Board</NuxtLink>

    <div class="flex gap-2 items-center">
      <div class="flex gap-4" v-if="user">
        <Profile />
      </div>
      <div class="flex gap-4 items-center" v-else>
        <UButton variant="outline" to="/auth/login" class="duration-300">
          Log in
        </UButton>
        <UButton to="/auth/register"> Sign up </UButton>
      </div>
      <ColorMode />
    </div>
  </UContainer>
</template>

<script lang="ts" setup>
const user = useCurrentUser();
</script>
