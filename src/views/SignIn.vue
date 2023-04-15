<script setup lang="ts">
import type { User } from '@prisma/client';
import { useRoute, useRouter } from 'vue-router';
import { signIn as signInApi } from '../api/user';

// Hooks
const router = useRouter();
const route = useRoute();

function onSubmit(form: User) {
  return signInApi(form).then(response => {
    setTimeout(() => {
      const fullPath = route.query.fallback;
      router.push(fullPath ? decodeURIComponent(String(fullPath)) : '/');
    }, 1000);
    return response;
  });
}
</script>

<template>
  <div class="flex items-center h-screen">
    <ElRow class="w-full flex justify-center">
      <ElCol :span="8">
        <ElCard>
          <template #header>登录</template>
          <SignInForm :on-reset="() => router.back()" :on-submit="onSubmit" />
        </ElCard>
      </ElCol>
    </ElRow>
  </div>
</template>

<style scoped></style>
