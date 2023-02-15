<script setup lang="ts">
import { useRoute } from 'vue-router';
import { computed } from 'vue';
import { useAsyncState } from '@vueuse/core';
import { useMovieStore } from '../store/movie';
import { createComment } from '../api/comment';

// Hooks
const route = useRoute();
const id = route.params.id;
const movieStore = useMovieStore();
const movie = computed(() => movieStore.movie);
const rootComments = computed(() => movieStore.rootComments);
const createCommentState = useAsyncState(createComment, null, {
  immediate: false,
});

// Methods
movieStore.getMovie(String(id));

function onCommentCreate(content: string) {
  return createCommentState
    .execute(0, { content }, { params: { id } })
    .then(movieStore.createLocalComment);
}
</script>

<template>
  <div class="w-[1200px] mx-auto">
    <el-row :gutter="16">
      <el-col :span="16">
        <video
          :src="movie.flash"
          width="720"
          height="600"
          class="mx-auto"
        ></video>
        <el-card shadow="never">
          <template #header>评论区</template>
          <CommentForm
            :loading="createCommentState.isLoading.value"
            :error="createCommentState.error"
            :on-submit="onCommentCreate"
          />
          <div
            v-if="rootComments != null && rootComments.length > 0"
            class="mt-4"
          >
            <CommentList :comments="rootComments" />
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <div class="flex flex-col leading-8">
          <span>电影名字：{{ movie.title }}</span>
          <span>导演：{{ movie.doctor }}</span>
          <span>国家：{{ movie.country }}</span>
          <span>语言：{{ movie.language }}</span>
          <span>上映年份：{{ movie.year }}</span>
          <span>简介：{{ movie.summary }}</span>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped></style>