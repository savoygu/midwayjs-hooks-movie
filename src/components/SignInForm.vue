<script setup lang="ts">
import type { User } from '@prisma/client';
import type { FormInstance, FormRules } from 'element-plus';
import { reactive, ref } from 'vue';
import { useUserStore } from '../store/user';
import { showError, showSuccess } from '../utils/ElMessage';
import { UserFormRules } from '../utils/FormRules';

// Props
const props = defineProps<{
  onReset?: () => void;
  onSubmit: (
    form: Pick<User, 'name' | 'password'>
  ) => Promise<Pick<User, 'id' | 'name' | 'role'>>;
}>();

// State
const signInFormRef = ref<FormInstance>();
const signInForm = reactive({
  name: '',
  password: '',
});
const signInRules = reactive<FormRules>(UserFormRules);

// Hooks
const userStore = useUserStore();

// Methods
async function submitSignIn() {
  signInFormRef.value.validate(async valid => {
    if (valid) {
      try {
        const user = await props.onSubmit(signInForm);
        // save user to store
        userStore.save(user);
        showSuccess('登录成功');
        props.onReset();
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
  props.onReset?.();
}
</script>

<template>
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
      <el-button class="mr-2" @click="resetSignIn">关闭</el-button>
      <el-button type="primary" @click="submitSignIn">提交</el-button>
    </div>
  </el-form>
</template>

<style scoped></style>
