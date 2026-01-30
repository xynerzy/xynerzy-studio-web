<!--
@File        : toolbar.vue
@Author      : lupfeliz@gmail.com
@Since       : 2026-01-29
@Description : toolbar
@Site        : https://github.com/xynerzy
-->
<script setup lang="ts">
import { useAttrs, computed } from 'vue';
import { getResource } from '@/libs/media';
const props = defineProps();
const attrs = computed(() => {
  const { ...itms } = useAttrs();
  return itms;
});
</script>
<template>
  <nav
    id="toolbar"
    v-bind="{ ...attrs }"
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