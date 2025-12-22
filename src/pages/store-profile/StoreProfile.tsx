import { Card, CardContent } from '@/components/ui/card';
import { Button } from '../../components/ui/button';
import { useStoreProfile } from './useStoreProfile';
import { PaymentModal } from './PaymentModal';
import { QRModal } from './QRModal';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/routes';
import ArrowLeftIcon from '@/assets/arrow-left.svg?react';
import HeartFilledIcon from '@/assets/heart-filled.svg?react';
import HeartIcon from '@/assets/heart.svg?react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { QrCode } from 'lucide-react';
import LocationIcon from '@/assets/location.svg?react';
import TelegramIcon from '@/assets/telegram.svg?react';
import WhatsappIcon from '@/assets/whatsapp.svg?react';
import EmailIcon from '@/assets/email.svg?react';
import PhoneIcon from '@/assets/phone.svg?react';
import { formatStrategyLabel, formatDistance } from '@/utils';
import { Progress } from '@/components/ui/progress';
import { EProgramStrategy, EIndustryDisplayNames, ERole } from '@/enums';

export const StoreProfile = () => {
  const {
    isPayModalOpen,
    openPayModal,
    closePayModal,
    isQRModalOpen,
    openQRModal,
    closeQRModal,
    isLeaveProgramModalOpen,
    closeLeaveProgramModal,
    openLeaveProgramModal,
    handleUnlikeStore,
    handleLikeStore,
    leaveProgram,
    formik,
    store,
    creditPointLoading,
    isStoreError,
    isStoreLoading,
    balance,
    unlikeStoreLoading,
    handleGoBack,
  } = useStoreProfile();

  if (isStoreLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link to="#" onClick={handleGoBack}>
            <ArrowLeftIcon width={24} height={24} className="text-foreground" />
          </Link>
          <h1 className="text-[#3C83F6]">Back</h1>
        </div>
        <div className="p-6">
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    );
  }

  if (isStoreError || !store) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link to="#" onClick={handleGoBack}>
            <ArrowLeftIcon width={24} height={24} className="text-foreground" />
          </Link>
          <h1 className="text-[#3C83F6]">Back</h1>
        </div>
        <div className="p-6 text-center text-destructive">
          Error loading store. Please try again later.
        </div>
      </div>
    );
  }

  const spendToEarnProgress =
    store?.activeRewardProgram &&
    store.activeRewardProgram.strategy === EProgramStrategy.SPEND_TO_EARN
      ? {
          percentage: store.activeRewardProgram.spendThreshold
            ? Math.min(
                (store.spent / store.activeRewardProgram.spendThreshold) * 100,
                100
              )
            : 0,
          remaining:
            store.activeRewardProgram.spendThreshold &&
            store.spent < store.activeRewardProgram.spendThreshold
              ? store.activeRewardProgram.spendThreshold - store.spent
              : 0,
          spendThreshold: store.activeRewardProgram.spendThreshold || 0,
        }
      : null;

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link to="#" onClick={handleGoBack}>
            <ArrowLeftIcon width={24} height={24} className="text-foreground" />
          </Link>
          <h1 className="text-[#3C83F6]">Back</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          <Card className="bg-[#1A1A1A] border-none h-full">
            <CardContent className="p-6">
              <div className="flex gap-4 relative">
                {/* Store Logo */}
                <div className="w-24 h-24 rounded-lg bg-white flex items-center justify-center flex-shrink-0">
                  {store.logoUrl ? (
                    <img
                      src={store.logoUrl}
                      alt={store.businessName}
                      className="w-full h-full rounded-lg object-contain p-2"
                    />
                  ) : (
                    <span className="text-[#639CF8] text-2xl font-bold">
                      {store.businessName.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-foreground mb-1">
                        {store.businessName}
                      </h2>
                      {store?.activeRewardProgram && (
                        <p className="text-[#3C83F6] text-sm mb-1">
                          {formatStrategyLabel(store.activeRewardProgram)}
                        </p>
                      )}
                      <p className="text-[#8c8c8c] text-sm">
                        {EIndustryDisplayNames[store.storeType]}{' '}
                        {formatDistance(store.distance)}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      onClick={
                        store.isLiked ? handleUnlikeStore : handleLikeStore
                      }
                      className="h-8 w-8 p-0 hover:bg-transparent [&_svg]:!size-6"
                    >
                      {store.isLiked ? (
                        <HeartFilledIcon className="h-6 w-6 text-[#639CF8]" />
                      ) : (
                        <HeartIcon className="h-6 w-6 text-[#639CF8]" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <Button
                  onClick={openPayModal}
                  className="flex-1 bg-[#3C83F6] hover:bg-[#3C83F6]/90"
                >
                  Pay
                </Button>
                <Button
                  onClick={openQRModal}
                  variant="outline"
                  className="flex-1 border-[#3C83F6] text-[#3C83F6] hover:bg-[#1F1F1F] hover:text-[#3C83F6]"
                >
                  <QrCode className="h-4 w-4 mr-2 text-[#3C83F6]" />
                  Show QR
                </Button>
              </div>
            </CardContent>
          </Card>

          <div
            className={`h-full flex flex-col ${
              spendToEarnProgress ? 'gap-4' : 'space-y-4'
            }`}
          >
            {spendToEarnProgress ? (
              <>
                <div className="flex gap-4 flex-1">
                  <Card className="bg-[#3069C5] border-none flex-1 flex">
                    <CardContent className="p-4 flex-1 flex items-center">
                      <div className="flex items-center justify-between w-full">
                        <span className="text-[#D8E6FD]">Rewards Points</span>
                        <span className="text-white font-bold text-2xl">
                          {store.rewardPoints.toLocaleString()}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-[#0C1A31] border-none flex-1 flex">
                    <CardContent className="p-4 flex-1 flex items-center">
                      <div className="flex items-center justify-between w-full">
                        <span className="text-[#D8E6FD]">Spent Points</span>
                        <span className="text-white font-bold text-2xl">
                          {store.spent.toLocaleString()}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <Card className="bg-[#1A1A1A] border-none">
                  <CardContent className="p-4">
                    <h3 className="text-white font-medium text-xl mb-2">
                      {store.activeRewardProgram.name} Active
                    </h3>
                    <p className="text-[#8C8C8C] text-sm mb-4">
                      {spendToEarnProgress.percentage.toFixed(0)}% completed.{' '}
                      {spendToEarnProgress.remaining > 0 && (
                        <>
                          Spend CAD{' '}
                          {spendToEarnProgress.remaining.toLocaleString()} more
                          to receive your cash back
                        </>
                      )}
                    </p>
                    <Progress
                      value={spendToEarnProgress.percentage}
                      className="mb-2 h-2"
                    />
                    <div className="flex items-center justify-between text-xs text-white">
                      <span>CAD {store.spent.toLocaleString()}</span>
                      <span>
                        CAD{' '}
                        {spendToEarnProgress.spendThreshold.toLocaleString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <>
                <Card className="bg-[#3069C5] border-none flex-1 flex">
                  <CardContent className="p-4 flex-1 flex items-center">
                    <div className="flex items-center justify-between w-full">
                      <span className="text-[#D8E6FD]">Rewards Points</span>
                      <span className="text-white font-bold text-2xl">
                        {store.rewardPoints.toLocaleString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-[#0C1A31] border-none flex-1 flex">
                  <CardContent className="p-4 flex-1 flex items-center">
                    <div className="flex items-center justify-between w-full">
                      <span className="text-[#D8E6FD]">Spent Points</span>
                      <span className="text-white font-bold text-2xl">
                        {store.spent.toLocaleString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-stretch">
          <Card className="bg-[#1A1A1A] border-none lg:col-span-3 h-full">
            <CardContent className="p-6 h-full">
              <p className="text-white leading-relaxed">
                {store.description || 'No description available.'}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-[#1A1A1A] border-none lg:col-span-2 h-full">
            <CardContent className="p-6">
              <div className="space-y-3">
                {store.businessEmail && (
                  <a
                    href={`mailto:${store.businessEmail}`}
                    className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer text-white"
                  >
                    <EmailIcon className="h-4 w-4 flex-shrink-0" />
                    <span className="text-sm break-all">
                      {store.businessEmail}
                    </span>
                  </a>
                )}
                {store.businessPhoneNumber && (
                  <a
                    href={`tel:${store.businessPhoneNumber}`}
                    className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer text-white"
                  >
                    <PhoneIcon className="h-4 w-4 flex-shrink-0" />
                    <span className="text-sm">{store.businessPhoneNumber}</span>
                  </a>
                )}
                {store.location?.address && (
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(store.location.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-3 hover:opacity-80 transition-opacity cursor-pointer text-white"
                  >
                    <LocationIcon className="h-4 w-4 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{store.location.address}</span>
                  </a>
                )}
                {store.tgUsername && (
                  <a
                    href={`https://t.me/${store.tgUsername.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer text-white"
                  >
                    <TelegramIcon className="h-4 w-4 flex-shrink-0" />
                    <span className="text-sm">{store.tgUsername}</span>
                  </a>
                )}
                {store.whatsppUsername && (
                  <a
                    href={`https://wa.me/${store.whatsppUsername.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer text-white"
                  >
                    <WhatsappIcon className="h-4 w-4 flex-shrink-0" />
                    <span className="text-sm">{store.whatsppUsername}</span>
                  </a>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        {store?.activeRewardProgram && (
          <Button
            onClick={openLeaveProgramModal}
            className="flex-1 w-full justify-self-center bg-transparent border-none text-[#FF4D4F] hover:bg-[#1F1F1F] hover:text-[#FF4D4F]"
          >
            Leave Program
          </Button>
        )}
      </div>

      <PaymentModal
        open={isPayModalOpen}
        onOpenChange={closePayModal}
        store={store}
        formik={formik}
        isLoading={creditPointLoading}
        balance={balance}
      />

      <QRModal
        open={isQRModalOpen}
        onOpenChange={closeQRModal}
        value={{
          value: store.businessCode,
          type: 'store_profile',
          role: ERole.USER,
        }}
      />

      <Dialog
        open={isLeaveProgramModalOpen}
        onOpenChange={closeLeaveProgramModal}
      >
        <DialogContent className="bg-[#1F1F1F] border-border">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-foreground">
              Leave This Program?
            </DialogTitle>
            <DialogDescription className="text-[#BFBFBF]">
              {store && (
                <>
                  If you leave{' '}
                  {store.activeRewardProgram &&
                    formatStrategyLabel(store.activeRewardProgram)}
                  {' at '}
                  {store.businessName} program now, you might lose your{' '}
                  <strong>{store.rewardPoints.toLocaleString()} points</strong>{' '}
                  for this program. Are you sure?
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col sm:flex-col gap-2">
            <Button
              variant="destructive"
              onClick={leaveProgram}
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
    </>
  );
};
