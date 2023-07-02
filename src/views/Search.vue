<script setup lang="ts">
import type { Movie } from '@prisma/client';
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getSearchMovies } from '../api';
import { PAGE_SIZE } from '../utils/constant';

interface SearchResult {
  name: string;
  movies: Movie[];
  total: number;
}

// State
const searchResult = ref<SearchResult>({
  name: '',
  movies: [],
  total: 0,
});

// Hooks
const router = useRouter();
const route = useRoute();
const page = ref(1);
const size = ref(PAGE_SIZE);

watch(
  () => route.query.q,
  () => {
    resetPage();
    getMovies(1, size.value);
  },
  { immediate: true }
);

function resetPage() {
  page.value = 1;
  size.value = PAGE_SIZE;
}

function handleSizeChange(size: number) {
  resetPage();
  getMovies(1, size);
}
function handleCurrentChange(page: number) {
  getMovies(page, size.value);
}
function getMovies(page: number, size: number) {
  getSearchMovies({
    query: {
      ...(route.query.cid ? { cid: String(route.query.cid) } : {}),
      q: String(route.query.q),
      page: String(page),
      size: String(size),
    },
  }).then(res => (searchResult.value = res));
}
</script>

<template>
  <div class="w-[1200px] mx-auto">
    <ElCard shadow="never">
      <template #header>{{ searchResult.name }}</template>
      <template v-if="searchResult.movies.length > 0">
        <ElRow :gutter="16">
          <ElCol v-for="movie in searchResult.movies" :key="movie.id" :span="4">
            <ElImage
              class="w-full rounded"
              src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"
              :alt="movie.title"
              fit="fill"
            ></ElImage>
            <h5>{{ movie.title }}</h5>
            <ElButton
              type="primary"
              @click="router.push({ name: 'Movie', params: { id: movie.id } })"
            >
              欢迎观看预告片
            </ElButton>
          </ElCol>
        </ElRow>
        <ElPagination
          v-model:current-page="page"
          class="mt-4"
          :page-size="size"
          :page-sizes="[10, 20, 30, 40]"
          layout="total, prev, pager, next"
          background
          :total="searchResult.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </template>
      <p v-else class="text-center text-sm text-[#777]">暂无相关影片</p>
    </ElCard>
  </div>
</template>
