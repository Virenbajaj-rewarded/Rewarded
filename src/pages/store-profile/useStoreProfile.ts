import { useState, useMemo } from 'react';
import { useLedger } from '@/services/ledger/useLedger';
import { useFormik } from 'formik';
import { useParams } from 'react-router-dom';
import { useMyStores as useStoresService } from '@/services/stores/useStores';
import { useFetchBalanceQuery } from '@/services/user/useUser';
import { createCreditPointValidationSchema } from './StoreProfile.validation';

export const useStoreProfile = () => {
  const { businessCode } = useParams<{ businessCode: string }>();
  const { useFetchStoreQuery } = useStoresService();
  const {
    data: store,
    isLoading: isStoreLoading,
    isError: isStoreError,
  } = useFetchStoreQuery(businessCode || '');

  const { data: balance = 0 } = useFetchBalanceQuery();

  const { creditPoint, creditPointLoading } = useLedger();
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);

  const openPayModal = () => setIsPayModalOpen(true);
  const closePayModal = () => setIsPayModalOpen(false);

  const validationSchema = useMemo(
    () => createCreditPointValidationSchema(balance),
    [balance]
  );

  const formik = useFormik({
    initialValues: {
      points: '0',
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values: { points: string }) => {
      if (!store) return;
      const points = Number(values.points);

      await creditPoint({
        points,
        toUserId: store.userId,
      });

      formik.resetForm();
      closePayModal();
    },
  });

  const handleClose = () => {
    formik.resetForm();
    closePayModal();
  };

  return {
    isPayModalOpen,
    openPayModal,
    closePayModal: handleClose,
    store,
    formik,
    creditPointLoading,
    isStoreLoading,
    isStoreError,
    balance,
  };
};
