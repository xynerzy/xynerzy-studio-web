<!--
@File        : header.vue
@Author      : lupfeliz@gmail.com
@Since       : 2026-01-29
@Description : header
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
  <header
    v-bind="{ ...attrs }"
    >
  </header>
</template>