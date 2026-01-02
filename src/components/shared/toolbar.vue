<script setup lang="ts">
import { useAttrs, computed } from 'vue';
const props = defineProps();
const attrs = computed(() => {
  const { ...itms } = useAttrs();
  return itms;
});
const getResource = (pth: string) => new URL(pth, import.meta.url).href;
</script>
<template>
  <nav
    id="toolbar"
    v-bind="{ ...props, ...attrs }"
    >
    <div class="menu-item">
      <img class="avatar" :src="getResource('/images/test.svg')" />
    </div>
    <div class="menu-item">
      <i class="icon user"></i>
    </div>
    <div class="menu-item">
      <i class="icon sms"></i>
    </div>
    <div class="menu-item">
      <i class="icon services"></i>
    </div>
    <!--
    <div class="menu-item sub">⭐</div>
    <div class="menu-item sub">📁</div>
    <div class="menu-item sub">🔔</div>
    -->
    <div class="menu-item main-menu"><i class="icon main-menu"></i></div>    
  </nav>
</template>