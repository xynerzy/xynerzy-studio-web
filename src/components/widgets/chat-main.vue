<script setup lang="ts">
import { ref, useAttrs } from 'vue'
import * as vue from 'vue'
import { } from 'axios'
const prop = defineProps({
  title: { type: String }
})
const attrs = useAttrs();
const emit = defineEmits();

</script>
<template>
  <div id="chat-main">
    <div style="height: 1000rem">
    </div>
  </div>
</template>