<script setup lang="ts">
import type { Comment as TComment, User } from '@prisma/client';

const props = defineProps<{
  comments: (TComment & {
    user: User;
    likedByMe: boolean;
    likeCount: number;
  })[];
}>();
</script>

<template>
  <div v-for="comment in props.comments" :key="comment.id" class="my-2">
    <Comment :comment="comment" />
  </div>
</template>

<style scoped></style>
