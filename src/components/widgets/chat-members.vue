<script setup lang="ts">
import { computed, ref, useAttrs } from 'vue';
const props = defineProps({
  members: { type: Array }
});
const attrs = computed(() => {
  const { ...itms } = useAttrs();
  return itms;
});
const emit = defineEmits();
const getResource = (pth: string) => new URL(pth, import.meta.url).href;
</script>
<template>
  <section
    id="chat-members"
    v-bind="{ ...props, ...attrs }"
    >
    <div>
      <!--[ MEMBER-ITEM -->
      <div class="member-item">
        <div class="member-avatar">
          <img class="avatar" :src="getResource('/images/test.svg')" alt="username" />
          <span class="status-online"></span>
        </div>
        <div class="member-info">
          <h4 class="member-name">홍길동</h4>
          <p class="member-intro">안녕하세요! 오늘 하루도 화이팅하세요. 😊</p>
        </div>
        <div class="member-meta">
          <span class="last-updated">오후 2:30</span>
          <div class="unread-count">5</div>
        </div>
      </div>
      <!--] MEMBER-ITEM -->
      <!--[ MEMBER-ITEM -->
      <div class="member-item">
        <div class="member-avatar group">
          <img class="avatar" :src="getResource('/images/test.svg')" alt="username" />
          <img class="avatar" :src="getResource('/images/test.svg')" alt="username" />
          <!--
          <img class="avatar" :src="getResource('/images/test.svg')" alt="username" />
          <img class="avatar" :src="getResource('/images/test.svg')" alt="username" />
          -->
        </div>
        <div class="member-info">
          <h4 class="member-name">정산방</h4>
          <p class="member-intro">정산합시다</p>
        </div>
        <div class="member-meta">
          <span class="last-updated">오후 2:30</span>
          <div class="unread-count">1</div>
        </div>
      </div>
      <!--] MEMBER-ITEM -->
    </div>
  </section>
</template>