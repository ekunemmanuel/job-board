<template>
  <UCard>
    <div class="flex items-center gap-4">
      <div class="overflow-hidden rounded-full">
        <UAvatar
          :ui="{
            size: {
              '3xl': 'size-28 text-3xl',
            },
          }"
          :alt="company.name"
          size="3xl"
          class="uppercase font-bold"
        />
      </div>
      <div class="">
        <h2 class="text-3xl font-bold capitalize">{{ company.name }}</h2>
        <UButton
          variant="link"
          color="gray"
          :to="company.website"
          target="_blank"
          :external="true"
          leading-icon="material-symbols-light:link"
          trailing-icon="prime:external-link"
          :padded="false"
          >{{ company.website }}</UButton
        >
      </div>
    </div>
    <template #footer>
      <div class="flex justify-end gap-2">
        <UButton
          :to="`/dashboard/company/${company.id}`"
          variant="outline"
          icon="ic:round-remove-red-eye"
          >View</UButton
        >
        <UButton variant="outline" color="gray" @click="$emit('edit', company)"
          >Edit</UButton
        >
        <UButton
          variant="outline"
          color="rose"
          @click="deleteCompany(company.id!)"
          :loading
        >
          Delete
        </UButton>
      </div>
    </template>
  </UCard>
</template>

<script lang="ts" setup>
import type { Company } from "~/types";

const { removeDoc } = useFirebase();
const notification = useNotification();

const loading = ref(false);

const props = defineProps<{
  company: Company;
}>();

const emit = defineEmits<{
  edit: [value: Company];
}>();

async function deleteCompany(docId: string) {
  try {
    loading.value = props.company.id === docId;
    await removeDoc("companies", docId);

    // Remove related job documents
    const jobRemovalPromises =
      props.company.jobs?.map((jobId) => removeDoc("jobs", jobId)) || [];
    await Promise.all(jobRemovalPromises);
    notification.success({
      title: "Success",
      message: "Company info has been deleted successfully",
    });
  } catch (error) {
    notification.error({
      title: "Error",
      message: "Something went wrong while deleting the company",
    });
  } finally {
    loading.value = false;
  }
}
</script>

<style></style>
