<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import type { ComputedRef } from 'vue';
import { useToast } from 'bootstrap-vue-next';
import { storeToRefs } from 'pinia';
import { signIn, signUp } from '../api/user';
import { useUserStore } from '../store/user';

interface SignForm {
  name: string;
  password: string;
}

type FullSignForm = SignForm & { repassword: string };

// State
const q = ref('');
const openSignIn = ref(false);
const openSignUp = ref(false);
const signInForm = reactive({
  name: '',
  password: '',
});
const signUpForm = reactive({
  name: '',
  password: '',
  repassword: '',
});
const showError = ref(false);

// Hooks
const toast = useToast();
const showDanger = (title: string) => {
  toast.show({ title }, { pos: 'top-center', variant: 'danger' });
};
const showSuccess = (title: string) => {
  toast.show({ title }, { pos: 'top-center', variant: 'success' });
};
const userStore = useUserStore();
const { user } = storeToRefs(userStore);

// Computed
const validateName = (signForm: SignForm) => {
  return computed(() => {
    return signForm.name.length > 3 && signForm.name.length < 13; // [4, 12]
  });
};
const validatePassword = (signForm: SignForm) => {
  return computed(() => {
    return signForm.password.length > 5 && signForm.password.length < 21; // [6, 20]
  });
};
const validateRepassword = (signForm: FullSignForm) => {
  return computed(() => {
    return signForm.repassword === signForm.password; // [6, 20]
  });
};

const validationSignIn = reactive<Record<string, ComputedRef<boolean>>>({
  name: validateName(signInForm),
  password: validatePassword(signInForm),
});
const validationSignUp = reactive<Record<string, ComputedRef<boolean>>>({
  name: validateName(signUpForm),
  password: validatePassword(signUpForm),
  repassword: validateRepassword(signUpForm),
});

// Methods
async function onSignInSubmit() {
  const hasError = (showError.value = Object.values(validationSignIn).some(
    v => !v
  ));
  if (hasError) {
    return;
  }

  try {
    const user = await signIn(signInForm);
    // save user to store
    userStore.save(user);
    showSuccess('登录成功');
    onSignInReset();
  } catch (err) {
    console.log(err);
    showDanger(err?.data?.message ?? '登录失败');
  }
}
function onSignInReset() {
  showError.value = false;
  openSignIn.value = false;
}
async function onSignUpSubmit() {
  const hasError = (showError.value = Object.values(validationSignUp).some(
    v => !v
  ));
  if (hasError) {
    return;
  }

  try {
    const { repassword: _, ...needSubmitForm } = signUpForm;
    await signUp(needSubmitForm);
    showSuccess('注册成功');
    onSignUpReset();
  } catch (err) {
    console.log(err);
    showDanger(err?.data?.message ?? '注册失败');
  }
}
function onSignUpReset() {
  showError.value = false;
  openSignUp.value = false;
}
</script>

<template>
  <b-container
    :toast="{ root: true }"
    fluid="sm"
    position="position-fixed"
    style="top: 50px; left: -200px; z-index: 2000"
  ></b-container>
  <b-container>
    <div class="page-header">
      <b-row>
        <h4>电影首页</h4>
        <b-col cols="4"><small>重度科幻迷</small></b-col>
        <b-col cols="8">
          <b-form>
            <b-form-group class="col-6 float-end">
              <div class="d-flex">
                <b-form-input
                  v-model="q"
                  class="rounded-tr-none rounded-br-none"
                ></b-form-input>
                <b-button
                  variant="primary"
                  class="w-20 rounded-tl-none rounded-bl-none"
                >
                  搜索
                </b-button>
              </div>
            </b-form-group>
          </b-form>
        </b-col>
      </b-row>
    </div>
  </b-container>
  <b-navbar :container="false" fixed="bottom" class="navbar-default">
    <b-container>
      <a href="" class="navbar-brand text-lg">重度科幻迷</a>
      <div class="navbar-text text-sm">
        <template v-if="user">
          <span>欢迎您，{{ user.name }}</span>
          <span class="mx-1">|</span>
          <span>登出</span>
        </template>
        <template v-else>
          <span class="cursor-pointer" @click="openSignUp = true">注册</span>
          <span class="mx-1">|</span>
          <span class="cursor-pointer" @click="openSignIn = true">登录</span>
        </template>
      </div>
    </b-container>
  </b-navbar>
  <b-modal v-model="openSignIn" title="登录" hide-footer>
    <form @submit.stop.prevent="onSignInSubmit" @reset="onSignInReset">
      <b-form-group label="用户名" label-for="signIn-name">
        <b-form-input id="signIn-name" v-model="signInForm.name"></b-form-input>
        <b-form-invalid-feedback
          v-if="showError"
          :state="validationSignIn.name"
        >
          用户名长度必须在 5 - 12 之间
        </b-form-invalid-feedback>
      </b-form-group>
      <b-form-group label="密码" label-for="signIn-password">
        <b-form-input
          id="signIn-password"
          v-model="signInForm.password"
          type="password"
        ></b-form-input>
        <b-form-invalid-feedback
          v-if="showError"
          :state="validationSignIn.password"
        >
          密码长度必须在 6 - 20 之间
        </b-form-invalid-feedback>
      </b-form-group>
      <div class="float-end">
        <b-button type="reset" variant="link" class="mr-2">关闭</b-button>
        <b-button type="submit" variant="primary">提交</b-button>
      </div>
    </form>
  </b-modal>
  <b-modal v-model="openSignUp" title="注册" hide-footer>
    <form @submit.stop.prevent="onSignUpSubmit" @reset="onSignUpReset">
      <b-form-group label="用户名" label-for="signUp-name">
        <b-form-input id="signUp-name" v-model="signUpForm.name"></b-form-input>
        <b-form-invalid-feedback
          v-if="showError"
          :state="validationSignUp.name"
        >
          用户名长度必须在 5 - 12 之间
        </b-form-invalid-feedback>
      </b-form-group>
      <b-form-group label="密码" label-for="signUp-password">
        <b-form-input
          id="signUp-password"
          v-model="signUpForm.password"
          type="password"
        ></b-form-input>
        <b-form-invalid-feedback
          v-if="showError"
          :state="validationSignUp.password"
        >
          密码长度必须在 6 - 20 之间
        </b-form-invalid-feedback>
      </b-form-group>
      <b-form-group label="确认密码" label-for="signUp-repassword">
        <b-form-input
          id="signUp-repassword"
          v-model="signUpForm.repassword"
          type="password"
        ></b-form-input>
        <b-form-invalid-feedback
          v-if="showError"
          :state="validationSignUp.repassword"
        >
          确认密码与密码不一致
        </b-form-invalid-feedback>
      </b-form-group>
      <div class="float-end">
        <b-button type="reset" variant="link" class="mr-2">关闭</b-button>
        <b-button type="submit" variant="primary">提交</b-button>
      </div>
    </form>
  </b-modal>
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
