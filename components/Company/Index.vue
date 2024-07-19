<template>
  <div>
    <ul class="space-y-4">
      <li v-for="company in companies" :key="company.id">
        <CompanyCard @edit="(value) => (editCompany = value)" :company />
      </li>
    </ul>
    <CompanyModal v-model="isOpen" :company="editCompany" />
  </div>
</template>

<script lang="ts" setup>
import type { Company } from "~/types";

const { getCollection } = useFirebase();

const user = useCurrentUser();
// const createdBy = useUser().value;
const collectionName = "companies";
const { data, pending } = await getCollection<Company>({
  collectionName,
  ssrKey: collectionName,
  whereClauses: [
    {
      field: "createdBy",
      operator: "==",
      value: user.value?.uid,
    },
  ],
  order: [
    {
      field: "createdAt",
      direction: "desc",
    },
  ],
});

const companies = ref<Company[]>(data.value);
// const companies = useCompanies().value;

const editCompany = ref<Company | undefined>();

const isOpen = defineModel({
  default: false,
});

watch(isOpen, (newValue) => {
  if (!newValue) {
    editCompany.value = undefined;
  }
});
</script>

<style></style>
