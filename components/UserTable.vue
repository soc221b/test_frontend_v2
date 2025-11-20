<template>
  <div class="b-solid rounded-xl py-2 px-4 mx-auto w-full">
    <table style="border-collapse: collapse;" class="mx-auto">
      <colgroup>
        <col width="50" />
        <col width="300" />
        <col width="80" />
        <col width="200" />
      </colgroup>
      <thead>
        <tr>
          <th>#</th>
          <th>{{ $t('name') }}</th>
          <th>{{ $t('age') }}</th>
          <th>{{ $t('operation') }}</th>
        </tr>
      </thead>
      <tbody>
        <template v-for="user of appStore.users" :key="user.id">
          <tr class="b-b-solid">
            <td style="text-align: center;">{{ user.id }}</td>
            <td style="text-align: center;">{{ user.name }}</td>
            <td style="text-align: center;">{{ user.age }}</td>
            <td class="flex justify-center items-end gap-2">
              <EBtn type="button" color="success" @click="() => handleEdit(user.id)" :text="$t('edit')"></EBtn>
              <DeleteUserForm :id="user.id"></DeleteUserForm>
            </td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import EBtn from './EBtn.vue';
import { useAppStore } from '~/store/app';

const appStore = useAppStore()

const emit = defineEmits<{
  edit: [number]
  deleted: [number]
}>()

const handleEdit = (id: number) => {
  emit('edit', id)
}
</script>
