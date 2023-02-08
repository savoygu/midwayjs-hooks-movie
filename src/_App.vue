<script setup lang="ts">
import { createMovie } from './api/movie';

function addMovie() {
  createMovie({
    title: '流浪地球2',
    summary:
      '太阳即将毁灭，人类在地球表面建造出巨大的推进器，寻找新的家园。然而宇宙之路危机四伏，为了拯救地球，流浪地球时代的年轻人再次挺身而出，展开争分夺秒的生死之战。',
    poster:
      'https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2885955777.webp',
    doctor: '郭帆',
    year: 2023,
    country: '中国大陆',
    language: '汉语普通话',
  }).then(res => {
    console.log(res);
  });
}
</script>

<template>
  <div class="app">
    <h1 class="text-3xl font-bold underline">Hello world!</h1>
    <button @click="addMovie">添加</button>
  </div>
</template>

<style></style>
