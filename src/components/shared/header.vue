<script setup lang="ts">
import { useAttrs, computed } from 'vue';
const props = defineProps();
const attrs = computed(() => {
  const { ...itms } = useAttrs();
  return itms;
});
</script>
<template>
  <header
    v-bind="{ ...props, ...attrs }"
    >
  </header>
</template>