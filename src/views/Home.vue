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
      <ElCard class="mb-4" shadow="never">
        <template #header>
          <span
            class="cursor-pointer"
            @click="router.push({ path: '/search', query: { cid: item.id } })"
            >{{ item.name }}</span
          >
        </template>
        <ElRow v-if="item.movies.length > 0" :gutter="16">
          <ElCol v-for="movie in item.movies" :key="movie.id" :span="4">
            <ElImage
              class="w-full rounded max-h-[160px]"
              :src="movie.poster"
              :alt="movie.title"
              fit="fill"
              @error="
                () =>
                  (movie.poster =
                    'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg')
              "
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
        <p v-else class="text-center text-sm text-[#777]">暂无相关影片</p>
      </ElCard>
    </template>
  </div>
</template>

<style lang="scss" scoped></style>
