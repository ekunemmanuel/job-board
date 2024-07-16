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

const createdBy = useUser().value;
const collectionName = "companies";
const { data, pending } = await getCollection<Company>(
  collectionName,
  "companies",
  [
    {
      field: "createdAt",
      direction: "desc",
    },
  ],
  [
    {
      field: "createdBy",
      operator: "==",
      value: createdBy,
    },
  ]
);
const companies = ref<Company[]>(data.value);

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
