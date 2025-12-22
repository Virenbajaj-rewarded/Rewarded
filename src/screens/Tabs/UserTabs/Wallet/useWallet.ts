import { useMemo, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { isToday, isYesterday, format, parseISO, startOfDay } from 'date-fns';
import { useFetchBalanceQuery, useFetchTransactionHistoryQuery } from '@/services/user/useUser';
import { useAuth } from '@/services/auth/useAuth';
import { ITransaction } from '@/interfaces';
import { ETransactionType } from '@/enums';

export type TransactionListItem =
  | { type: 'date'; date: string; formattedDate: string }
  | { type: 'transaction'; transaction: ITransaction };

const formatTransactionDate = (dateString: string): string => {
  const date = parseISO(dateString);

  if (isToday(date)) {
    return 'TODAY';
  } else if (isYesterday(date)) {
    return 'YESTERDAY';
  } else {
    const formatted = format(date, 'MMM d, yyyy');
    return formatted.replace(/^[A-Za-z]+/, month => month.toUpperCase());
  }
};

const groupTransactionsByDate = (transactions: ITransaction[]): TransactionListItem[] => {
  const result: TransactionListItem[] = [];
  const seenDates = new Set<string>();

  transactions.forEach(transaction => {
    const date = parseISO(transaction.createdAt);
    const dateKey = format(startOfDay(date), 'yyyy-MM-dd');

    // Add date header only when we encounter a new date (preserving backend order)
    if (!seenDates.has(dateKey)) {
      seenDates.add(dateKey);
      const formattedDate = formatTransactionDate(transaction.createdAt);
      result.push({ type: 'date', date: dateKey, formattedDate });
    }

    result.push({ type: 'transaction', transaction });
  });

  return result;
};

export const useWallet = () => {
  const { useFetchProfileQuery } = useAuth();

  const { data: user } = useFetchProfileQuery();

  const {
    data: balance,
    isRefetching: isBalanceRefetching,
    isLoading: isBalanceLoading,
  } = useFetchBalanceQuery();
  const {
    data: transactionHistoryData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isRefetching,
  } = useFetchTransactionHistoryQuery();

  const transactions = useMemo(() => {
    if (!transactionHistoryData?.pages) return [];
    return transactionHistoryData.pages.flatMap(page => page.items);
  }, [transactionHistoryData]);

  const transactionListItems = useMemo(() => {
    return groupTransactionsByDate(transactions);
  }, [transactions]);

  const isTransactionIncoming = (transaction: ITransaction): boolean => {
    return transaction.type === ETransactionType.EARNED;
  };

  const getTransactionDescription = (transaction: ITransaction): string => {
    if (transaction.comment) return transaction.comment;
    if (transaction.rewardProgramName) return `Rewarded Program ${transaction.rewardProgramName}`;
    if (transaction.type === ETransactionType.REDEEM) return 'Paid on Request';
    if (transaction.type === ETransactionType.EARNED) return 'Balance Top Up';
    return 'Transaction';
  };

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  return {
    balance,
    transactionListItems,
    transactions,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isRefetching,
    isTransactionIncoming,
    isBalanceRefetching,
    isBalanceLoading,
    user,
    getTransactionDescription,
  };
};
