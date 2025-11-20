<template>
  <label class="w-full">
    {{ props.label }}
    <br></br>
    <input v-model="model" class="w-full" />
  </label>
</template>

<script setup lang="ts">
interface Props {
  label: string
  modelValue: string
}
const props = withDefaults(defineProps<Props>(), {})

const emit = defineEmits<{
  'update:modelValue': [Props['modelValue']]
}>()

const model = computed({
  get(): Props['modelValue'] {
    return props.modelValue
  },
  set(modelValue: Props['modelValue']) {
    emit('update:modelValue', modelValue)
  },
})
</script>

<style scoped lang="scss"></style>
