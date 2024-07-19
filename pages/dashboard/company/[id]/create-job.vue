<script setup lang="ts">
import type { FormSubmitEvent } from "#ui/types";
import type { Company, Job, Schema } from "~/types";

const route = useRoute();
const { createDoc, modifyDoc, getDoc } = useFirebase();
const notification = useNotification();

const loading = ref(false);
const { id } = route.params;
const company = ref<Company | undefined>();
try {
  const { data } = await getDoc<Company>("companies", id as string);
  if (!data) {
    navigateTo("/dashboard");
    notification.error({
      title: "Error",
      message: "Company not found",
    });
  }
  company.value = data;
} catch (error) {
  navigateTo("/dashboard");
  notification.error({
    title: "Error",
    message: "Company not found",
  });
}
async function onSubmit(event: FormSubmitEvent<Schema>) {
  const companyId = id as string;
  const data: Job = {
    companyID: companyId,
    ...event.data,
    createdAt: new Date().toISOString(),
  };

  try {
    loading.value = true;
    const docId = await createDoc("jobs", data);
    await modifyDoc(
      "companies",
      companyId,
      {},
      {
        arrayUnion: {
          jobs: docId,
        },
      }
    );
    notification.success({
      title: "Success",
      message: "Job added to company",
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
    navigateTo("/dashboard/company/" + id);
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
      <h1 class="text-3xl">Create Job for {{ company?.name }}</h1>

      <UButton
        label="Back to company"
        variant="outline"
        color="gray"
        :to="`/dashboard/company/${id}`"
      />
    </div>
    <fieldset :disabled="loading">
      <UForm
        :schema="schema"
        :state="state"
        class="space-y-4"
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
