<!--
@File        : chat-sessions.vue
@Author      : lupfeliz@gmail.com
@Since       : 2026-01-29
@Description : Chatting Session view
@Site        : https://github.com/xynerzy
-->
<script setup lang="ts">
import { computed, ref, useAttrs } from 'vue';
import { getResource } from '@/libs/media';
import { type ChatSessionItem } from '@/libs/chatting';

const props = defineProps({
  chatSessions: { type: Array<ChatSessionItem> }
});
const attrs = computed(() => {
  const { ...itms } = useAttrs();
  return itms;
});
const data = ref({
  chatSessions: computed(() => props.chatSessions)
});
const emit = defineEmits();
</script>
<template>
  <section
    id="chat-sessions"
    v-bind="{ ...attrs }"
    >
    <dl>
      <!--[ SESSION-ITEM -->
      <dd
        v-for="(itm, inx) in data.chatSessions"
        :class="{
          'session-item': true,
        }"
        >
        <div
          :class="{
            'member-avatar': true,
            'group': itm.members.length > 1,
          }"
          >
          <img
            v-for="(avatar, inx) in itm.members"
            :class="{
              'avatar': true,
              'inactive': !(itm.active),
            }"
            :src="getResource(avatar)"
            alt="username"
            />
          <span
            v-if="itm.online && itm.members.length < 2"
            class="status-online"
            >
          </span>
        </div>
        <div class="chat-session-info">
          <h4 class="chat-session-name"> {{ itm.name }} </h4>
          <p class="chat-session-intro"> {{ itm.intro  }} </p>
        </div>
        <div class="chat-session-meta">
          <span class="last-updated"> {{ itm.updated }} </span>
          <span
            v-if="itm.unread"
            class="unread-count"
            >
            {{ itm.unread }}
          </span>
        </div>
      </dd>
      <!--] SESSION-ITEM -->
    </dl>
  </section>
</template>