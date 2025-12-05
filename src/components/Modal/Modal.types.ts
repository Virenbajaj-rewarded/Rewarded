import { StyleProp, ViewStyle, TextStyle } from 'react-native';
import { ReactNode } from 'react';

export interface IModal {
  visible: boolean;
  submitButtonType?: 'default' | 'delete';
  title: string;
  description?: string;
  submitButtonLabel: string;
  cancelButtonLabel: string;
  onSubmit: () => void;
  onCancel: () => void;
  onClose: () => void;
  submitButtonStyle?: StyleProp<ViewStyle>;
  submitButtonTextStyle?: StyleProp<TextStyle>;
  cancelButtonStyle?: StyleProp<ViewStyle>;
  cancelButtonTextStyle?: StyleProp<TextStyle>;
  children?: ReactNode;
}
