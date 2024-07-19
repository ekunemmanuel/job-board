<template>
  <div class="space-y-4">
    <div v-if="who == 'admin'" class="space-y-2 flex justify-between">
      <UButton
        label="Back to company"
        variant="outline"
        color="gray"
        icon="material-symbols:arrow-back-ios-new-rounded"
        :to="`/dashboard/company/${job?.companyID}`"
      />
    </div>

    <div class="space-y-4">
      <div class="flex justify-between gap-4 flex-wrap items-center">
        <div class="space-y-2">
          <p class="text-primary uppercase font-bold">{{ company?.name }}</p>
          <h2 class="text-3xl font-bold capitalize">
            {{ job?.title }}
          </h2>
          <p>
            {{ job?.description }}
          </p>
        </div>
        <div v-if="who == 'admin'" class="flex flex-col gap-2">
          <UButton
            label="Edit"
            variant="outline"
              icon="material-symbols:edit-rounded"
            :to="`/dashboard/job/${job?.id}/edit-job`"
          />
          <UButton
            label="Delete"
            variant="outline"
            color="rose"
            :to="`/dashboard/company/${job?.companyID}`"
            @click="del(job?.id!, job?.companyID!)"
            icon="material-symbols-light:delete-outline-rounded"
          />
        </div>
      </div>
      <div class="text-md space-y-6">
        <div>
          <p class="">
            <span class="text-xl font-bold">
              {{ job?.salary.amount }} {{ job?.salary.frequency }}
            </span>
          </p>
          <span class="text-gray-500">
            {{ job?.type }}
          </span>
          <p class="flex justify-between flex-wrap items-center">
            <span class="text-gray-500">
              {{ job?.remote }} -
              <span>
                {{ job?.location.city }}, {{ job?.location.state }},
                {{ job?.location.country }}</span
              >
            </span>
            <span class="text-gray-400">{{ time(job?.createdAt) }}</span>
          </p>
        </div>
        <p>
          <span class="block">Contact Info</span>
          <span class="block capitalize">
            {{ job?.contact.name }}
          </span>
          <span class="block">
            <UButton
              variant="link"
              color="gray"
              :to="`${job?.contact.social}`"
              target="_blank"
              :external="true"
              leading-icon="prime:external-link"
              :padded="false"
              >social</UButton
            >
          </span>
          <span class="block">
            <UButton
              variant="link"
              color="gray"
              :to="`mailto:${job?.contact.email}`"
              target="_blank"
              :external="true"
              leading-icon="material-symbols:mail-rounded"
              :padded="false"
              label="Mail"
            />
          </span>
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Company, Job } from "~/types";

const props = withDefaults(
  defineProps<{
    id: string;
    who?: "user" | "admin";
  }>(),
  {
    who: "user",
  }
);

const loading = ref(false);
const job = ref<Job | undefined>();
const company = ref<Company | undefined>();
const { getDoc, removeDoc, modifyDoc } = useFirebase();
const notification = useNotification();
try {
  loading.value = true;
  const { data } = await getDoc<Job>({
    collectionName: "jobs",
    docId: props.id,
  });

  if (!data) {
    props.who == "admin"
      ? navigateTo("/dashboard")
      : notification.error({
          title: "Error",
          message: "Job doesn't exist",
        });
  }
  const { data: c } = await getDoc<Company>({
    collectionName: "companies",
    docId: data.companyID,
  });
  if (!c) {
    props.who == "admin"
      ? navigateTo("/dashboard")
      : notification.error({
          title: "Error",
          message: "Company doesn't exist",
        });
  }

  job.value = data;
  company.value = c;
} catch (error) {
  console.log(error);
  notification.error({
    title: "Error",
    message: "Job doesn't exist",
  });
} finally {
  loading.value = false;
}

async function del(jobId: string, companyId: string) {
  try {
    await removeDoc({
      collectionName: "jobs",
      docId: jobId,
    });
    await modifyDoc({
      collectionName: "companies",
      docId: companyId,
      data: {
        updatedAt: new Date().toISOString(),
      },
    });
    navigateTo(`/dashboard/company/${companyId}`);
  } catch (error) {
    console.log(error);
  }
}
</script>

<style></style>
