<script setup lang="ts">
import { reactive, ref } from 'vue';
import { storeToRefs } from 'pinia';
import type { FormInstance, FormRules } from 'element-plus';
import { ElMessage } from 'element-plus';
import {
  signIn as signInApi,
  signOut as signOutApi,
  signUp as signUpApi,
} from '../api/user';
import { useUserStore } from '../store/user';

// State
const q = ref('');
const openSignIn = ref(false);
const signInFormRef = ref<FormInstance>();
const signInForm = reactive({
  name: '',
  password: '',
});
const openSignUp = ref(false);
const signUpFormRef = ref<FormInstance>();
const signUpForm = reactive({
  name: '',
  password: '',
  repassword: '',
});

const validateRepassword = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('确认密码不能为空'));
  } else if (value !== signInForm.password) {
    callback(new Error('确认密码与密码不一致'));
  } else {
    callback();
  }
};

const rules = {
  name: [
    { required: true, message: '用户名不能为空', trigger: 'blur' },
    {
      min: 4,
      max: 12,
      message: '用户名长度必须在 4 到 12 之间',
      trigger: 'blur',
    },
  ],
  password: [
    { required: true, message: '密码不能为空', trigger: 'blur' },
    {
      min: 6,
      max: 20,
      message: '密码长度必须在 6 到 20 之间',
      trigger: 'blur',
    },
  ],
};
const signInRules = reactive<FormRules>(rules);
const signUpRules = reactive<FormRules>({
  ...rules,
  repassword: [{ validator: validateRepassword, trigger: 'blur' }],
});

// Hooks
const userStore = useUserStore();
const { user } = storeToRefs(userStore);

// Methods
const showError = (message: string) => {
  ElMessage({ message, type: 'error' });
};
const showSuccess = (message: string) => {
  ElMessage({ message, type: 'success' });
};
async function submitSignIn() {
  signInFormRef.value.validate(async valid => {
    if (valid) {
      try {
        const user = await signInApi(signInForm);
        // save user to store
        userStore.save(user);
        showSuccess('登录成功');
        resetSignIn();
      } catch (err) {
        console.log(err);
        showError(err?.data?.message ?? '登录失败');
      }
    } else {
      return false;
    }
  });
}
function resetSignIn() {
  openSignIn.value = false;
}
async function submitSignUp() {
  signUpFormRef.value.validate(async valid => {
    if (valid) {
      try {
        const { repassword: _, ...needSubmitForm } = signUpForm;
        await signUpApi(needSubmitForm);
        showSuccess('注册成功');
        resetSignUp();
      } catch (err) {
        console.log(err);
        showError(err?.data?.message ?? '注册失败');
      }
    } else {
      return false;
    }
  });
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
    <el-form
      ref="signInFormRef"
      :model="signInForm"
      :rules="signInRules"
      label-width="120px"
      class="overflow-hidden"
    >
      <el-form-item label="用户名" prop="name">
        <el-input v-model="signInForm.name"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="signInForm.password" type="password"></el-input>
      </el-form-item>
      <div class="float-right">
        <el-button class="mr-2" :class="resetSignIn">关闭</el-button>
        <el-button type="primary" @click="submitSignIn">提交</el-button>
      </div>
    </el-form>
  </el-dialog>
  <el-dialog v-model="openSignUp" title="注册" hide-footer>
    <el-form
      ref="signUpFormRef"
      :model="signUpForm"
      :rules="signUpRules"
      label-width="120px"
      class="overflow-hidden"
    >
      <el-form-item label="用户名" prop="name">
        <el-input v-model="signUpForm.name"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input
          v-model="signUpForm.password"
          type="password"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="repassword">
        <el-input v-model="signUpForm.repassword" type="password"></el-input>
      </el-form-item>
      <div class="float-right">
        <el-button class="mr-2" @click="resetSignUp">关闭</el-button>
        <el-button type="primary" @click="submitSignUp">提交</el-button>
      </div>
    </el-form>
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
