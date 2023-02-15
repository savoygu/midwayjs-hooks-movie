<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus';
import { defineProps, reactive, ref } from 'vue';
import type { User } from '@prisma/client';
import { UserFormRules } from '../utils/FormRules';
import { showError, showSuccess } from '../utils/ElMessage';

// Props
const props = defineProps<{
  onReset?: () => void;
  onSubmit: (
    form: Pick<User, 'name' | 'password'>
  ) => Promise<Pick<User, 'id' | 'name' | 'role'>>;
}>();

// Emits
// const emit = defineEmits<{
//   (event: 'reset'): void;
//   (event: 'submit', id: number): void;
// }>();

// State
const signUpFormRef = ref<FormInstance>();
const signUpForm = reactive({
  name: '',
  password: '',
  repassword: '',
});

const validateRepassword = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('确认密码不能为空'));
  } else if (value !== signUpForm.password) {
    callback(new Error('确认密码与密码不一致'));
  } else {
    callback();
  }
};
const signUpRules = reactive<FormRules>({
  ...UserFormRules,
  repassword: [
    { required: true, message: '确认密码不能为空', trigger: 'blur' },
    { validator: validateRepassword, trigger: 'blur' },
  ],
});

// Methods
async function submitSignUp() {
  signUpFormRef.value.validate(async valid => {
    if (valid) {
      try {
        const { repassword: _, ...needSubmitForm } = signUpForm;
        await props.onSubmit(needSubmitForm);
        showSuccess('注册成功');
        props.onReset();
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
  props.onReset?.();
}
</script>

<template>
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
</template>

<style scoped></style>
