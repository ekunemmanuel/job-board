<template>
  <div>
    <UModal :ui="{}" v-model="isOpen" :prevent-close="loading">
      <UCard>
        <template #header>
          <h2 class="sm:text-2xl text-xl">{{ titleText }}</h2>
          <p class="text-gray-500">{{ descText }}</p>
        </template>
        <div>
          <fieldset :disabled="loading" class="space-y-4">
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
                  :help="
                    key === 'website'
                      ? 'If the company does not have a website you can use its social media link'
                      : ''
                  "
                >
                  <UInput
                    v-model="state[key]"
                    :placeholder="placeholder(key)"
                  />
                </UFormGroup>
              </template>
              <UButton type="submit" :loading>{{ buttonText }}</UButton>
            </UForm>
          </fieldset>
        </div>
      </UCard>
    </UModal>
  </div>
</template>

<script lang="ts" setup>
import { z } from "zod";
import type { FormSubmitEvent } from "#ui/types";
import type { Company } from "~/types";
const notification = useNotification();
const { createDoc, modifyDoc } = useFirebase();
const isOpen = defineModel({
  default: false,
});
const user = useCurrentUser();
// const createdBy = useUser().value;
const collectionName = "companies";

interface Props {
  company?: Company;
}
const props = defineProps<Props>();

const isEditing = computed(() => !!props.company);
const loading = ref(false);
const state = reactive<{ name?: string; website?: string }>({
  name: undefined,
  website: undefined,
});

const schema = z.object({
  name: z
    .string({ message: "Company name is required" })
    .min(2, "Name should be at least 2 characters long"),
  website: z
    .string({ message: "Company website is needed" })
    .url({ message: "Invalid URL format" })
    .refine((url) => url.startsWith("https://"), {
      message: "URL must start with https://",
    }),
});

const titleText = computed(() =>
  !isEditing.value ? "Create a new company" : "Update company"
);
const descText = computed(() =>
  !isEditing.value
    ? "To create a job you first need to register a company"
    : "You are updating the company data"
);
const buttonText = computed(() => (!isEditing.value ? "Create" : "Update"));

type Schema = z.output<typeof schema>;

async function onSubmit(event: FormSubmitEvent<Schema>) {
  const data: Company = {
    createdBy: user.value?.uid!,
    name: event.data.name.toLowerCase(),
    website: event.data.website.toLowerCase(),
  };

  if (isEditing.value) {
    await updateCompany(props.company?.id!, data);
  } else {
    await createCompany(data);
  }
  isOpen.value = false;
  resetState();
}

async function createCompany(data: Company) {
  try {
    loading.value = true;
    const docId = await createDoc(collectionName, {
      ...data,
      createdAt: new Date().toISOString(),
    });
    if (!docId) throw new Error();
    notifySuccess("Company has been created");
  } catch (error) {
    notifyError("Something went wrong when creating");
  }
}

async function updateCompany(docId: string, data: Company) {
  try {
    loading.value = true;
    await modifyDoc(collectionName, docId, {
      ...data,
      updatedAt: new Date().toISOString(),
    });
    notifySuccess("Company has been updated");
  } catch (error) {
    notifyError("Something went wrong when updating");
  }
}

function notifySuccess(message: string) {
  notification.success({ title: "Success", message });
}

function notifyError(message: string) {
  notification.error({ title: "Error", message });
}

function resetState() {
  state.name = undefined;
  state.website = undefined;
  loading.value = false;
}

const placeholder = computed(() => (key: string) => {
  switch (key) {
    case "name":
      return "Google";
    case "website":
      return "https://google.com";
    default:
      return "default";
  }
});

watch(isEditing, (newValue) => {
  if (newValue) {
    isOpen.value = true;
    state.name = props.company?.name;
    state.website = props.company?.website;
  }
});

watch(isOpen, (newValue) => {
  if (!newValue) resetState();
});
</script>

<style scoped></style>
