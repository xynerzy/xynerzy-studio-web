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
  <section
    id="chat-messages"
    v-bind="{ ...props, ...attrs }"
    >
    <dl>
      <!--[ MESSAGE-ITEM -->
      <dd>
      </dd>
      <!--] MESSAGE-ITEM -->
    </dl>
  </section>
</template>