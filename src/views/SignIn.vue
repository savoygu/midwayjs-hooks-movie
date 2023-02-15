<script setup lang="ts">
import { useRouter } from 'vue-router';
import { signIn as signInApi } from '../api/user';

// Hooks
const router = useRouter();
</script>

<template>
  <div class="flex items-center h-screen">
    <el-row class="w-full flex justify-center">
      <el-col :span="8">
        <el-card>
          <template #header>注册</template>
          <SignInForm
            :on-reset="() => router.push('/')"
            :on-submit="signInApi"
          />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped></style>
