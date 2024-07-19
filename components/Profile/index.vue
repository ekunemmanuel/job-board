<template>
  <div class="">
    <UDropdown
      :items="items"
      :ui="{
        width: 'max-w-[300px] w-full',
      }"
    >
      <UAvatar :alt="avatar.alt" size="md" class="uppercase" />

      <template #account="{ item }">
        <div class="text-left">
          <p>Signed in as</p>
          <p class="truncate font-medium text-gray-900 dark:text-white">
            {{ item.label }}
          </p>
        </div>
      </template>

      <template #item="{ item }">
        <span class="truncate">{{ item.label }}</span>

        <UIcon
          :name="item.icon"
          class="flex-shrink-0 h-4 w-4 text-gray-400 dark:text-gray-500 ms-auto"
        />
      </template>
    </UDropdown>

    <ProfileModal v-model:isOpen="isOpen" />
  </div>
</template>

<script lang="ts" setup>
const { logOut } = useFirebase();

const notification = useNotification();
const user = useCurrentUser();

const isOpen = ref(false);
const avatar = ref({
  alt: user.value?.displayName ?? "Guest",
});

const items = [
  [
    {
      label: user.value?.email ?? "Guest@email.com",
      slot: "account",
      disabled: true,
    },
  ],

  [
    {
      label: "Dashboard",
      icon: "material-symbols:account-circle",
      click: () => {
        navigateTo("/dashboard");
      },
    },
    {
      label: "Profile",
      icon: "material-symbols:account-circle",
      click: () => {
        isOpen.value = true;
      },
    },
  ],
  [
    {
      label: "Sign out",
      icon: "i-heroicons-arrow-left-on-rectangle",
      click: () => {
        signOut();
      },
    },
  ],
];

async function signOut() {
  try {
    await logOut();
    navigateTo("/");
    notification.success({
      title: "Success",
      message: "You have logged out successfully",
    });
  } catch (error) {
    console.log(error);
    notification.error({
      title: "Error",
      message: "An error occured while logging out",
    });
  }
}
</script>

<style></style>
