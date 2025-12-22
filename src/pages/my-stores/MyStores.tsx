import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useMyStores } from './useMyStores';
import { EIndustry, EIndustryDisplayNames } from '@/enums';
import { Skeleton } from '@/components/ui/skeleton';
import HeartFilledIcon from '@/assets/heart-filled.svg?react';
import { formatStrategyLabel, formatDistance } from '@/utils';

const MyStores = () => {
  const {
    stores,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    selectedIndustry,
    handleIndustryChange,
    handleUnlikeStore,
    isLeaveProgramModalOpen,
    closeLeaveProgramModal,
    selectedStore,
    leaveProgram,
    unlikeStoreLoading,
    handleStoreClick,
  } = useMyStores();

  if (isError) {
    return (
      <div className="space-y-6">
        <div className="text-center text-destructive py-8">
          Error loading stores. Please try again later.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[38px] font-bold text-foreground">My Stores</h1>
      </div>

      <div className="flex items-center gap-4">
        <Select
          value={selectedIndustry || ''}
          onValueChange={handleIndustryChange}
        >
          <SelectTrigger className="w-1/2 bg-[#1F1F1F] border-border text-foreground">
            <SelectValue placeholder="All Industries" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={null}>All Industries</SelectItem>
            {Object.values(EIndustry).map(industry => (
              <SelectItem key={industry} value={industry}>
                {EIndustryDisplayNames[industry]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(6)].map((_, index) => (
            <Card key={index} className="bg-[#141414] border-border">
              <CardContent className="p-4">
                <Skeleton className="h-48 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : stores.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stores.map(store => (
              <Card
                key={store.id}
                onClick={() => handleStoreClick(store.businessCode)}
                className="bg-[#1A1A1A] border-border relative cursor-pointer hover:opacity-90 transition-opacity"
              >
                <CardContent className="p-4">
                  <div className="absolute top-4 right-4 z-10">
                    <Button
                      variant="ghost"
                      onClick={e => {
                        e.stopPropagation();
                        handleUnlikeStore(store.id);
                      }}
                      className="h-6 w-6 p-0 hover:bg-transparent [&_svg]:!size-6 pointer-events-auto"
                    >
                      <HeartFilledIcon className="h-6 w-6 text-[#639CF8]" />
                    </Button>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-24 h-24 rounded-lg bg-white flex items-center justify-center flex-shrink-0">
                      {store.logoUrl ? (
                        <img
                          src={store.logoUrl}
                          alt={store.name}
                          className="w-full h-full rounded-lg object-contain p-2"
                        />
                      ) : (
                        <span className="text-[#639CF8] text-2xl font-bold">
                          {store.name.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <h3 className="text-xl font-semibold text-foreground">
                        {store.name}
                      </h3>
                      {store?.activeRewardProgram && (
                        <span className="text-[#3C83F6] text-sm mr-1">
                          {formatStrategyLabel(store.activeRewardProgram)}
                        </span>
                      )}
                      <span className="text-[#8c8c8c] text-sm mr-1">
                        {EIndustryDisplayNames[store.storeType]}
                      </span>
                      {store.distance !== undefined && (
                        <span className="text-[#8c8c8c] text-sm">
                          {formatDistance(store.distance)}
                        </span>
                      )}

                      {store.rewardPoints > 0 ? (
                        <p className="text-white font-medium">
                          {store.rewardPoints.toLocaleString()} Points Earned
                        </p>
                      ) : (
                        <p className="text-[#8c8c8c] text-sm">
                          Rewards currently inactive
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {hasNextPage && (
            <div className="flex justify-center mt-6">
              <Button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                variant="outline"
              >
                {isFetchingNextPage ? 'Loading...' : 'Load More'}
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center text-muted-foreground py-8">
          No stores found.
        </div>
      )}

      <Dialog
        open={isLeaveProgramModalOpen}
        onOpenChange={closeLeaveProgramModal}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Leave This Program?</DialogTitle>
            <DialogDescription className="text-[#BFBFBF]">
              {selectedStore && (
                <>
                  If you leave{' '}
                  {selectedStore?.activeRewardProgram &&
                    formatStrategyLabel(selectedStore.activeRewardProgram)}{' '}
                  program now, you might lose your{' '}
                  <strong>
                    {selectedStore.rewardPoints.toLocaleString()} points
                  </strong>{' '}
                  for this program. Are you sure?
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col sm:flex-col gap-2">
            <Button
              variant="destructive"
              onClick={() => selectedStore && leaveProgram(selectedStore.id)}
              disabled={unlikeStoreLoading}
              className="w-full"
            >
              {unlikeStoreLoading ? 'Leaving...' : 'Leave Program'}
            </Button>
            <Button
              variant="outline"
              onClick={closeLeaveProgramModal}
              className="w-full bg-transparent border-none text-[#639CF8] hover:bg-transparent"
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyStores;
