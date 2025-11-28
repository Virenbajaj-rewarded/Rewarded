export interface ICheckbox {
  checked: boolean;
  onPress: () => void;
  checkedColor?: string;
  uncheckedColor?: string;
  checkedBackgroundColor?: string;
  uncheckedBackgroundColor?: string;
}
