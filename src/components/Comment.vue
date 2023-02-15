<script setup lang="ts">
import type { Comment as TComment, User } from '@prisma/client';
import { useAsyncState } from '@vueuse/core';
import { storeToRefs } from 'pinia';
import { computed, ref, toRefs } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
  createComment,
  deleteComment,
  toggleCommentLike,
  updateComment,
} from '../api/comment';
import { useMovieStore } from '../store/movie';
import { useUserStore } from '../store/user';
import { showError } from '../utils/ElMessage';

// Props
const props = defineProps<{
  comment: TComment & { user: User; likedByMe: boolean; likeCount: number };
}>();

const { comment } = toRefs(props);
const commentId = comment.value.id;

// State
const isEditing = ref(false);
const isReplying = ref(false);
const areChildrenHidden = ref(false);

// Hooks
const router = useRouter();
const route = useRoute();
const movieStore = useMovieStore();
const { movie } = storeToRefs(movieStore);
const childComments = computed(() => movieStore.commentsByParentId[commentId]);
const userStore = useUserStore();
const { user } = storeToRefs(userStore);

const createCommentState = useAsyncState(createComment, null, {
  immediate: false,
});
const updateCommentState = useAsyncState(updateComment, null, {
  immediate: false,
});
const deleteCommentState = useAsyncState(deleteComment, null, {
  immediate: false,
});
const toggleCommentLikeState = useAsyncState(toggleCommentLike, null, {
  immediate: false,
});

// Methods
function onCommentReply(content: string) {
  return createCommentState
    .execute(
      0,
      { content, parentId: commentId },
      { params: { id: String(movie.value.id) } }
    )
    .then(comment => {
      isReplying.value = false;
      movieStore.createLocalComment(comment);
    });
}

function onCommentUpdate(content: string) {
  return updateCommentState
    .execute(0, { content }, { params: { movieId: movie.value.id, commentId } })
    .then(comment => {
      isEditing.value = false;
      movieStore.updateLocalComment(commentId, comment.content);
    });
}

function onCommentDelete() {
  return deleteCommentState
    .execute(0, { params: { commentId, movieId: movie.value.id } })
    .then(comment => {
      if (comment) {
        movieStore.deleteLocalComment(comment.id);
      }
    });
}

function onToggleCommentLike() {
  return toggleCommentLikeState
    .execute(0, {
      params: { commentId, movieId: movie.value.id },
    })
    .then(response => {
      if (response) {
        const { addLike } = response;
        movieStore.toggleLocalCommentLike(commentId, addLike);
      } else if (toggleCommentLikeState.error.value) {
        showError((toggleCommentLikeState.error.value as any).data.message);

        router.push({
          path: '/signin',
          query: {
            fallback: encodeURIComponent(route.fullPath),
          },
        });
      }
    })
    .catch(err => {
      console.log(err);
    });
}
</script>

<template>
  <div class="p-2 rounded-lg border border-solid border-[#ccd0ff]">
    <div class="flex justify-between mb-1 text-xs text-[#8188d5]">
      <span class="font-bold">{{ comment.user?.name }}</span>
      <span>{{ comment.createdAt }}</span>
    </div>
    <CommentForm
      v-if="isEditing"
      autofocus
      :initial-value="comment.content"
      :loading="updateCommentState.isLoading.value"
      :error="updateCommentState.error"
      :on-submit="onCommentUpdate"
    />
    <div v-else class="mx-2 py-2 text-sm">{{ comment.content }}</div>
    <div class="flex mt-2">
      <el-link
        :disabled="toggleCommentLikeState.isLoading.value"
        @click="onToggleCommentLike"
        >{{ user && comment.likedByMe ? '取消' : '' }}点赞
        {{ comment.likeCount }}
      </el-link>
      <span class="mx-2">|</span>
      <el-link @click="isReplying = !isReplying">
        {{ isReplying ? '取消' : '' }}回复
      </el-link>
      <template v-if="user && comment.user.id === user.id">
        <span class="mx-2">|</span>
        <el-link @click="isEditing = !isEditing">
          {{ isEditing ? '取消' : '' }}编辑
        </el-link>
        <span class="mx-2">|</span>
        <el-link type="danger" @click="onCommentDelete">删除</el-link>
      </template>
    </div>
    <div v-if="deleteCommentState.error.value" class="text-[#ff5757] mt-1">
      {{ (deleteCommentState.error.value as any).data.message }}
    </div>
    <CommentForm
      v-if="isReplying"
      class="mt-1 ml-3"
      autofocus
      :on-submit="onCommentReply"
      :loading="createCommentState.isLoading.value"
      :error="createCommentState.error"
    />
  </div>
  <template v-if="childComments?.length > 0">
    <div class="flex" :class="{ hidden: areChildrenHidden }">
      <button
        class="border-none bg-none bg-transparent p-0 w-3 mt-2 relative cursor-pointer outline-none -translate-x-1/2 before:content-[''] before:absolute before:inset-y-0 -before:left-1/2 before:w-[1px] before:bg-[#9ca1de] hover:before:bg-[#3344ff]"
        @click="areChildrenHidden = true"
      />
      <div class="flex-1 pl-2">
        <CommentList :comments="childComments" />
      </div>
    </div>
    <div class="mt-1" :class="{ hidden: !areChildrenHidden }">
      <el-button @click="areChildrenHidden = false"> 展示回复 </el-button>
    </div>
  </template>
</template>

<style scoped></style>
