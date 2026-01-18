<script setup lang="ts">
import { computed, ref, useAttrs } from 'vue';
import { getResource } from '@/libs/media';
import { type MemberItem } from '@/libs/chatting';

const props = defineProps({
  members: { type: Array<MemberItem> }
});
const attrs = computed(() => {
  const { ...itms } = useAttrs();
  return itms;
});
const data = ref({
  members: computed(() => props.members)
});
const emit = defineEmits();
</script>
<template>
  <section
    id="chat-members"
    v-bind="{ ...props, ...attrs }"
    >
    <dl>
      <!--[ MEMBER-ITEM -->
      <dd
        v-for="(itm, inx) in data.members"
        :class="{
          'member-item': true,
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
        <div class="member-info">
          <h4 class="member-name"> {{ itm.name }} </h4>
          <p class="member-intro"> {{ itm.intro  }} </p>
        </div>
        <div class="member-meta">
          <span class="last-updated"> {{ itm.updated }} </span>
          <span
            v-if="itm.unread"
            class="unread-count"
            >
            {{ itm.unread }}
          </span>
        </div>
      </dd>
      <!--] MEMBER-ITEM -->
    </dl>
  </section>
</template>