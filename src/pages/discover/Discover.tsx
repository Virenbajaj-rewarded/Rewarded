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
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useDiscover } from './useDiscover';
import { EIndustry, EIndustryDisplayNames, ERole } from '@/enums';
import { formatStrategyLabel, formatDistance } from '@/utils';
import HeartIcon from '@/assets/heart.svg?react';
import HeartFilledIcon from '@/assets/heart-filled.svg?react';
import SearchIcon from '@/assets/search.svg?react';
import { QRModal } from '@/pages/store-profile/QRModal';
import QrCodeIcon from '@/assets/qr.svg?react';
import { cn } from '@/lib/utils';

const Discover = () => {
  const {
    stores,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    selectedIndustry,
    handleIndustryChange,
    handleSearchChange,
    searchQuery,
    handleStoreClick,
    handleLikeStore,
    handleUnlikeStore,
    likeStoreLoading,
    unlikeStoreLoading,
    balance,
    profileId,
    isLeaveProgramModalOpen,
    closeLeaveProgramModal,
    selectedStore,
    leaveProgram,
    isQRModalOpen,
    setIsQRModalOpen,
  } = useDiscover();

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
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Discover</h1>
        <Button
          onClick={() => setIsQRModalOpen(true)}
          className="bg-[#3C83F6] hover:bg-[#3C83F6]/90"
        >
          <QrCodeIcon className="h-4 w-4  text-[#3C83F6]" />
          My QR
        </Button>
      </div>

      <div className="flex flex-col md:flex-row items-stretch gap-4">
        <div className="bg-[#0C1A31] p-7 rounded-lg flex items-center justify-between md:flex-1 self-stretch">
          <span className="text-[#BFBFBF] text-sm">Available Points</span>
          <span className="text-white font-medium text-3xl">
            {balance?.toLocaleString() || '0'}
          </span>
        </div>

        <div className="flex flex-col md:flex-col md:flex-1 gap-4">
          <div className="relative flex-1">
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"></div>
            <Input
              type="text"
              placeholder="Search by business name or ID."
              value={searchQuery}
              onChange={e => handleSearchChange(e.target.value)}
              className="pr-10 bg-[#1F1F1F] border-border text-foreground"
              rightMask={
                <SearchIcon className="h-5 w-5 text-muted-foreground" />
              }
            />
          </div>

          <Select
            value={selectedIndustry || ''}
            onValueChange={value =>
              handleIndustryChange(
                value === 'null' ? null : (value as EIndustry)
              )
            }
          >
            <SelectTrigger className="w-full md:w-auto md:min-w-[200px] bg-[#1F1F1F] border-border text-foreground">
              <SelectValue placeholder="All Industries" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="null">All Industries</SelectItem>
              {Object.values(EIndustry).map(industry => (
                <SelectItem key={industry} value={industry}>
                  {EIndustryDisplayNames[industry]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-medium text-foreground mb-4">
          Businesses Nearby
        </h2>

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
              {stores.map(store => {
                return (
                  <Card
                    key={store.id}
                    onClick={() => handleStoreClick(store.businessCode)}
                    className="bg-[#1A1A1A] border-border relative cursor-pointer hover:opacity-90 transition-opacity"
                  >
                    <CardContent className="p-4">
                      <div className="absolute top-4 right-4">
                        <Button
                          variant="ghost"
                          onClick={e =>
                            store.isLiked
                              ? handleUnlikeStore(store.id, e)
                              : handleLikeStore(store.id, e)
                          }
                          disabled={likeStoreLoading || unlikeStoreLoading}
                          className="h-6 w-6 p-0 hover:bg-transparent [&_svg]:!size-6"
                        >
                          {store.isLiked ? (
                            <HeartFilledIcon className="h-6 w-6 text-[#639CF8]" />
                          ) : (
                            <HeartIcon className="h-6 w-6 text-foreground" />
                          )}
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
                            <span className="text-[#639CF8] text-2xl font-medium">
                              {store.name.charAt(0).toUpperCase()}
                            </span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <h3 className="text-xl font-semibold text-foreground">
                            {store.name}
                          </h3>
                          <span className="text-[#8c8c8c] text-sm">
                            {EIndustryDisplayNames[store.storeType]}
                          </span>
                          {store.distance !== undefined && (
                            <span className="text-[#8c8c8c] text-sm">
                              {formatDistance(store.distance)}
                            </span>
                          )}
                          <span
                            className={cn(
                              'text-sm',
                              store.activeRewardProgram
                                ? 'text-[#3C83F6]'
                                : 'text-[#C13333]'
                            )}
                          >
                            {formatStrategyLabel(store.activeRewardProgram)}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
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
      </div>

      <QRModal
        open={isQRModalOpen}
        onOpenChange={setIsQRModalOpen}
        value={{
          value: profileId,
          type: 'customer_profile',
          role: ERole.MERCHANT,
        }}
        showText={false}
      />

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
                    {selectedStore.rewardPoints?.toLocaleString() || '0'} points
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

export default Discover;
