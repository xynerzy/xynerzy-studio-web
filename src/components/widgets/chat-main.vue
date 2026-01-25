<script setup lang="ts">
import { computed, onMounted, ref, useAttrs } from 'vue';
import { type ChatSessionItem, type MessageItem } from '@/libs/chatting';

import ChatSessions from '@/components/widgets/chat-sessions.vue';
import ChatMessages from '@/components/widgets/chat-messages.vue';
import api from '@/libs/api';
import log from '@/libs/log';
const props = defineProps({
  title: { type: String }
});
const attrs = computed(() => {
  const { ...itms } = useAttrs();
  return itms;
});
const emit = defineEmits();

const data = ref({
  chatSessions: [] as ChatSessionItem[],
  messages: [] as MessageItem[]
});

onMounted(async () => {
  {
    const res = await api.post("chat-session/list", {}, {});
    data.value.chatSessions = res;
    log.debug("MEMBERS:", res);
  }
  {
    const res = await api.post("message/list", {}, {});
    data.value.messages = res;
    log.debug("MESSAGES:", res);
  }
});

</script>
<template>
  <main
    id="chat-main"
    v-bind="{ ...attrs }"
    >
    <ChatSessions
      :chat-sessions="data.chatSessions"
      />
    <ChatMessages
      :messages="data.messages"
      />
  </main>
</template>