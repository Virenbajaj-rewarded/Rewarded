import { useCallback, useEffect } from 'react';
import { View, ScrollView, ActivityIndicator } from 'react-native';
import { RootScreenProps } from '@/navigation/types';
import { Paths } from '@/navigation/paths';
import { EProgramStatus, EProgramStrategyDisplayNames } from '@/enums';
import { PrimaryButton, Tag, Typography } from '@/components';
import { capitalize } from '@/utils/helpers';
import { useProgram } from '@/services/program/useProgram';
import SafeScreen from '@/components/templates/SafeScreen';
import { getProgramStatusTextColor, getProgramStatusBackgroundColor } from '../../utils';
import { styles } from './ProgramDetails.styles';
import { IProgram } from '@/interfaces';
import { formatCurrency } from '@/utils/helpers';
import { useProgramDetails } from './useProgramDetails';

export default function ProgramDetails({
  navigation,
  route,
}: RootScreenProps<Paths.PROGRAM_DETAILS>) {
  const { programId } = route.params;

  const {
    handleActivateProgram,
    activateProgramLoading,
    handleStopProgram,
    stopProgramLoading,
    handleRenewProgram,
    renewProgramLoading,
    handleWithdrawProgram,
    withdrawProgramLoading,
    handleEditProgram,
    program,
    isLoadingProgram,
  } = useProgramDetails(programId);

  const {
    name,
    status,
    strategy,
    percentBack,
    maxDailyBudget,
    budget,
    rewardPercent,
    spentAmount,
  } = (program as IProgram) || {};

  useEffect(() => {
    if (name) {
      navigation.setOptions({
        headerTitle: name,
      });
    }
  }, [name, navigation]);

  const renderButtons = useCallback(() => {
    if (!program) return null;
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
            <PrimaryButton
              label={stopProgramLoading ? 'Stopping...' : 'Stop'}
              onPress={() => handleStopProgram(program.id)}
              disabled={stopProgramLoading}
              style={styles.stopButtonStyle}
              textStyle={styles.stopButtonTextStyle}
              icon={{ name: 'stop', color: '#FF4D4F', width: 16, height: 16 }}
            />
          </>
        );
      case EProgramStatus.DRAFT:
        return (
          <>
            <PrimaryButton
              label={activateProgramLoading ? 'Activating...' : 'Set as Active'}
              onPress={() => handleActivateProgram(program.id)}
              disabled={activateProgramLoading}
            />
            <PrimaryButton
              label="Top Up"
              onPress={() => {}}
              style={styles.topUpButtonStyle}
              textStyle={styles.topUpButtonTextStyle}
            />
            <PrimaryButton
              label="Edit"
              onPress={handleEditProgram}
              icon={{ name: 'edit', color: '#3C83F6' }}
              style={styles.transparentButtonStyle}
              textStyle={styles.editButtonTextStyle}
            />
          </>
        );
      case EProgramStatus.STOPPED:
        return (
          <>
            <PrimaryButton
              label={withdrawProgramLoading ? 'Withdrawing...' : 'Withdraw'}
              icon={{ name: 'withdraw', color: '#fff' }}
              onPress={() => handleWithdrawProgram(program.id)}
              disabled={withdrawProgramLoading}
            />
            <PrimaryButton
              label={renewProgramLoading ? 'Renewing...' : 'Renew'}
              icon={{ name: 'renew', color: '#3C83F6' }}
              onPress={() => handleRenewProgram(program.id)}
              disabled={renewProgramLoading}
              style={styles.topUpButtonStyle}
              textStyle={styles.topUpButtonTextStyle}
            />
            <PrimaryButton
              label="Top Up"
              onPress={() => {}}
              style={styles.transparentButtonStyle}
              textStyle={styles.editButtonTextStyle}
            />
          </>
        );
    }
  }, [
    status,
    activateProgramLoading,
    stopProgramLoading,
    renewProgramLoading,
    withdrawProgramLoading,
    program,
    handleActivateProgram,
    handleStopProgram,
    handleRenewProgram,
    handleWithdrawProgram,
    handleEditProgram,
  ]);

  if (isLoadingProgram || !program) {
    return (
      <SafeScreen>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3C83F6" />
        </View>
      </SafeScreen>
    );
  }

  return (
    <SafeScreen>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Tag
            textColor={getProgramStatusTextColor(status)}
            backgroundColor={getProgramStatusBackgroundColor(status)}
          >
            {capitalize(status)}
          </Tag>
          <Typography fontVariant="semibold" fontSize={20} color="#FFFFFF">
            {formatCurrency(budget)}
          </Typography>
        </View>
        <View style={styles.detailsContainer}>
          {strategy && percentBack && (
            <View style={styles.detailRow}>
              <Typography fontVariant="regular" fontSize={16} color="#FFFFFF">
                {EProgramStrategyDisplayNames[strategy]}
              </Typography>
              <Typography fontVariant="regular" fontSize={16} color="#FFFFFF">
                {percentBack}%
              </Typography>
            </View>
          )}

          {maxDailyBudget && (
            <View style={styles.detailRow}>
              <Typography fontVariant="regular" fontSize={14} color="#BFBFBF">
                Maximum daily points per user
              </Typography>
              <Typography fontVariant="medium" fontSize={14} color="#FFFFFF">
                {formatCurrency(maxDailyBudget)}
              </Typography>
            </View>
          )}

          {budget && status !== EProgramStatus.ACTIVE && (
            <View style={styles.detailRow}>
              <Typography fontVariant="regular" fontSize={14} color="#BFBFBF">
                Program Budget
              </Typography>
              <Typography fontVariant="regular" fontSize={14} color="#FFFFFF">
                {formatCurrency(budget)}
              </Typography>
            </View>
          )}

          {rewardPercent && status !== EProgramStatus.ACTIVE && (
            <View style={styles.detailRow}>
              <Typography fontVariant="regular" fontSize={14} color="#BFBFBF">
                Rewarded points
              </Typography>
              <Typography fontVariant="regular" fontSize={14} color="#FFFFFF">
                {formatCurrency(rewardPercent)}
              </Typography>
            </View>
          )}

          {Boolean(spentAmount) && status !== EProgramStatus.ACTIVE && (
            <View style={styles.detailRow}>
              <Typography fontVariant="regular" fontSize={14} color="#BFBFBF">
                Points users have progress on
              </Typography>
              <Typography fontVariant="regular" fontSize={14} color="#FFFFFF">
                {formatCurrency(spentAmount)}
              </Typography>
            </View>
          )}
        </View>

        <View style={styles.buttonsContainer}>{renderButtons()}</View>
      </ScrollView>
    </SafeScreen>
  );
}
