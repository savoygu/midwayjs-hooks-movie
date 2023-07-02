<script setup lang="ts">
import { RouterView } from 'vue-router';
import zhCn from 'element-plus/dist/locale/zh-cn.mjs';
const locale = zhCn;
</script>

<template>
  <ElConfigProvider size="default" :z-index="3000" :locale="locale">
    <div class="app">
      <RouterView v-slot="{ Component }">
        <component :is="Component" class="pb-16" />
      </RouterView>
    </div>
  </ElConfigProvider>
</template>
