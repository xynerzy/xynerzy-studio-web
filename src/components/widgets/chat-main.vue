<!--
@File        : chat-main.vue
@Author      : lupfeliz@gmail.com
@Since       : 2026-01-29
@Description : Chatting Main view
@Site        : https://github.com/xynerzy
-->
<script setup lang="ts">
import { computed, onMounted, ref, reactive, useAttrs } from 'vue';
import { type ChatSessionItem, type MessageItem } from '@/libs/chatting';
import { Client, IFrame, Stomp } from '@stomp/stompjs';

import ChatSessions from '@/components/widgets/chat-sessions.vue';
import ChatMessages from '@/components/widgets/chat-messages.vue';
import * as C from '@/libs/constants';
import api from '@/libs/api';
import log from '@/libs/log';
import values from '@/libs/values';
import SockJS from 'sockjs-client';
const props = defineProps({
  title: { type: String }
});
const attrs = computed(() => {
  const { ...itms } = useAttrs();
  return itms;
});
const { cast } = values;
const emit = defineEmits();
const ctx = reactive({
  chatSessions: [] as ChatSessionItem[],
  messages: [] as MessageItem[],
  socket: SockJS
});

const curl = new URL(location.href);
onMounted(async () => {
  // let socket: /* SockJS */ = C.UNDEFINED;
  const stomp = new Client({
    webSocketFactory: () => ctx.socket = cast(new window['SockJS'](`/api/ws`)),
    reconnectDelay: 5000,
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000,
    forceBinaryWSFrames: false,
    appendMissingNULLonIncoming: true,
    debug: (msg) => log.debug("MSG:", msg),    
  });
  stomp.onConnect = (v: IFrame) => {
    stomp.subscribe("/api/sub", msg => {
      log.debug("SUBSCRIBE:", msg);
    });
    stomp.publish({
      destination: "/api/pub/chat-session/test",
      headers: {},
      body: "{}"
    });
    log.debug('CONNECTED', v);
  }
  stomp.onStompError = (v) => { log.error('STOMP ERROR', v); }
  stomp.onDisconnect = (v) => { log.error('DISCONNECT', v); }
  stomp.onWebSocketClose = (v) => { log.info('WS CLOSE', v); }
  stomp.onWebSocketError = (v) => { log.error('WS ERROR', v); }
  stomp.activate();
  log.debug('START...');
});

</script>
<template>
  <main
    id="chat-main"
    v-bind="{ ...attrs }"
    >
    <ChatSessions
      :chat-sessions="ctx.chatSessions"
      />
    <ChatMessages
      :messages="ctx.messages"
      />
  </main>
</template>