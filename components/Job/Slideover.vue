<template>
  <USlideover v-model="isOpen">
    <div class="space-y-4 p-2">
      <div class="flex justify-end">
        <UButton label="close" @click="isOpen = false" color="rose" />
      </div>

      <JobDetails v-if="job?.id" :id="job.id" />
    </div>
  </USlideover>
</template>

<script lang="ts" setup>
import type { Job } from "~/types";

const props = defineProps<{
  id?: string;
}>();
const isOpen = defineModel({
  default: false,
});
const loading = ref(false);
const job = ref<Job | undefined>();
const notification = useNotification();
const { getDoc } = useFirebase();
if (props.id) {
  try {
    loading.value = true;
    const { data } = await getDoc<Job>("jobs", props.id);
    if (!data) {
      notification.error({
        title: "Error",
        message: "Job doesn't exist",
      });
      isOpen.value = false;
    }

    job.value = data;
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
}
</script>

<style></style>
