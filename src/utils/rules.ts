export const UserFormRules = {
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
