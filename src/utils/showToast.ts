import Toast, { ToastShowParams, ToastType } from 'react-native-toast-message';

export const showToast = (params: Omit<ToastShowParams, 'position'> & { type?: ToastType }) => {
  const { type = 'info', ...rest } = params;
  Toast.show({ type, position: 'top', ...rest });
};
