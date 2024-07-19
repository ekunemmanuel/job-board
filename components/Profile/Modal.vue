<template>
  <div>
    <UModal v-model="isOpen">
      <div class="p-4 space-y-4">
        <div class="flex items-center space-y-4 gap-4">
          <div>
            <UAvatar
              :alt="user?.displayName ?? 'Guest'"
              class="size-20 uppercase text-2xl"
            />
          </div>
          <div class="flex flex-col space-y-2">
            <span class="text-lg font-semibold capitalize">{{
              user?.displayName
            }}</span>
            <span class="text-sm text-gray-500">{{
              user?.email ?? "Guest"
            }}</span>
          </div>
        </div>
        <div class="flex justify-end">
          <UButton
            color="rose"
            variant="outline"
            @click="deleteUserAccount"
            class="cursor-pointer"
            icon="material-symbols-light:delete-outline-rounded"
            label="Delete Account"
          />
        </div>
      </div>
    </UModal>
  </div>
</template>

<script lang="ts" setup>
import type { BatchOperations, Company, Job, User } from "~/types";

const isOpen = defineModel("isOpen", {
  default: true,
});

const user = useCurrentUser();
const notification = useNotification();
const { getDoc, logOut, fetchDocs, performBatchedProcesses } = useFirebase();

const deleteUserAccount = async () => {
  try {
    if (!user.value?.uid) return;
    const userId = user.value.uid;

    // Fetch user document to ensure it exists
    const userDoc = await getDoc<User>({
      collectionName: "users",
      docId: userId,
    });
    if (!userDoc.data) {
      throw new Error(`User with ID ${userId} does not exist.`);
    }

    // Fetch companies created by the user
    const userCompanies = await fetchDocs<Company>({
      collectionName: "companies",
      whereClauses: [{ field: "createdBy", operator: "==", value: userId }],
    });

    // Initialize an array to hold batch operations
    const batchOperations: BatchOperations[] = [];

    // Iterate through each company
    for (const company of userCompanies) {
      const companyId = company.id;

      // Fetch jobs associated with the company
      const companyJobs = await fetchDocs<Job>({
        collectionName: "jobs",
        whereClauses: [
          { field: "companyID", operator: "==", value: companyId },
        ],
      });

      // Log fetched jobs for debugging
      console.log(`Jobs for company ${companyId}:`, companyJobs);

      // Add delete operations for jobs to batch operations
      for (const job of companyJobs) {
        if (!job.id) {
          console.warn(
            `Job with missing ID found in company ${companyId}:`,
            job
          );
          continue;
        }
        batchOperations.push({
          type: "delete",
          collection: "jobs",
          docId: job.id,
        });
      }

      if (!companyId) {
        continue;
      }
      // Add delete operation for the company to batch operations
      batchOperations.push({
        type: "delete",
        collection: "companies",
        docId: companyId,
      });
    }

    // Add delete operation for the user to batch operations
    batchOperations.push({
      type: "delete",
      collection: "users",
      docId: userId,
    });

    // Log batch operations for debugging
    console.log("Batch operations:", batchOperations);

    // Perform all batched operations
    await performBatchedProcesses(batchOperations);
    await user.value.delete();
    await signOut();
    console.log(
      `User with ID ${userId} and all associated data have been deleted successfully.`
    );
  } catch (error) {
    console.error("Error deleting user account:", error);
  } finally {
    isOpen.value = false;
  }
};

async function signOut() {
  try {
    if (!user.value) {
      return;
    }
    await user.value.delete();
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
