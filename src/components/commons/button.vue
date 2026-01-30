<!--
@File        : button.vue
@Author      : lupfeliz@gmail.com
@Since       : 2026-01-29
@Description : button
@Site        : https://github.com/xynerzy
-->
<script setup lang="ts">
import { useAttrs, computed } from 'vue';
const props = defineProps();
const attrs = computed(() => {
  const { ...itms } = useAttrs();
  return itms;
});
</script>
<template>
  <button
    v-bind="{ ...attrs }"
    >
  </button>
</template>