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
import { Client, IFrame, Stomp, StompSubscription } from '@stomp/stompjs';

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
  sessions: [] as ChatSessionItem[],
  messages: [] as MessageItem[],
  socket: SockJS,
  chatSubs: C.UNDEFINED as StompSubscription,
  sessionSubs: C.UNDEFINED as StompSubscription
});

const curl = new URL(location.href);
onMounted(async () => {
  const userId = '1234';
  const sessionId = '5678';
  const auth: any = { };
  auth[C.AUTHORIZATION] = `${userId}:${sessionId}`;
  /* auth[C.AUTHORIZATION] = await api.post(...); */
  /* SockJS is Not Compatable, so I include it from ext */
  const stomp = new Client({
    webSocketFactory: () => ctx.socket = cast(new window['SockJS'](`/api/ws`)),
    reconnectDelay: 5000,
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000,
    forceBinaryWSFrames: false,
    appendMissingNULLonIncoming: true,
    connectHeaders: Object.assign({}, auth),
    debug(v) { log.debug('MSG:', v); },
    onStompError(v) { log.error('STOMP ERROR', v); },
    onDisconnect(v) { log.error('DISCONNECT', v); },
    onWebSocketClose(v) { log.info('WS CLOSE', v); },
    onWebSocketError(v) { log.error('WS ERROR', v); },
    onConnect(v) {
      log.debug('CONNECTED', v, ctx.socket);
      ctx.sessionSubs = stomp.subscribe(`/api/sub/session/${userId}`, msg => {
        ctx.sessions = JSON.parse(msg.body);
        log.debug('SUBSCRIBE-SESSION:', msg.body);
      });
      ctx.chatSubs = stomp.subscribe(`/api/sub/chat/${sessionId}`, msg => {
        ctx.messages = JSON.parse(msg.body);
        log.debug('SUBSCRIBE-CHAT:', msg.body);
      });
      stomp.publish({
        destination: `/api/pub/session/${userId}`,
        headers: {},
        body: '{}'
      });
      stomp.publish({
        destination: `/api/pub/chat/${sessionId}`,
        headers: {},
        body: '{}'
      });
    },
  });
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
      :chat-sessions="ctx.sessions"
      />
    <ChatMessages
      :messages="ctx.messages"
      />
  </main>
</template>