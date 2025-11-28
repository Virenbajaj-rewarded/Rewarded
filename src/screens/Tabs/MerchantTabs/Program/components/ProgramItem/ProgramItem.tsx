import { useCallback } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { EProgramStatus, EProgramStrategyDisplayNames } from '@/enums';
import { IProgram } from '@/interfaces';
import { PrimaryButton, Tag, Typography } from '@/components';
import { styles } from './ProgramItem.styles';
import { useNavigation } from '@react-navigation/native';
import { Paths } from '@/navigation/paths';
import {
  getProgramStatusTextColor,
  getProgramStatusBackgroundColor,
  getProgramStrategyTextColor,
  getProgramStrategyBackground,
} from '../../utils';
import { capitalize } from '@/utils/helpers';

type ProgramItemProps = {
  program: IProgram;
  handleStopProgram?: (id: string) => void;
  stopProgramLoading?: boolean;
  handleActivateProgram?: (id: string) => void;
  activateProgramLoading?: boolean;
  handleRenewProgram?: (id: string) => void;
  renewProgramLoading?: boolean;
  handleWithdrawProgram?: (id: string) => void;
  withdrawProgramLoading?: boolean;
};

export const ProgramItem = ({ program, ...props }: ProgramItemProps) => {
  const navigation = useNavigation();
  const { status } = program;

  const renderButtons = useCallback(
    (program: IProgram) => {
      switch (status) {
        case EProgramStatus.ACTIVE:
          return (
            <>
              <PrimaryButton
                label="Top Up"
                onPress={() => {}}
                style={styles.topUpButtonStyle}
                textStyle={styles.topUpButtonTextStyle}
              />
              {props.handleStopProgram && (
                <PrimaryButton
                  label={props.stopProgramLoading ? 'Stopping...' : 'Stop'}
                  onPress={() => props.handleStopProgram!(program.id)}
                  style={styles.stopButtonStyle}
                  textStyle={styles.stopButtonTextStyle}
                  icon={{ name: 'stop', color: '#FF4D4F', width: 16, height: 16 }}
                />
              )}
            </>
          );
        case EProgramStatus.DRAFT:
          return (
            <>
              {props.handleActivateProgram && (
                <PrimaryButton
                  label={props.activateProgramLoading ? 'Activating...' : 'Set as active'}
                  onPress={() => props.handleActivateProgram!(program.id)}
                  disabled={props.activateProgramLoading}
                />
              )}
              <PrimaryButton
                label="Top Up"
                onPress={() => {}}
                style={styles.topUpButtonStyle}
                textStyle={styles.topUpButtonTextStyle}
              />
              <PrimaryButton
                label="Edit"
                onPress={() => navigation.navigate(Paths.EDIT_PROGRAM, { program })}
                icon={{ name: 'edit', color: '#3C83F6' }}
                style={styles.transparentButtonStyle}
                textStyle={styles.editButtonTextStyle}
              />
            </>
          );
        case EProgramStatus.STOPPED:
          return (
            <>
              {props.handleWithdrawProgram && (
                <PrimaryButton
                  label={props.withdrawProgramLoading ? 'Withdrawing...' : 'Withdraw'}
                  icon={{ name: 'withdraw', color: '#fff' }}
                  onPress={() => props.handleWithdrawProgram!(program.id)}
                />
              )}
              {props.handleRenewProgram && (
                <PrimaryButton
                  label={props.renewProgramLoading ? 'Renewing...' : 'Renew'}
                  icon={{ name: 'renew', color: '#3C83F6' }}
                  onPress={() => props.handleRenewProgram!(program.id)}
                  style={styles.topUpButtonStyle}
                  textStyle={styles.topUpButtonTextStyle}
                />
              )}
              <PrimaryButton
                label="Top Up"
                onPress={() => {}}
                style={styles.transparentButtonStyle}
                textStyle={styles.editButtonTextStyle}
              />
            </>
          );
      }
    },
    [status, navigation, props]
  );

  const handleItemPress = () => {
    navigation.navigate(Paths.PROGRAM_DETAILS, { programId: program.id });
  };

  return (
    <View style={styles.programItem}>
      <TouchableOpacity
        onPress={handleItemPress}
        activeOpacity={0.8}
        style={styles.programItemClickable}
      >
        <View style={styles.programItemHeader}>
          <Typography fontVariant="regular" fontSize={20} color="#FFFFFF">
            {program.name}
          </Typography>
          <Typography fontVariant="semibold" fontSize={20} color="#FFFFFF">
            ${program.budget}
          </Typography>
        </View>
        <View style={styles.programItemTags}>
          <Tag
            textColor={getProgramStatusTextColor(program.status)}
            backgroundColor={getProgramStatusBackgroundColor(program.status)}
          >
            {capitalize(program.status)}
          </Tag>
          <Tag
            textColor={getProgramStrategyTextColor(program.strategy)}
            backgroundColor={getProgramStrategyBackground(program.strategy)}
          >
            {EProgramStrategyDisplayNames[program.strategy]}{' '}
            {program.percentBack ? `${program.percentBack}%` : ''}
          </Tag>
        </View>
      </TouchableOpacity>
      <View style={styles.programItemButtons}>{renderButtons(program)}</View>
    </View>
  );
};
