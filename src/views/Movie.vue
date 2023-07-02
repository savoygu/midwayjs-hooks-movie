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
    .then(comment => {
      if (comment) {
        movieStore.createLocalComment(comment);
      }
    });
}
</script>

<template>
  <div class="w-[1200px] mx-auto">
    <ElRow :gutter="16">
      <ElCol :span="16">
        <div class="w-[720px] h-[600px] flex items-center">
          <video :src="movie.flash" class="w-full mb-4" controls></video>
        </div>
        <ElCard shadow="never">
          <template #header>评论区</template>
          <CommentForm
            :loading="createCommentState.isLoading.value"
            :error="createCommentState.error.value"
            :on-submit="onCommentCreate"
          />
          <div
            v-if="rootComments != null && rootComments.length > 0"
            class="mt-4"
          >
            <CommentList :comments="rootComments" />
          </div>
        </ElCard>
      </ElCol>
      <ElCol :span="8">
        <div class="flex flex-col leading-8 text-sm">
          <span>电影名字：{{ movie.title }}</span>
          <span>导演：{{ movie.doctor }}</span>
          <span>国家：{{ movie.country }}</span>
          <span>语言：{{ movie.language }}</span>
          <span>上映年份：{{ movie.year }}</span>
          <span>简介：{{ movie.summary }}</span>
        </div>
      </ElCol>
    </ElRow>
  </div>
</template>
