<script lang="ts" setup>
import type { Company } from "~/types";

const { getDoc } = useFirebase();
const route = useRoute();
const notification = useNotification();
const { id } = route.params;
const company = ref<Company | undefined>();
const companyId = id as string;
try {
  const { data } = await getDoc<Company>({
    collectionName: "companies",
    docId: id as string,
  });
  if (!data) {
    notification.error({
      title: "Error",
      message: "Company not found",
    });
    navigateTo("/dashboard");
  }
  company.value = data;
} catch (error) {
  console.log(error);

  notification.error({
    title: "Error",
    message: "Company not found",
  });
  navigateTo("/dashboard");
}
</script>
<template>
  <UContainer class="space-y-4">
    <div class="flex justify-between items-center flex-wrap">
      <div>
        <div class="space-y-2">
          <h2 class="text-5xl font-bold capitalize">{{ company?.name }}</h2>
          <UButton
            variant="link"
            color="gray"
            :to="company?.website"
            target="_blank"
            :external="true"
            leading-icon="material-symbols-light:link"
            trailing-icon="prime:external-link"
            :padded="false"
            >{{ company?.website }}</UButton
          >
        </div>
      </div>
      <div class="gap-4 flex flex-col">
        <UButton
          :to="`/dashboard`"
          variant="outline"
          color="gray"
          icon="material-symbols:arrow-back-ios-new-rounded"
        >
          Back
        </UButton>
        <UButton
          :to="`/dashboard/company/${id}/create-job`"
          variant="outline"
          icon="material-symbols:add-rounded"
        >
          Create Job
        </UButton>
      </div>
    </div>
    <Suspense>
      <JobList :company-id="companyId" who="admin" />
      <template #fallback> loading... </template>
    </Suspense>
  </UContainer>
</template>
