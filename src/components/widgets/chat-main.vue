<script setup lang="ts">
import { ref, useAttrs } from 'vue'
import * as vue from 'vue'
import { } from 'axios'
import { debounce, throttle } from 'lodash'
const prop = defineProps({
  title: { type: String }
})
const attrs = useAttrs();
const emit = defineEmits();

</script>
<template>
  <div id="chat-main">
  </div>
</template>