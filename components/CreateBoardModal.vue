<script setup lang="ts">
  const isVisible = defineModel<boolean>()

  const boardName = ref("")
  const publicPerms = ref(1)

  const submitForm = () => {

  }
</script>

<template>
  <UModal
    v-model="isVisible"
  >
    <div class="w-11/12 md:w-[702px] p-2 sm:p-4">
      <h3 class="text-xl font-bold">Create New Board</h3>
      <form @submit.prevent="submitForm">
        <div class="pb-2">
          <label for="create-name" class="block pb-2 font-bold">Board Name</label>
          <UInput 
            id="create-name"
            v-model="boardName" 
            required
            autocomplete="off"
            class="block"
          />
          <CharLimit :str="boardName" :limit="40" :show-length="20" />
        </div>
        <div class="pb-4">
          <div class="pb-2 font-bold">Public Permissions</div>
        </div>
      </form>
    </div>
  </UModal>
</template>