<template>
  <ul v-if="jobs.length > 0" class="space-y-4">
    <li v-for="(job, index) in jobss" :key="index">
      <JobCard :who="who" :job="job" />
    </li>
  </ul>
</template>

<script lang="ts" setup>
import type { Company, Job } from "~/types";

const { getDoc, fetchDocs } = useFirebase();

const props = withDefaults(
  defineProps<{
    companyId?: string;
    who?: "user" | "admin";
    search?: string;
  }>(),
  {
    who: "user",
  }
);

const jobs = ref<Job[]>([]);

const filteredJobs = ref<Job[]>([]);

try {
  const fetchConfig: any = {
    collectionName: "jobs",
    ssrKey: "jobs",
    order: [
      {
        field: "createdAt",
        direction: "desc",
      },
    ],
  };

  if (props.who === "admin" && props.companyId) {
    fetchConfig.whereClauses = [
      {
        field: "companyID",
        operator: "==",
        value: props.companyId,
      },
    ];
  }

  const data = await fetchDocs<Job>(fetchConfig);
  // const data = await getCollection<Job>(fetchConfig);

  jobs.value = await Promise.all(
    data.map(async (job) => {
      if (props.who === "user") {
        const companyDoc = await getDoc<Company>("companies", job.companyID);
        return {
          ...job,
          companyName: companyDoc.data.name,
          id: job.id,
        };
      }
      return job;
    })
  );
} catch (error) {
  console.error(error);
}


const jobss = computed<Job[]>(() => {
  return !!props.search ? filteredJobs.value : jobs.value;
});

watchEffect(() => {

  filteredJobs.value = jobs.value.filter((job) => {
    if (!props.search) {
      return []
    }
    return job.title.toLowerCase().includes(props.search.toLowerCase());
  });
});
</script>

<style scoped></style>
