<template>
  <div class="w-[90%] max-w-lg flex flex-col items-center gap-2 mx-auto my-4">
    <template v-if="editingId === null">
      <PostUserForm></PostUserForm>
    </template>
    <template v-else>
      <PutUserForm :id="editingId" @success="handleEdited" @cancel="handleCancelled"></PutUserForm>
    </template>

    <UserTable class="mt-2" @edit="handleEdit"></UserTable>
  </div>
</template>

<script setup lang="ts">
import PostUserForm from '~/components/PostUserForm.vue'
import PutUserForm from '~/components/PutUserForm.vue'
import UserTable from '~/components/UserTable.vue'
import { useAppStore } from '~/store/app'

const appStore = useAppStore()
await callOnce('load-users', appStore.load)
// onBeforeMount(() => {
//   appStore.load()
// })

const editingId = ref<null | number>(null)

const handleEdited = () => {
  editingId.value = null
}

const handleCancelled = () => {
  editingId.value = null
}

const handleEdit = (id: number) => {
  editingId.value = id
}
</script>

<style scoped lang="scss"></style>
