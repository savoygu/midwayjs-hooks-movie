<script setup lang="ts">
import type { Category, Movie } from '@prisma/client';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { getCategoriesMovies } from '../api';

type EnhanceCategory = Pick<Category, 'id' | 'name'> & {
  movies: Movie[];
};

// State
const categories = ref<EnhanceCategory[]>([]);

// Hooks
const router = useRouter();

// Methods
getCategoriesMovies({ params: { id: 'all' } }).then(
  res => (categories.value = res)
);
</script>

<template>
  <div class="w-[1200px] mx-auto">
    <template v-for="item in categories" :key="item.id">
      <el-card class="mb-4" shadow="never">
        <template #header>
          <span
            class="cursor-pointer"
            @click="router.push({ path: '/search', query: { cid: item.id } })"
            >{{ item.name }}</span
          >
        </template>
        <el-row v-if="item.movies.length > 0" :gutter="16">
          <el-col v-for="movie in item.movies" :key="movie.id" :span="4">
            <el-image
              class="w-full rounded"
              src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"
              :alt="movie.title"
              fit="fill"
            ></el-image>
            <h5>{{ movie.title }}</h5>
            <el-button
              type="primary"
              @click="router.push({ name: 'Movie', params: { id: movie.id } })"
            >
              欢迎观看预告片
            </el-button>
          </el-col>
        </el-row>
        <p v-else class="text-center text-sm text-[#777]">暂无相关影片</p>
      </el-card>
    </template>
  </div>
</template>

<style lang="scss" scoped></style>
