import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '../../components/ui/button';
import { useStoreProfile } from './useStoreProfile';
import { PaymentModal } from './PaymentModal';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/routes';
import ArrowLeftIcon from '@/assets/arrow-left.svg?react';

export const StoreProfile = () => {
  const {
    isPayModalOpen,
    openPayModal,
    closePayModal,
    formik,
    store,
    creditPointLoading,
    isStoreError,
    isStoreLoading,
    balance,
  } = useStoreProfile();

  if (isStoreLoading) {
    return (
      <Card className="space-y-6">
        <CardHeader>
          <CardTitle>Store Profile</CardTitle>
        </CardHeader>
        <div className="p-6">
          <Skeleton className="h-48 w-full" />
        </div>
      </Card>
    );
  }

  if (isStoreError || !store) {
    return (
      <Card className="space-y-6">
        <CardHeader>
          <CardTitle>Store Profile</CardTitle>
        </CardHeader>
        <div className="p-6 text-center text-destructive">
          Error loading store. Please try again later.
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card className="space-y-6">
        <CardHeader className="flex flex-row items-center gap-10">
          <Link replace to={ROUTES.MY_STORES}>
            <ArrowLeftIcon width={24} height={24} />
          </Link>
          <CardTitle className="text-2xl font-bold">Store Profile</CardTitle>
        </CardHeader>
        <div className="p-6">
          <Button onClick={openPayModal}>Pay</Button>
        </div>
      </Card>

      <PaymentModal
        open={isPayModalOpen}
        onOpenChange={closePayModal}
        store={store}
        formik={formik}
        isLoading={creditPointLoading}
        balance={balance}
      />
    </>
  );
};
