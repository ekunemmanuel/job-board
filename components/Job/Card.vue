<template>
  <div
    class="w-full dark:bg-[#212121] bg-[#e0dede] p-4 py-8 rounded-xl shadow-xl flex gap-4 sm:items-center sm:flex-row flex-col items-start"
  >
    <div>
      <NuxtImg
        class="rounded-full"
        :src="job?.companyLogo"
        :alt="job?.companyName"
        background="lime"
        preload
        height="100"
        width="100"
      />
    </div>
    <div class="flex-1 w-full space-y-2">
      <div class="flex justify-between items-center gap-2">
        <div class="flex-1">
          <h3>{{ job?.companyName }}</h3>
          <p class="text-2xl font-bold">{{ job?.jobTitle }}</p>
        </div>
        <div class="flex gap-2">
          <div
            class="flex gap-2 flex-wrap items-center justify-end"
            v-if="isAdmin"
          >
            <UButton variant="outline" icon="material-symbols:edit-rounded" />
            <UButton
              variant="outline"
              color="rose"
              icon="material-symbols-light:delete-outline-rounded"
            />
          </div>
          <UIcon
            v-else
            @click="hasLiked"
            :name="liked ? 'ic:round-favorite' : 'ic:round-favorite-border'"
            class="size-7 cursor-pointer"
            :class="[liked ? 'text-primary' : 'text-gray-500']"
          />
        </div>
      </div>
      <p class="flex justify-between flex-wrap">
        <span class="text-gray-500">
          {{ job?.remote }} -
          <span>
            {{ job?.location.city }}, {{ job?.location.state }},
            {{ job?.location.country }}</span
          >
          - <span>{{ job?.type }}</span>
        </span>
        <span>Posted {{ job?.timeOfCreation }} ago</span>
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { JobSummary } from "~/types";

const liked = ref(false);
const props = defineProps<{
  job?: JobSummary;
  who: "user" | "admin";
}>();

const isAdmin = computed(() => props.who === "admin");

function hasLiked() {
  liked.value = !liked.value;
}
</script>

<style></style>
