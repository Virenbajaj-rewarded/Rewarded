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

export interface IHorizontalRadioOption {
  value: string;
  label: string;
}

export interface IHorizontalRadioGroup {
  value: string;
  onValueChange: (value: string) => void;
  options: IHorizontalRadioOption[];
  color?: string;
  uncheckedColor?: string;
}

export interface IRadioOptionProps {
  option: IRadioOption;
  isSelected: boolean;
  onPress: () => void;
  color: string;
  uncheckedColor: string;
}
