import { useWallet } from './useWallet';
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import IncomingIcon from '@/assets/incoming.svg?react';
import OutgoingIcon from '@/assets/outgoing.svg?react';

const Wallet = () => {
  const {
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
  } = useWallet();

  if (isError) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Transaction history
          </h1>
        </div>
        <div className="text-destructive">
          Failed to load transaction history
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Transaction history
        </h1>
      </div>

      {isLoading ? (
        <div className="space-y-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-20 w-full" />
            </div>
          ))}
        </div>
      ) : groupedTransactions.length === 0 ? (
        <div className="text-muted-foreground">No transactions found</div>
      ) : (
        <div className="space-y-6">
          {groupedTransactions.map(group => (
            <Card
              key={group.dateLabel}
              className="space-y-4 bg-[#141414] p-4 border-none"
            >
              <h2 className="font-semibold text-sm text-[#595959]">
                {group.dateLabel}
              </h2>
              <div className="space-y-3">
                {group.transactions.map(transaction => {
                  const incoming = isIncoming(transaction);
                  return (
                    <Card
                      key={transaction.id}
                      className="bg-[#1f1f1f] border-none p-4"
                    >
                      <div className="flex flex-col gap-2 sm:grid sm:grid-cols-[1fr_0.8fr_0.3fr_0.9fr] sm:items-center sm:gap-4">
                        <p className="text-[#BFBFBF] font-regular text-sm truncate sm:col-span-1">
                          {getTransactionDescription(transaction)}
                        </p>
                        <p className="text-[#BFBFBF] font-regular text-sm w-full sm:text-center">
                          {formatTransactionTime(transaction.createdAt)}
                        </p>
                        <div className="flex justify-start sm:justify-center w-full">
                          {incoming ? (
                            <IncomingIcon className="w-5 h-5" />
                          ) : (
                            <OutgoingIcon className="w-5 h-5" />
                          )}
                        </div>
                        <div className="text-left sm:text-right w-full">
                          <p className="font-semibold text-white">
                            {formatTransactionAmount(transaction.points)}
                          </p>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </Card>
          ))}
          {hasNextPage && (
            <div className="flex justify-center">
              <Button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                variant="outline"
              >
                {isFetchingNextPage ? 'Loading...' : 'Load More'}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Wallet;
