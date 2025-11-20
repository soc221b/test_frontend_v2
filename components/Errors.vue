<template>
  <div v-for="error of errors" :key="error.$uid">
    <div class="text-rose text-sm">{{ $t(error.$validator, { ...error.$params }) }}</div>
  </div>
</template>

<script setup lang="ts">
import type { ErrorObject } from '@vuelidate/core';

defineProps<{
  errors: ErrorObject[]
}>()
</script>
