<script setup lang="ts">
import { computed, ref, useAttrs } from 'vue';
const props = defineProps({
  messages: { type: Array }
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
    id="chat-messages"
    v-bind="{ ...props, ...attrs }"
    >
    <dl class="chat-container">
      <!--[ MESSAGE-ITEM -->
      <dd class="message-row their-message">
        <div class="message-avatar">
          <img class="avatar" :src="getResource('/images/test.svg')" alt="username" />
        </div>
        <div class="message-content">
          <h4 class="member-name">홍길동</h4>
          <div class="bubble-group">
            <p class="message-detail">
              안녕하세요! 오늘 하루도 화이팅하세요. <br />
              안녕하세요! 오늘 하루도 화이팅하세요. <br />
              안녕하세요! 오늘 하루도 화이팅하세요. <br />
              안녕하세요! 오늘 하루도 화이팅하세요. <br />
              안녕하세요! 오늘 하루도 화이팅하세요. <br />
              안녕하세요! 오늘 하루도 화이팅하세요. <br />
              안녕하세요! 오늘 하루도 화이팅하세요. <br />
              안녕하세요! 오늘 하루도 화이팅하세요. <br />
              안녕하세요! 오늘 하루도 화이팅하세요. <br />
              안녕하세요! 오늘 하루도 화이팅하세요. <br />
              안녕하세요! 오늘 하루도 화이팅하세요. <br />
              안녕하세요! 오늘 하루도 화이팅하세요. <br />
            </p>
            <dl class="message-meta">
              <dd class="message-time">오후 2:30</dd>
              <dd class="unread-count">999</dd>
            </dl>
          </div>
        </div>
      </dd>
      <!--] MESSAGE-ITEM -->
      <!--[-->
      <!--
      <div class="chat-container">
        <div class="message-row their-message">
          <div class="message-avatar">
            <img src="@/assets/images/user-1.jpg" alt="Jane" />
          </div>
          
          <div class="message-content">
            <span class="user-name">Jane Doe</span>
          </div>
        </div>

        <div class="message-row my-message">
          <div class="bubble-group">
            <div class="message-bubble">네, 아바타가 나오니까 훨씬 보기 좋네요!</div>
            <span class="message-time">오후 2:16</span>
          </div>
        </div>
      </div>
      -->
      <!--]-->
    </dl>
  </section>
</template>