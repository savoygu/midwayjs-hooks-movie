<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus';
import { reactive, ref } from 'vue';

// Props
const props = withDefaults(
  defineProps<{
    loading?: boolean;
    error?: any;
    autofocus?: boolean;
    initialValue?: string;
    onSubmit: (content: string) => Promise<void>;
  }>(),
  {
    autofocus: false,
    initialValue: '',
  }
);

// State
const commentFormRef = ref<FormInstance>();
const commentForm = reactive({
  content: props.initialValue,
});
const commentRules = reactive<FormRules>({
  content: [{ required: true, message: '评论不能为空', trigger: 'blur' }],
});

// Methods
function submitComment() {
  commentFormRef.value.validate(valid => {
    if (valid) {
      props
        .onSubmit(commentForm.content)
        .then(() => (commentForm.content = ''));
    } else {
      return false;
    }
  });
}
</script>

<template>
  <ElForm ref="commentFormRef" :model="commentForm" :rules="commentRules">
    <ElFormItem prop="content">
      <div class="flex flex-1">
        <ElInput
          v-model="commentForm.content"
          type="textarea"
          :autofocus="props.autofocus"
          :rows="4"
          resize="none"
          class="rounded-tr-none rounded-br-none"
        ></ElInput>
        <ElButton
          type="primary"
          class="w-20 !h-auto rounded-tl-none rounded-bl-none"
          @click="submitComment"
        >
          {{ props.loading ? '评论中' : '评论' }}
        </ElButton>
      </div>
    </ElFormItem>
    <div class="text-[#ff5757] mt-1">{{ props.error?.data?.message }}</div>
  </ElForm>
</template>
