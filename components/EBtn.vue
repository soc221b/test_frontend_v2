<template>
  <button :type="type" :class="'e-btn rounded border-none' + ` e-btn-${color}`" :disabled="props.disabled">
    <template v-if="!!text">
      {{ text }}
    </template>
    <template v-else>
      <slot />
    </template>
  </button>
</template>

<script setup lang="ts">
interface Props {
  text?: string // 若有輸入時以此為主，若沒有就顯示 slot
  color?: 'success' | 'error' | 'warn' // 預設為 success
  type?: 'submit' | 'button'
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {})
</script>

<style scoped lang="scss">
.e-btn {
  &:hover,&:active {
    @apply filter-brightness-90;
  }

  // success 綠
  &-success {
    @apply bg-green-6 text-white;
  }

  // error 紅
  &-error {
    @apply bg-rose-6 text-white;
  }

  // warn 黃
  &-warn {
    @apply bg-amber;
  }
}
</style>
