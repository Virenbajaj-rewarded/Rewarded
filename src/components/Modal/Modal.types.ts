import { StyleProp, ViewStyle } from 'react-native';

export interface IModal {
  visible: boolean;
  submitButtonType?: 'default' | 'delete';
  title: string;
  description: string;
  submitButtonLabel: string;
  cancelButtonLabel: string;
  onSubmit: () => void;
  onCancel: () => void;
  onClose: () => void;
  submitButtonStyle?: StyleProp<ViewStyle>;
  submitButtonTextStyle?: StyleProp<ViewStyle>;
  cancelButtonStyle?: StyleProp<ViewStyle>;
  cancelButtonTextStyle?: StyleProp<ViewStyle>;
}
