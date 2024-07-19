<script setup lang="ts">
import type { FormSubmitEvent } from "#ui/types";
import type { Company, Job, Schema } from "~/types";

const route = useRoute();
const { modifyDoc, getDoc } = useFirebase();
const notification = useNotification();

const loading = ref(false);
const { id } = route.params;
const jobId = id as string;
const company = ref<Company | undefined>();

const job = ref<Job | undefined>();
try {
  loading.value = true;
  const { data } = await getDoc<Job>("jobs", jobId);
  if (!data) {
    navigateTo("/dasboard/job");
  }

  const { data: c } = await getDoc<Company>("companies", data.companyID);
  if (!c) {
    navigateTo("/dasboard");
  }
  Object.assign(state, data);
  job.value = data;
  company.value = c;
} catch (error) {
  navigateTo("/dasboard/job");
  console.error("Failed to load job data", error);
  notification.error({
    title: "Error",
    message: "Failed to load job data",
  });
} finally {
  loading.value = false;
}

async function onSubmit(event: FormSubmitEvent<Schema>) {
  const data = {
    ...event.data,
    updatedAt: new Date().toISOString(),
  };

  try {
    loading.value = true;
    await modifyDoc("jobs", jobId, data);

    notification.success({
      title: "Success",
      message: "Job has been updated",
    });

    state.title = undefined;
    state.description = undefined;
    state.type = undefined;
    state.remote = undefined;
    state.salary.amount = undefined;
    state.salary.frequency = undefined;
    state.location.city = undefined;
    state.location.state = undefined;
    state.location.country = undefined;
    state.contact.name = undefined;
    state.contact.email = undefined;
    state.contact.social = undefined;
    navigateTo("/dashboard/company/" + job.value?.companyID);
  } catch (error) {
    console.log(error);
    notification.error({
      title: "Error",
      message: "Failed to add job",
    });
  } finally {
    loading.value = false;
  }
}

onBeforeUnmount(() => {
  state.title = undefined;
  state.description = undefined;
  state.type = undefined;
  state.remote = undefined;
  state.salary.amount = undefined;
  state.salary.frequency = undefined;
  state.location.city = undefined;
  state.location.state = undefined;
  state.location.country = undefined;
  state.contact.name = undefined;
  state.contact.email = undefined;
  state.contact.social = undefined;
});
</script>

<template>
  <UContainer class="pb-10 space-y-4">
    <div class="space-y-2 flex justify-between">
      <h1 class="text-3xl">Edit Job for {{ company?.name }}</h1>

      <UButton
        label="Back to company"
        variant="outline"
        color="gray"
        :to="`/dashboard/company/${job?.companyID}`"
      />
    </div>
    <fieldset :disabled="loading">
      <UForm
        :schema="schema"
        :state="state"
        class="space-y-6"
        @submit="onSubmit"
      >
        <template v-for="(value, key) in state" :key="key">
          <UFormGroup
            :ui="{
              label: {
                base: 'text-sm font-semibold capitalize',
              },
            }"
            :label="key"
            :name="key"
            required
          >
            <template v-if="optionsMap[key]">
              <URadioGroup v-model="state[key]" :options="optionsMap[key]" />
            </template>
            <template
              v-else-if="
                typeof state[key] === 'object' && !Array.isArray(state[key])
              "
            >
              <div class="space-y-2">
                <template
                  v-for="(subValue, subKey) in state[key]"
                  :key="subKey"
                >
                  <UFormGroup
                    :ui="{
                      label: {
                        base: 'text-sm font-semibold capitalize',
                      },
                    }"
                    :label="subKey"
                    :name="`${key}.${subKey}`"
                    required
                  >
                    <template v-if="optionsMap[subKey]">
                      <URadioGroup
                        v-model="state[key][subKey]"
                        :options="optionsMap[subKey]"
                      />
                    </template>
                    <template v-else>
                      <UInput
                        v-model="state[key][subKey]"
                        :placeholder="subKey"
                      />
                    </template>
                  </UFormGroup>
                </template>
              </div>
            </template>
            <template v-else-if="key == 'description'">
              <UTextarea v-model="state[key]" :placeholder="key" />
            </template>
            <template v-else>
              <UInput v-model="state[key]" :placeholder="key" />
            </template>
          </UFormGroup>
        </template>
        <UButton :loading type="submit">Submit</UButton>
      </UForm>
    </fieldset>
  </UContainer>
</template>
