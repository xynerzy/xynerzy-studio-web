<script setup lang="ts">
import { computed, onMounted, ref, useAttrs } from 'vue';
import { type MemberItem, type MessageItem } from '@/libs/chatting';

import ChatMembers from '@/components/widgets/chat-members.vue';
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
  members: [] as MemberItem[],
  messages: [] as MessageItem[]
});

onMounted(async () => {
  {
    const res = await api.post("member/list", {}, {});
    data.value.members = res;
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
    <ChatMembers
      :members="data.members"
      />
    <ChatMessages
      :messages="data.messages"
      />
  </main>
</template>