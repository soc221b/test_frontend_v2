<template>
  <form @submit.prevent="handleSubmit">
    <EBtn :disabled color="error">{{ $t('delete') }}</EBtn>
  </form>
</template>

<script setup lang="ts">
import { useAppStore } from '~/store/app';
import EBtn from './EBtn.vue'

const appStore = useAppStore()
const { open } = useConfirm()
const { t } = useI18n()

type Props = {
  id: number
  disabled?: boolean
}
const props = defineProps<Props>()

const handleSubmit = async () => {
  if ((await open(t('are_you_sure'))) === false) {
    return
  }

  await appStore.remove({ id: props.id })
}
</script>
