<script setup lang="ts">
import { computed, ref, useAttrs } from 'vue';
const props = defineProps({
  messages: { type: Array }
});
const attrs = computed(() => {
  const { ...itms } = useAttrs();
  return itms;
});
const emit = defineEmits();
</script>
<template>
  <div
    id="chat-messages"
    v-bind="{ ...props, ...attrs }"
    >
    <div style="height: 1000rem"></div>
  </div>
</template>