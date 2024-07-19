<template>
  <UContainer class="flex justify-center">
    <UCard class="max-w-[600px] flex-1">
      <template #header>
        <h2 class="text-lg font-semibold">{{ title }}</h2>
        <p class="text-sm text-gray-400">{{ description }}</p>
      </template>
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
                  base: 'text-sm font- semibold capitalize',
                },
              }"
              :label="key"
              :name="key"
              required
            >
              <UInput
                v-model="state[key]"
                :placeholder="key"
                :type="getFieldType(key)"
              />
            </UFormGroup>
          </template>
          <UButton type="submit" :loading> {{ buttonText }} </UButton>
        </UForm>


        <div class="flex justify-center">
          <UButton
            variant="link"
            :to="props.type === 'login' ? '/auth/register' : '/auth/login'"
          >
            {{ linkText }}
          </UButton>
        </div>
      </fieldset>

      <Loading v-model="loading" />
    </UCard>
  </UContainer>
</template>

<script lang="ts" setup>
import { z } from "zod";
import type { FormSubmitEvent } from "#ui/types";
import type { Form } from "~/types";

const props = defineProps<{
  type: "login" | "register";
  loading: boolean;
}>();

const loading = toRef(props, "loading");

const emit = defineEmits<{
  login: [value: Form];
  register: [value: Form]; // named tuple syntax
}>();

const title = computed(() => (props.type === "login" ? "Login" : "Register"));
const description = computed(() =>
  props.type === "login" ? "Login to your account" : "Register a new account"
);
const buttonText = computed(() =>
  props.type === "login" ? "Login" : "Register"
);

const linkText = computed(() =>
  props.type === "login"
    ? "If you don't have an account, register here"
    : "If you have an account, login here"
);
const state = computed<Form>(() =>
  props.type === "login"
    ? {
        email: "",
        password: "",
      }
    : {
        firstname: "",
        lastname: "",
        email: "",
        password: "",
      }
);

const schema = computed(() =>
  props.type == "login"
    ? z.object({
        email: z.string().email(),
        password: z.string().min(6, "Password must be at least 6 characters"),
      })
    : z.object({
        email: z.string().email(),
        password: z.string().min(6, "Password must be at least 6 characters"),
        firstname: z
          .string()
          .min(2, "First name must be at least 2 characters"),
        lastname: z.string().min(2, "Last name must be at least 2 characters"),
      })
);

type Schema = z.output<typeof schema.value>;

function getFieldType(key: string): string {
  return key.includes("password") ? "password" : "text";
}

async function onSubmit(event: FormSubmitEvent<Schema>) {
  props.type === "login"
    ? emit("login", event.data)
    : emit("register", event.data);
}
</script>

<style></style>
