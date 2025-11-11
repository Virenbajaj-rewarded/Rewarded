import { View } from 'react-native';
import Toast, { BaseToastProps, ToastConfig, ToastType } from 'react-native-toast-message';
import { styles } from './Toast.styles';
import { Typography } from '@/components';

const statusToBorderColor: Record<ToastType, string> = {
  success: '#22c55e',
  error: '#ef4444',
  info: '#60a5fa',
  warning: '#f59e0b',
};

const Base = ({ text1, text2, type }: BaseToastProps & { type: ToastType }) => {
  const borderColor = statusToBorderColor[type as ToastType] ?? statusToBorderColor.info;
  return (
    <View style={[styles.container, { borderColor }]}>
      {text1 ? (
        <Typography numberOfLines={2} color="#FFFFFF" fontVariant="regular" fontSize={14}>
          {text1}
        </Typography>
      ) : null}
      {text2 ? (
        <Typography numberOfLines={3} color="#FFFFFF" fontVariant="regular" fontSize={14}>
          {text2}
        </Typography>
      ) : null}
    </View>
  );
};

export const toastConfig: ToastConfig = {
  success: props => <Base {...props} type="success" />,
  error: props => <Base {...props} type="error" />,
  info: props => <Base {...props} type="info" />,
  warning: props => <Base {...props} type="warning" />,
};

export default Toast;
