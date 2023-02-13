<script setup lang="ts">
import { RouterView } from 'vue-router';
</script>

<template>
  <div class="app">
    <Header />
    <RouterView v-slot="{ Component }">
      <component :is="Component" />
    </RouterView>
  </div>
</template>

<style></style>
