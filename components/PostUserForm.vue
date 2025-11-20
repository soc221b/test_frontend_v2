<template>
  <form @submit.prevent="handleSubmit" class="b-solid rounded-xl p-4 mx-auto w-full">
    <h1 class="text-center">{{ $t('operation') }}</h1>

    <ETextField v-model="model.name" :label="$t('name')"></ETextField>
    <Errors :errors="v$.name.$errors"></Errors>

    <ETextField v-model="model.age" :label="$t('age')"></ETextField>
    <Errors :errors="v$.age.$errors"></Errors>

    <div class="flex justify-end mt-8">
      <EBtn type="submit" color="warn">{{ $t('create') }}</EBtn>
    </div>
  </form>
</template>

<script setup lang="ts">
import { cloneDeep } from 'lodash-es'
import EBtn from './EBtn.vue'
import { useAppStore } from '~/store/app'
import { required, integer, minValue } from '@vuelidate/validators'
import useVuelidate from '@vuelidate/core'

const appStore = useAppStore()
const { open } = useConfirm()
const { t } = useI18n()

const defaultModelValue = Object.freeze({
  name: '',
  age: '',
})
const model = ref<{
  name: string
  age: string
}>(cloneDeep(defaultModelValue))

const rules = {
  name: { required },
  age: { required, integer, minValue: minValue(0) },
}

const v$ = useVuelidate(rules, model)

const handleSubmit = async () => {
  if ((await v$.value.$validate()) === false) {
    return
  }
  if ((await open(t('are_you_sure'))) === false) {
    return
  }

  appStore.post({
    name: model.value.name.trim(),
    age: parseInt(model.value.age, 10),
  })
  model.value = cloneDeep(defaultModelValue)
  v$.value.$reset()
}
</script>
