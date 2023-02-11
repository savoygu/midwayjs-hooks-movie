<script setup lang="ts">
import { getSearchMovies } from './api';

function addMovie() {
  getSearchMovies({ query: { q: 'abc' } })
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
