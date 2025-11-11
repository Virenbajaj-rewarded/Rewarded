import { StyleProp, ViewStyle } from 'react-native';

export interface StepperProps {
  style?: StyleProp<ViewStyle>;
  currentStep: number;
  totalSteps: number;
  stepTitles: string[];
  onStepPress?: (stepNumber: number) => void;
}
