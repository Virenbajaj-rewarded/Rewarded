import { ActivityIndicator, View, RefreshControl, ScrollView } from 'react-native';
import { UserTabCombinedScreenProps } from '@/navigation/types.ts';
import { UserTabPaths } from '@/navigation/paths.ts';
import { QrCodeSvg } from 'react-native-qr-svg';
import { QR_CODE } from '@/types';
import IconByVariant from '@/components/atoms/IconByVariant';
import { Typography } from '@/components';
import { styles } from './Wallet.styles';
import { ERole } from '@/enums';
import { useWallet, TransactionListItem } from './useWallet';
import { useCallback } from 'react';

export default function Wallet({}: UserTabCombinedScreenProps<UserTabPaths.WALLET>) {
  const {
    transactionListItems,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isRefetching: isRefetchingTransactions,
    isTransactionIncoming,
    isBalanceRefetching,
    isBalanceLoading,
    getTransactionDescription,
    user,
    balance,
  } = useWallet();

  const renderTransactionItem = (item: TransactionListItem, index: number) => {
    if (item.type === 'date') {
      return (
        <View key={`date-${item.date}`} style={styles.dateHeader}>
          <Typography fontVariant="regular" fontSize={12} color="#595959">
            {item.formattedDate}
          </Typography>
        </View>
      );
    }

    const transaction = item.transaction;
    if (!transaction) return null;

    const isIncoming = isTransactionIncoming(transaction);
    const amount = Math.abs(transaction.points);
    const formattedAmount = `${amount.toFixed(2)} CAD`;

    return (
      <View key={`transaction-${transaction.id || index}`} style={styles.transactionItem}>
        <Typography
          fontVariant="regular"
          fontSize={16}
          color="#BFBFBF"
          numberOfLines={1}
          ellipsizeMode="tail"
          style={styles.transactionDescription}
        >
          {getTransactionDescription(transaction)}
        </Typography>
        <View style={styles.transactionIconContainer}>
          {isIncoming ? (
            <IconByVariant path="incoming" width={20} height={20} color="#73D13D" />
          ) : (
            <IconByVariant path="outgoing" width={20} height={20} color="#F5222D" />
          )}
        </View>
        <Typography
          fontVariant="bold"
          fontSize={16}
          color={'#FFFFFF'}
          style={styles.transactionAmount}
        >
          {isIncoming ? formattedAmount : `-${formattedAmount}`}
        </Typography>
      </View>
    );
  };

  const handleScroll = useCallback(
    (event: any) => {
      const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
      const paddingToBottom = 20;
      const isCloseToBottom =
        layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;

      if (isCloseToBottom && hasNextPage && !isFetchingNextPage && fetchNextPage) {
        fetchNextPage();
      }
    },
    [hasNextPage, isFetchingNextPage, fetchNextPage]
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      onScroll={handleScroll}
      scrollEventThrottle={400}
      refreshControl={
        <RefreshControl
          refreshing={isRefetchingTransactions || false}
          onRefresh={refetch}
          colors={['#3c83f6']}
          tintColor={'#3c83f6'}
        />
      }
    >
      <Typography fontVariant="bold" fontSize={24} color="#FFFFFF">
        Wallet Overview
      </Typography>
      <View style={styles.earnedPointsContainer}>
        <Typography fontVariant="regular" fontSize={24} color="#FFFFFF">
          Earned Points
        </Typography>
        {isBalanceLoading || isBalanceRefetching ? (
          <ActivityIndicator size="small" color="#3c83f6" />
        ) : (
          <View style={styles.balanceContainer}>
            <Typography fontVariant="bold" fontSize={16} color="#FFFFFF">
              {balance || 0}
            </Typography>
            <IconByVariant path="coins" width={16} height={16} />
          </View>
        )}
      </View>

      <View style={styles.purchasedPointsContainer}>
        <Typography fontVariant="regular" fontSize={24} color="#FFFFFF">
          Purchased Points
        </Typography>
        {isBalanceLoading || isBalanceRefetching ? (
          <ActivityIndicator size="small" color="#3c83f6" />
        ) : (
          <View style={styles.balanceContainer}>
            <Typography fontVariant="bold" fontSize={16} color="#FFFFFF">
              {balance || 0}
            </Typography>
            <IconByVariant path="coins" width={16} height={16} />
          </View>
        )}
      </View>

      <Typography
        fontVariant="regular"
        fontSize={24}
        color="#FFFFFF"
        textAlign="center"
        style={styles.qrCodeTitle}
      >
        My Profile QR Code
      </Typography>
      <QrCodeSvg
        value={JSON.stringify({
          value: user?.id || '',
          type: 'customer_profile',
          role: ERole.MERCHANT,
        } satisfies QR_CODE)}
        frameSize={200}
        backgroundColor={'transparent'}
        dotColor={'#ffffff'}
        style={styles.qrCode}
      />

      <View style={styles.transactionHistoryContainer}>
        <Typography fontVariant="bold" fontSize={20} color="#FFFFFF">
          Transaction history
        </Typography>
        {transactionListItems.length === 0 ? (
          <View style={styles.stateContainer}>
            <Typography fontVariant="regular" fontSize={16} color="#666666">
              No transactions found
            </Typography>
          </View>
        ) : (
          <>
            {transactionListItems.map((item, index) => renderTransactionItem(item, index))}
            {isFetchingNextPage && (
              <View style={styles.stateContainer}>
                <ActivityIndicator color={'#3c83f6'} />
              </View>
            )}
          </>
        )}
      </View>
    </ScrollView>
  );
}
