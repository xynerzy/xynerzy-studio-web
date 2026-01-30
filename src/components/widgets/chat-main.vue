<!--
@File        : chat-main.vue
@Author      : lupfeliz@gmail.com
@Since       : 2026-01-29
@Description : Chatting Main view
@Site        : https://github.com/xynerzy
-->
<script setup lang="ts">
import { computed, onMounted, ref, useAttrs } from 'vue';
import { type ChatSessionItem, type MessageItem } from '@/libs/chatting';
import Stomp from 'stompjs';
import SockJS from 'sockjs-client';

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
  log.debug('START...');
  const socket = new SockJS('');
  const stomp = Stomp.over(socket);
  // {
  //   api.post('chat-session/list', {}, {
  //     complete(res: any) {
  //       data.value.chatSessions = res;
  //       log.debug('SESSIONS:', res);
  //     }
  //   });
  //   // const res = await api.post('chat-session/list', {}, {});
  // }
  // {
  //   api.post('message/list', {}, {
  //     complete(res: any) {
  //       log.debug('MESSAGES:', res);
  //       data.value.messages = res;
  //       // data.value.messages = [];
  //       // for (let inx = 0; inx < 99; inx++) {
  //       //   for (const itm of res) {
  //       //     data.value.messages.push(itm);
  //       //   }
  //       // }
  //     }
  //   });
  //   // const res = await api.post('message/list', {}, {});
  // }
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