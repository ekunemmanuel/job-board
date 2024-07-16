<template>
  <div class="relative">
    <section class="pb-20 relative">
      <UContainer
        class="flex justify-center w-full items-center flex-col text-center gap-4 pt-10 sticky top-0"
      >
        <h1 class="text-5xl font-bold">Find your dream job</h1>
        <UInput
          name="search"
          placeholder="Search..."
          class="w-1/2 px-2"
          :loading="isSearching"
          v-model="search"
          size="lg"
          :ui="{
            icon: {
              trailing: {
                pointer: '',
                padding:{
                  sm:'px-3.5'
                }
              },
            },
          }"
        >
          <template #trailing>
            <UButton
              v-show="search !== ''"
              :padded="false"
              @click="isSearching = true"
              icon="ph:paper-plane-tilt"
              class="p-1"
            />
          </template>
        </UInput>

 
      </UContainer>
    </section>
    <section class="bg-primary/20 py-4">
      <UContainer class="space-y-2">
        <h2 class="text-xl font-bold">Recent Jobs</h2>

        <div>
          <ul class="space-y-4">
            <li v-for="(j, index) in jobs" :key="index">
              <JobCard who="admin" :job="j" />
            </li>
          </ul>
        </div>
      </UContainer>
    </section>
  </div>
</template>

<script lang="ts" setup>
import type { JobSummary } from "~/types";

const isSearching = ref(false);
const notification = useNotification();
const search = ref("");
const job: JobSummary = {
  companyLogo: "https://via.placeholder.com/150",
  companyName: "Amazon",
  jobID: "Amazon12",
  jobTitle: "Software Engineer",
  location: {
    city: "Lagos",
    state: "Lagos",
    country: "Nigeria",
  },
  type: "Full-time",
  timeOfCreation: "2 days",
  remote: "Hybrid",
};

const jobs = ref<JobSummary[]>([
  job,
  job,
  job,
  job,
  job,
  job,
  job,
  job,
  job,
  job,
]);
</script>

<style></style>
