<template>
  <UContainer>
    <!-- {{ data }} -->

    <h1>{{ data.name }}</h1>
    <p>{{ data.website }}</p>
    {{ data.jobs }}
  </UContainer>
</template>

<script lang="ts" setup>
import type { Company } from "~/types";

const { getDoc } = useFirebase();
const route = useRoute();
const { id } = route.params;
const { data } = await getDoc<Company>("companies", id as string);
</script>

<style></style>
