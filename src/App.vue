<script setup lang="ts">
import { RouterView } from 'vue-router';
</script>

<template>
  <el-config-provider size="default" :z-index="3000">
    <div class="app">
      <Header />
      <RouterView v-slot="{ Component }">
        <component :is="Component" class="pb-16" />
      </RouterView>
    </div>
  </el-config-provider>
</template>

<style></style>
