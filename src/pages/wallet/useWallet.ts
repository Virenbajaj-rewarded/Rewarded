import { useMemo } from 'react';
import { format, isToday, isYesterday, parseISO } from 'date-fns';
import { useFetchTransactionHistoryQuery } from '@/services/user/useUser';
import { ITransaction } from '@/interfaces';
import { ETransactionType } from '@/enums';

export interface GroupedTransaction {
  dateLabel: string;
  transactions: ITransaction[];
}

export const useWallet = () => {
  const {
    data: transactionHistory,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useFetchTransactionHistoryQuery();

  const groupedTransactions = useMemo(() => {
    if (!transactionHistory?.pages) return [];

    // Flatten all transactions from all pages
    const allTransactions = transactionHistory.pages.flatMap(
      page => page.items || []
    );

    // Group transactions by date
    const grouped = new Map<string, ITransaction[]>();

    allTransactions.forEach(transaction => {
      const date = parseISO(transaction.createdAt);
      let dateKey: string;

      if (isToday(date)) {
        dateKey = 'TODAY';
      } else if (isYesterday(date)) {
        dateKey = 'YESTERDAY';
      } else {
        dateKey = format(date, 'MMM d, yyyy').toUpperCase();
      }

      if (!grouped.has(dateKey)) {
        grouped.set(dateKey, []);
      }
      grouped.get(dateKey)!.push(transaction);
    });

    // Preserve backend ordering; just convert to array
    return Array.from(grouped.entries()).map(([dateLabel, transactions]) => ({
      dateLabel,
      transactions,
    }));
  }, [transactionHistory]);

  const formatTransactionTime = (dateString: string): string => {
    return format(parseISO(dateString), 'h:mm a');
  };

  const formatTransactionAmount = (points: number): string => {
    const amount = Math.abs(points);
    if (points < 0) {
      return `-${amount.toFixed(2)} CAD`;
    }
    return `${amount.toFixed(2)} CAD`;
  };

  const getTransactionDescription = (transaction: ITransaction): string => {
    if (transaction.comment) return transaction.comment;
    if (transaction.rewardProgramName)
      return `Rewarded Program ${transaction.rewardProgramName}`;
    if (transaction.type === ETransactionType.REDEEM) return 'Paid on Request';
    if (transaction.type === ETransactionType.EARNED) return 'Balance Top Up';
    return 'Transaction';
  };

  const isIncoming = (transaction: ITransaction): boolean => {
    return transaction.type === ETransactionType.EARNED;
  };

  return {
    groupedTransactions,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    formatTransactionTime,
    formatTransactionAmount,
    getTransactionDescription,
    isIncoming,
  };
};
