import { useCallback, useEffect, useState } from 'react';
import { View, ScrollView, ActivityIndicator } from 'react-native';
import { RootScreenProps } from '@/navigation/types';
import { Paths } from '@/navigation/paths';
import { EProgramStatus, EProgramStrategy, EProgramStrategyDisplayNames } from '@/enums';
import { PrimaryButton, Tag, Typography } from '@/components';
import { capitalize } from '@/utils/helpers';
import SafeScreen from '@/components/templates/SafeScreen';
import { getProgramStatusTextColor, getProgramStatusBackgroundColor } from '../../utils';
import { styles } from './ProgramDetails.styles';
import { IProgram } from '@/interfaces';
import { formatCurrency } from '@/utils/helpers';
import { useProgramDetails } from './useProgramDetails';
import { StopProgramModal } from '../../components/StopProgramModal/StopProgramModal';
import { formatStrategyLabel, getRemainingBudget } from '@/utils/helpers';

export default function ProgramDetails({
  navigation,
  route,
}: RootScreenProps<Paths.PROGRAM_DETAILS>) {
  const { programId } = route.params;
  const [isStopModalVisible, setIsStopModalVisible] = useState(false);

  const openStopModal = useCallback(() => setIsStopModalVisible(true), []);
  const closeStopModal = useCallback(() => setIsStopModalVisible(false), []);

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
    handleTopUpProgram,
    isLoadingProgram,
  } = useProgramDetails(programId);

  const { name, status, strategy, stopDistributionPoints, maxDailyBudget, budget, spentAmount } =
    (program as IProgram) || {};

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
              onPress={() => handleTopUpProgram(program)}
              style={styles.topUpButtonStyle}
              textStyle={styles.topUpButtonTextStyle}
            />
            <PrimaryButton
              label="Stop"
              onPress={openStopModal}
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
              onPress={() => handleTopUpProgram(program)}
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
              onPress={() => handleTopUpProgram(program)}
              style={styles.transparentButtonStyle}
              textStyle={styles.editButtonTextStyle}
            />
          </>
        );
    }
  }, [
    status,
    activateProgramLoading,
    renewProgramLoading,
    withdrawProgramLoading,
    program,
    handleActivateProgram,
    openStopModal,
    handleRenewProgram,
    handleWithdrawProgram,
    handleEditProgram,
    handleTopUpProgram,
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
            {formatCurrency(getRemainingBudget(program))}
          </Typography>
        </View>
        <View style={styles.detailsContainer}>
          {strategy && (
            <View style={styles.detailRow}>
              <Typography fontVariant="regular" fontSize={16} color="#BFBFBF">
                {EProgramStrategyDisplayNames[strategy]}
              </Typography>
              <Typography fontVariant="regular" fontSize={14} color="#FFFFFF">
                {formatStrategyLabel(program)}
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

          {budget && (
            <View style={styles.detailRow}>
              <Typography fontVariant="regular" fontSize={14} color="#BFBFBF">
                Program Budget
              </Typography>
              <Typography fontVariant="regular" fontSize={14} color="#FFFFFF">
                {formatCurrency(budget)}
              </Typography>
            </View>
          )}

          {Boolean(spentAmount) && (
            <View style={styles.detailRow}>
              <Typography fontVariant="regular" fontSize={14} color="#BFBFBF">
                Rewarded points
              </Typography>
              <Typography fontVariant="regular" fontSize={14} color="#FFFFFF">
                {formatCurrency(spentAmount)}
              </Typography>
            </View>
          )}

          {Boolean(stopDistributionPoints) && (
            <View style={styles.detailRow}>
              <Typography fontVariant="regular" fontSize={14} color="#BFBFBF">
                Points users have progress on
              </Typography>
              <Typography fontVariant="regular" fontSize={14} color="#FFFFFF">
                {formatCurrency(stopDistributionPoints)}
              </Typography>
            </View>
          )}
        </View>

        <View style={styles.buttonsContainer}>{renderButtons()}</View>
      </ScrollView>
      {program && (
        <StopProgramModal
          visible={isStopModalVisible}
          onClose={closeStopModal}
          description={
            program.strategy === EProgramStrategy.PERCENT_BACK
              ? 'Are you sure you want to stop rewarding points? The program will move to Draft. Any remaining budget remains available until you click Withdraw.'
              : 'Are you sure you want to stop? Partial rewards will be distributed to participants based on their spend progress.'
          }
          onConfirm={() => {
            handleStopProgram(program.id);
            closeStopModal();
          }}
          isLoading={stopProgramLoading}
        />
      )}
    </SafeScreen>
  );
}
