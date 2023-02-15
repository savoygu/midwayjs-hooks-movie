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
    <el-row class="w-full flex justify-center">
      <el-col :span="8">
        <el-card>
          <template #header>登录</template>
          <SignInForm :on-submit="onSubmit" />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped></style>
