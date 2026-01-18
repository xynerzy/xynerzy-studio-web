<script setup lang="ts">
import { computed, ref, useAttrs } from 'vue';
import { type MemberItem, type MessageItem } from '@/libs/chatting';

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

const data = ref({
  members: [] as MemberItem[],
  messages: [] as MessageItem[]
});

data.value.members = [
  {
    name: 'tester',
    intro: 'hello!',
    members: [
      '/images/test.svg'
    ],
    active: true,
    online: true,
    updated: 'PM 01:10',
    unread: 1
  },
  {
    name: 'tester-group',
    intro: 'work group',
    members: [
      '/images/test.svg',
      '/images/test.svg',
      '/images/test.svg',
      '/images/test.svg',
    ],
    active: true,
    online: true,
    updated: 'PM 01:10'
  }
];
data.value.messages = [
  {
    type: 'my',
    content: 'hi ! whatsup!?',
    time: 'PM 01:10',
    userId: 'tester',
    unread: 1
  },
  {
    type: 'their',
    content: 'Nothing special. How about you?',
    avatar: '/images/test.svg',
    time: 'PM 01:10',
    userId: 'tester',
    unread: 1
  }
];

</script>
<template>
  <main
    id="chat-main"
    v-bind="{ ...props, ...attrs }"
    >
    <ChatMembers
      :members="data.members"
      />
    <ChatMessages
      :messages="data.messages"
      />
  </main>
</template>