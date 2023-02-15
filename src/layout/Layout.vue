<script setup lang="ts"></script>

<template>
  <Header />
  <RouterView v-slot="{ Component }">
    <component :is="Component" class="pb-16" />
  </RouterView>
</template>

<style scoped></style>
