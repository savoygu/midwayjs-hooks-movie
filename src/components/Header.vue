<script setup lang="ts">
import type { User } from '@prisma/client';
import { storeToRefs } from 'pinia';
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
  signIn as signInApi,
  signOut as signOutApi,
  signUp as signUpApi,
} from '../api/user';
import { useUserStore } from '../store/user';
import { showError, showSuccess } from '../utils/message';

// State
const openSignIn = ref(false);
const openSignUp = ref(false);

// Hooks
const router = useRouter();
const route = useRoute();
const title = computed(() => route.meta.title);
const userStore = useUserStore();
const { user, q } = storeToRefs(userStore);

// Methods
function handleSearch() {
  router.push({ path: '/search', query: { q: q.value } });
}
function onSubmit(form: User) {
  return signInApi(form).then(response => {
    setTimeout(() => {
      location.reload();
    }, 500);
    return response;
  });
}
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
    setTimeout(() => {
      location.reload();
    }, 500);
  } catch (err) {
    showError(err?.data?.message ?? '登出失败');
  }
}
</script>

<template>
  <div class="w-[1200px] mx-auto">
    <div class="page-header flex-1">
      <h2>{{ title }}</h2>
      <ElRow>
        <ElCol :span="8"><small>重度科幻迷</small></ElCol>
        <ElCol :span="16">
          <div class="flex justify-end">
            <div class="w-1/3 rounded-tr-none rounded-br-none">
              <ElInput v-model="q"></ElInput>
            </div>
            <ElButton
              type="primary"
              class="w-20 rounded-tl-none rounded-bl-none"
              @click="handleSearch"
            >
              搜索
            </ElButton>
          </div>
        </ElCol>
      </ElRow>
    </div>
  </div>
  <div
    class="fixed inset-x-0 bottom-0 z-50 bg-[#f8f8f8] border-t border-solid border-[#e7e7e7]"
  >
    <ElRow
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
    </ElRow>
  </div>
  <ElDialog v-model="openSignIn" title="登录" hide-footer>
    <SignInForm :on-reset="resetSignIn" :on-submit="onSubmit" />
  </ElDialog>
  <ElDialog v-model="openSignUp" title="注册" hide-footer>
    <SignUpForm :on-reset="resetSignUp" :on-submit="signUpApi" />
  </ElDialog>
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
