import { ElMessage } from 'element-plus';

export const showError = (message: string) => {
  ElMessage({ message, type: 'error' });
};
export const showSuccess = (message: string) => {
  ElMessage({ message, type: 'success' });
};
