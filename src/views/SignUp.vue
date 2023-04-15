<script setup lang="ts">
import { useRouter } from 'vue-router';
import { signUp as signUpApi } from '../api/user';

// Hooks
const router = useRouter();
</script>

<template>
  <div class="flex items-center h-screen">
    <ElRow class="w-full flex justify-center">
      <ElCol :span="8">
        <ElCard>
          <template #header>注册</template>
          <SignUpForm
            :on-reset="() => router.push('/')"
            :on-submit="signUpApi"
          />
        </ElCard>
      </ElCol>
    </ElRow>
  </div>
</template>

<style scoped></style>
