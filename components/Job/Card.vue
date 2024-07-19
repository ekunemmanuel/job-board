<template>
  <div
    class="w-full dark:bg-[#212121] bg-[#e0dede] p-4 py-8 rounded-xl shadow-xl flex gap-4 sm:items-center sm:flex-row flex-col items-start"
  >
    <div v-if="job?.companyName">
      <UAvatar
        :ui="{
          size: {
            '3xl': 'size-28 text-3xl',
          },
        }"
        :alt="job?.companyName"
        size="3xl"
      />
    </div>
    <div class="flex-1 w-full space-y-2">
      <div class="flex justify-between items-center gap-2">
        <div class="flex-1">
          <h3 class="capitalize">{{ job?.companyName }}</h3>
          <p class="text-2xl font-bold capitalize">{{ job?.title }}</p>
        </div>
        <div class="flex gap-2">
          <UButton
            variant="outline"
            icon="ic:round-remove-red-eye"
            @click="view(job?.id!)"
            label="view"
          />
          <div
            class="flex gap-2 flex-wrap items-center justify-end"
            v-if="isAdmin"
          >
            <UButton
              variant="outline"
              icon="material-symbols:edit-rounded"
              :to="`/dashboard/job/${job?.id}/edit-job`"
              label="edit"
              color="gray"
            />
            <!-- <UButton
              variant="outline"
              color="rose"
              icon="material-symbols-light:delete-outline-rounded"
              label="delete"
              @click="del(job?.id!, job?.companyID!)"
            /> -->
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
      <p class="flex justify-between flex-wrap items-center">
        <span class="text-gray-500">
          {{ job?.remote }} -
          <span>
            {{ job?.location.city }}, {{ job?.location.state }},
            {{ job?.location.country }}</span
          >
          - <span>{{ job?.type }}</span>
        </span>
        <span class="text-gray-400">{{ time(job?.createdAt) }}</span>
      </p>
    </div>
  </div>

  <Suspense>
    <JobSlideover v-if="jobId" :id="jobId" v-model="isOpen" />
  </Suspense>
</template>

<script lang="ts" setup>
import type { Job } from "~/types";

const { getDoc, removeDoc, modifyDoc } = useFirebase();
const notification = useNotification();
const liked = ref(false);

const props = withDefaults(
  defineProps<{
    job?: Job;
    who?: "user" | "admin";
  }>(),
  {
    who: "user",
  }
);

const isAdmin = computed(() => props.who === "admin");
const isOpen = ref(false);
const jobId = ref<string | undefined>();

function hasLiked() {
  liked.value = !liked.value;
}

function view(id: string) {
  if (props.who == "user") {
    // open slider
    isOpen.value = true;
    jobId.value = id;
  } else if (props.who == "admin") {
    // open job page
    navigateTo(`/dashboard/job/${id}`);
  } else {
    // open slider
  }
}
async function del(jobId: string, companyId: string) {
  try {
    await removeDoc("jobs", jobId);
    await modifyDoc(
      "companies",
      companyId,
      {},
      {
        arrayRemove: {
          jobs: jobId,
        },
      }
    );
    notification.success({
      title: "Success",
      message: "Job has beed deleted",
    });
  } catch (error) {
    console.log(error);
    notification.error({
      title: "Error",
      message: "Failed to delete job",
    });
  }
}

watch(isOpen, (newVal) => {
  if (!newVal) {
    jobId.value = undefined;
  }
});
</script>

<style></style>
