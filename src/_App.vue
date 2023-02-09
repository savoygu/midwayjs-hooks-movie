<script setup lang="ts">
import { updateCategory } from './api/category';

function addMovie() {
  updateCategory({ id: 4, name: '喜剧 - 1' })
    .then(res => {
      console.log(res);
    })
    .catch(err => console.log(err));
}
</script>

<template>
  <div class="app">
    <h1 class="text-3xl font-bold underline">Hello world!</h1>
    <button @click="addMovie">添加</button>
  </div>
</template>

<style></style>
