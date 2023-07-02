<template>
  <Header />
  <RouterView v-slot="{ Component }">
    <component :is="Component" class="pb-16" />
  </RouterView>
</template>
