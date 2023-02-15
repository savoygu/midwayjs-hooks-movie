<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { ref } from 'vue';
import {
  signIn as signInApi,
  signOut as signOutApi,
  signUp as signUpApi,
} from '../api/user';
import { useUserStore } from '../store/user';
import { showError, showSuccess } from '../utils/ElMessage';

// State
const q = ref('');
const openSignIn = ref(false);
const openSignUp = ref(false);

// Hooks
const userStore = useUserStore();
const { user } = storeToRefs(userStore);

// Methods
function resetSignIn() {
  openSignIn.value = false;
}
function resetSignUp() {
  openSignUp.value = false;
}
async function onSignOut() {
  try {
    await signOutApi();
    userStore.save(null);
    showSuccess('登出成功');
  } catch (err) {
    showError(err?.data?.message ?? '登出失败');
  }
}
</script>

<template>
  <div class="w-[1200px] mx-auto">
    <div class="page-header flex-1">
      <h1>电影首页</h1>
      <el-row>
        <el-col :span="8"><small>重度科幻迷</small></el-col>
        <el-col :span="16">
          <div class="flex justify-end">
            <el-input
              v-model="q"
              class="w-1/3 rounded-tr-none rounded-br-none"
            ></el-input>
            <el-button
              type="primary"
              class="w-20 rounded-tl-none rounded-bl-none"
            >
              搜索
            </el-button>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
  <div
    class="fixed inset-x-0 bottom-0 z-50 bg-[#f8f8f8] border-t border-solid border-[#e7e7e7]"
  >
    <el-row
      justify="space-between"
      align="middle"
      class="w-[1200px] mx-auto h-[50px]"
    >
      <a href="/" class="no-underline text-lg text-[#777]">重度科幻迷</a>
      <div class="text-sm text-[#777]">
        <template v-if="user">
          <span>欢迎您，{{ user.name }}</span>
          <span class="mx-1">|</span>
          <span class="cursor-pointer" @click="onSignOut">登出</span>
        </template>
        <template v-else>
          <span class="cursor-pointer" @click="openSignUp = true">注册</span>
          <span class="mx-2">|</span>
          <span class="cursor-pointer" @click="openSignIn = true">登录</span>
        </template>
      </div>
    </el-row>
  </div>
  <el-dialog v-model="openSignIn" title="登录" hide-footer>
    <SignInForm :on-reset="resetSignIn" :on-submit="signInApi" />
  </el-dialog>
  <el-dialog v-model="openSignUp" title="注册" hide-footer>
    <SignUpForm :on-reset="resetSignUp" :on-submit="signUpApi" />
  </el-dialog>
</template>

<style lang="scss" scoped>
.page-header {
  padding-bottom: 9px;
  margin: 40px 0 20px;
  border-bottom: 1px solid #eeeeee;
}
.navbar-default {
  background-color: #f8f8f8;
  border-color: #e7e7e7;
}
</style>
