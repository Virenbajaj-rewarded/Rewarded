import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Typography } from '@/components';
import { styles } from './Stepper.styles';
import { StepperProps } from './types';
import IconByVariant from '../atoms/IconByVariant';

const Stepper: React.FC<StepperProps> = ({
  style,
  currentStep,
  totalSteps,
  stepTitles,
  onStepPress,
}) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.stepsContainer}>
        {Array.from({ length: totalSteps }, (_, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;

          return (
            <React.Fragment key={stepNumber}>
              <TouchableOpacity
                style={styles.stepContainer}
                onPress={() => onStepPress?.(stepNumber)}
                activeOpacity={0.7}
                disabled={!onStepPress}
              >
                <View
                  style={[
                    styles.stepCircle,
                    isActive && styles.stepCircleActive,
                    isCompleted && styles.stepCircleCompleted,
                  ]}
                >
                  <Typography
                    fontSize={16}
                    fontVariant="medium"
                    color={isCompleted ? '#3c83f6' : '#FFFFFF'}
                  >
                    {isCompleted ? '✓' : stepNumber}
                  </Typography>
                </View>

                <View style={styles.stepTitleContainer}>
                  <Typography fontSize={16} fontVariant="regular" color="#FFFFFF">
                    {stepTitles[index]}
                  </Typography>
                  {isActive && <View style={styles.activeUnderline} />}
                </View>
              </TouchableOpacity>

              {index < totalSteps - 1 && (
                <View style={styles.connector}>
                  <IconByVariant path="arrow-right" width={16} height={16} />
                </View>
              )}
            </React.Fragment>
          );
        })}
      </View>
    </View>
  );
};

export default Stepper;
