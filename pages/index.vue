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
                padding: {
                  sm: 'px-3.5',
                },
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
    <section class="bg-primary/20 py-4 min-h-[calc(100vh-288px)]">
      <UContainer class="space-y-2">
        <h2 class="text-xl font-bold">Recent Jobs</h2>

        <Suspense>
          <JobList :search />
          <template #fallback> loading... </template>
        </Suspense>
      </UContainer>
    </section>
  </div>
</template>

<script lang="ts" setup>
const isSearching = ref(false);
const search = ref("");

useHead({
  title: "Job Board",
  meta: [
    {
      name: "description",
      content:
        "Job Board is a place where you see available jobs and a place where you can add jobs",
      value: {
        name: "description",
        content:
          "Job Board is a place where you see available jobs and a place where you can add jobs",
      },
    },
  ],
});

watch(search, (newVal) => {
  if (newVal) {
    isSearching.value = true;
  } else {
    isSearching.value = false;
  }
});
</script>

<style></style>
