<!--
@File        : footer.vue
@Author      : lupfeliz@gmail.com
@Since       : 2026-01-29
@Description : footer
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
  <footer
    v-bind="{ ...attrs }"
    >
  </footer>
</template>