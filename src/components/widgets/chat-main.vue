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
import { Client, IFrame } from '@stomp/stompjs';

import ChatSessions from '@/components/widgets/chat-sessions.vue';
import ChatMessages from '@/components/widgets/chat-messages.vue';
import api from '@/libs/api';
import log from '@/libs/log';
import SockJS from 'sockjs-client';
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

const curl = new URL(location.href);
onMounted(async () => {
  let socket: typeof SockJS;
  const stomp = new Client({
    webSocketFactory: () => socket = new window.SockJS(`/api/ws`) as any as typeof SockJS,
    reconnectDelay: 5000,
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000,
    forceBinaryWSFrames: false,
    appendMissingNULLonIncoming: true,
    debug: (msg) => log.debug("MSG:", msg),    
  });
  stomp.onConnect = (v: IFrame) => {
    log.debug('CONNECTED', v);
  }
  stomp.onStompError = (v) => { log.error('STOMP ERROR', v); }
  stomp.onDisconnect = (v) => { log.error('DISCONNECT', v); }
  stomp.onWebSocketClose = (v) => { log.error('WS CLOSE', v); }
  stomp.onWebSocketError = (v) => { log.error('WS ERROR', v); }
  stomp.activate();
  log.debug('START...');
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