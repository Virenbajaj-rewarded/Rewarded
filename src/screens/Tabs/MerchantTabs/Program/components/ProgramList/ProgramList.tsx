import { useMemo, useCallback } from 'react';
import { View } from 'react-native';
import { FlashList, ListRenderItemInfo } from '@shopify/flash-list';
import { PrimaryButton, Tag, Typography } from '@/components';
import { IProgram } from '@/interfaces';
import { EProgramStatus, EProgramStrategyDisplayNames } from '@/enums';
import { styles } from './ProgramList.styles';
import {
  getProgramStrategyBackground,
  getProgramStrategyTextColor,
  getProgramStatusTextColor,
  getProgramStatusBackgroundColor,
} from '../../utils';
import { capitalize } from '@/utils/helpers';
import { useNavigation } from '@react-navigation/native';
import { Paths } from '@/navigation/paths';

interface ProgramListProps {
  programs: IProgram[];
  status: EProgramStatus;
}

export default function ProgramList({ programs, status }: ProgramListProps) {
  const navigation = useNavigation();

  const filteredPrograms = useMemo(() => {
    return programs.filter(program => program.status === status);
  }, [programs, status]);

  const handleCreateProgram = useCallback(() => {
    navigation.navigate(Paths.CREATE_PROGRAM);
  }, [navigation]);

  const renderButtons = useCallback(() => {
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
              label="Stop"
              onPress={() => {}}
              style={styles.stopButtonStyle}
              textStyle={styles.stopButtonTextStyle}
              icon={{ name: 'stop', color: '#FF4D4F', width: 16, height: 16 }}
            />
          </>
        );
      case EProgramStatus.DRAFT:
        return (
          <>
            <PrimaryButton label="Set as active" onPress={() => {}} />
            <PrimaryButton
              label="Top Up"
              onPress={() => {}}
              style={styles.topUpButtonStyle}
              textStyle={styles.topUpButtonTextStyle}
            />
            <PrimaryButton
              label="Edit"
              onPress={() => {}}
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
              label="Withdraw"
              icon={{ name: 'withdraw', color: '#fff' }}
              onPress={() => {}}
            />
            <PrimaryButton
              label="Renew"
              icon={{ name: 'renew', color: '#3C83F6' }}
              onPress={() => {}}
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
  }, [status]);

  const renderProgramItem = useCallback(
    ({ item }: ListRenderItemInfo<IProgram>) => {
      return (
        <View style={styles.programItem}>
          <View style={styles.programItemHeader}>
            <Typography fontVariant="regular" fontSize={20} color="#FFFFFF">
              {item.name}
            </Typography>
            <Typography fontVariant="semibold" fontSize={20} color="#FFFFFF">
              ${item.budget}
            </Typography>
          </View>
          <View style={styles.programItemTags}>
            <Tag
              textColor={getProgramStatusTextColor(item.status)}
              backgroundColor={getProgramStatusBackgroundColor(item.status)}
            >
              {capitalize(item.status)}
            </Tag>
            <Tag
              textColor={getProgramStrategyTextColor(item.strategy)}
              backgroundColor={getProgramStrategyBackground(item.strategy)}
            >
              {EProgramStrategyDisplayNames[item.strategy]}{' '}
              {item.percentBack ? `${item.percentBack}%` : ''}
            </Tag>
          </View>
          <View style={styles.programItemButtons}>{renderButtons()}</View>
        </View>
      );
    },
    [renderButtons]
  );

  return (
    <View style={styles.listContainer}>
      <PrimaryButton
        label="Create New Program"
        onPress={handleCreateProgram}
        icon={{ name: 'plus', color: '#639CF8' }}
        style={styles.addProgramButtonStyle}
        textStyle={styles.addProgramButtonTextStyle}
      />
      <FlashList
        data={filteredPrograms}
        renderItem={renderProgramItem}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Typography fontVariant="regular" fontSize={16} color="#666666">
              No programs found
            </Typography>
          </View>
        )}
      />
    </View>
  );
}
