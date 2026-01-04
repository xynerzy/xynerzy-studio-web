<script setup lang="ts">
import { computed, ref, useAttrs } from 'vue';
import ChatMembers from '@/components/widgets/chat-members.vue';
import ChatMessages from '@/components/widgets/chat-messages.vue';
const props = defineProps({
  title: { type: String }
});
const attrs = computed(() => {
  const { ...itms } = useAttrs();
  return itms;
});
const emit = defineEmits();

</script>
<template>
  <main
    id="chat-main"
    v-bind="{ ...props, ...attrs }"
    >
    <ChatMembers />
    <ChatMessages />
  </main>
</template>