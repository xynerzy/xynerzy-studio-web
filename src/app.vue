<script setup lang="ts">
import Header from '@/components/shared/header.vue';
import Footer from '@/components/shared/footer.vue';
import InitialSettings from '@/components/widgets/initial-settings.vue';
import ChatMain from '@/components/widgets/chat-main.vue';
import Toolbar from '@/components/shared/toolbar.vue';
</script>
<template>
  <Header />
  <main>
    <ChatMain />
    <Toolbar />
  </main>
  <Footer />
</template>