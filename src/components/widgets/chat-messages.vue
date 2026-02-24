<!--
@File        : chat-messages.vue
@Author      : lupfeliz@gmail.com
@Since       : 2026-01-29
@Description : Chatting Message view
@Site        : https://github.com/xynerzy
-->
<script setup lang="ts">
import { computed, getCurrentInstance, nextTick, onMounted, reactive, ref, useAttrs } from 'vue';
import { getResource } from '@/libs/media';
import { type MessageItem } from '@/libs/chatting';
import { Client } from '@stomp/stompjs';
import log from '@/libs/log';

const props = defineProps({
  messages: { type: Array<MessageItem> },
  mainContext: {  } as any
});
const attrs = computed(() => {
  const { ...itms } = useAttrs();
  return itms;
});

const self = getCurrentInstance();

const ctx = reactive({
  userId: '',
  messages: computed(() => props.messages),
  inputElement: {} as Element,
  sendChatMessage(e?: Event) {
    let content =  ctx.inputElement.innerHTML;
    content = content.replaceAll(/<br[ \t\r\n\\/]*>/gm, '\n');
    log.debug('CHECK:', content);
    if (content) {
      props.mainContext.stomp.publish({
        destination: `/api/pub/chat/${props.mainContext.userInfo.sessionId}`,
        headers: {},
        body: JSON.stringify({
          content: content
        })
      });
      ctx.inputElement.innerHTML = '';
    }
  },
  handleKeyboard(e: KeyboardEvent) {
    switch (e.key) {
    case 'Enter': {
      if (e.type === 'keyup') {
        log.debug("CHECK:", e, ctx.inputElement);
        ctx.sendChatMessage();
      }
    } break;
    default: }
  }
});
onMounted(async () => {
  ctx.inputElement = self?.refs?.inputElement as Element;
});
const emit = defineEmits();
</script>
<template>
  <section
    id="chat-messages"
    v-bind="{ ...attrs }"
    >
    <dl class="chat-container">
      <!--[ MESSAGE-ITEM -->
      <dd
        v-for="(itm, inx) in ctx.messages"
        :class="{
          'message-row': true,
          'sys-message' : itm.type === 'sys',
          'their-message': itm.type === 'their',
          'my-message': itm.type === 'my',
        }"
        >
        <template v-if="itm && itm.type === 'sys'">
          <div class="message-content">
            <p v-html="itm.content"></p>
          </div>
        </template>
        <template v-if="itm && itm.type === 'my'">
          <div class="message-content">
            <div class="bubble-group">
              <dl class="message-meta">
                <dd class="message-time">{{ itm.time }}</dd>
                <dd
                  v-if="itm.unread"
                  class="unread-count"
                  >
                  {{ itm.unread }}
                </dd>
              </dl>
              <div class="message-detail">
                <p v-html="itm.content"></p>
              </div>
            </div>
          </div>
        </template>
        <template v-if="itm && itm.type === 'their'">
          <div class="message-avatar">
            <img
              class="avatar"
              :src="getResource(itm.avatar)"
              alt="username"
              />
          </div>
          <div class="message-content">
            <h4 class="member-name">{{ itm.userId }}</h4>
            <div class="bubble-group">
              <div class="message-detail">
                <p v-html="itm.content"></p>
              </div>
              <dl class="message-meta">
                <dd class="message-time">{{ itm.time }}</dd>
                <dd
                  v-if="itm.unread"
                  class="unread-count"
                  >
                  {{ itm.unread }}
                </dd>
              </dl>
            </div>
          </div>
        </template>
      </dd>
      <!--] MESSAGE-ITEM -->
    </dl>
    <div class="chat-input-wrap">
      <p
        ref="inputElement"
        @keydown="ctx.handleKeyboard"
        @keyup="ctx.handleKeyboard"
        contenteditable
        ></p>
      <button
        @click="ctx.sendChatMessage"
        >
      </button>
    </div>
  </section>
</template>