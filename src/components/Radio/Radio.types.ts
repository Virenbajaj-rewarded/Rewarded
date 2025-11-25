import { StyleProp, ViewStyle } from 'react-native';

export interface ICircularRadioProps {
  selected: boolean;
  color?: string;
  uncheckedColor?: string;
  size?: number;
}

export interface IRadio {
  value: string;
  onPress: () => void;
  color?: string;
  uncheckedColor?: string;
}

export interface IRadioGroup {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
}

export interface IRadioOption {
  value: string;
  label: string;
  description?: string;
  icon?: string;
  onPress?: () => void;
}

export interface IRadioList {
  value: string;
  onValueChange: (value: string) => void;
  options: IRadioOption[];
  color?: string;
  uncheckedColor?: string;
}

export interface ICircularRadioOption {
  value: string;
  label: string;
}

export interface ICircularRadioGroup {
  value: string;
  onValueChange: (value: string) => void;
  options: ICircularRadioOption[];
  color?: string;
  uncheckedColor?: string;
  direction?: 'horizontal' | 'vertical';
  style?: StyleProp<ViewStyle>;
}

export interface IRadioOptionProps {
  option: IRadioOption;
  isSelected: boolean;
  onPress: () => void;
  color: string;
  uncheckedColor: string;
}
