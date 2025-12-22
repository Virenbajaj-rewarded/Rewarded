import { useState, useMemo } from 'react';
import { useLedger } from '@/services/ledger/useLedger';
import { useFormik } from 'formik';
import { useParams, useNavigate } from 'react-router-dom';
import { useMyStores as useStoresService } from '@/services/stores/useStores';
import { useFetchBalanceQuery } from '@/services/user/useUser';
import { createCreditPointValidationSchema } from './StoreProfile.validation';

export const useStoreProfile = () => {
  const { businessCode } = useParams<{ businessCode: string }>();
  const navigate = useNavigate();
  const { useFetchStoreQuery, unlikeStore, unlikeStoreLoading, likeStore } =
    useStoresService();
  const {
    data: store,
    isLoading: isStoreLoading,
    isError: isStoreError,
    refetch: refetchStoreQuery,
  } = useFetchStoreQuery(businessCode || '');

  const { data: balance = 0 } = useFetchBalanceQuery();

  const { creditPoint, creditPointLoading } = useLedger();
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [isLeaveProgramModalOpen, setIsLeaveProgramModalOpen] = useState(false);

  const openPayModal = () => setIsPayModalOpen(true);
  const closePayModal = () => setIsPayModalOpen(false);

  const openQRModal = () => setIsQRModalOpen(true);
  const closeQRModal = () => setIsQRModalOpen(false);

  const openLeaveProgramModal = () => setIsLeaveProgramModalOpen(true);
  const closeLeaveProgramModal = () => setIsLeaveProgramModalOpen(false);

  const handleGoBack = () => navigate(-1);

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

  const handleUnlikeStore = async () => {
    if (!store) return;

    if (store?.activeRewardProgram) {
      openLeaveProgramModal();
    } else {
      await unlikeStore(store.id);
      refetchStoreQuery();
      handleGoBack();
    }
  };

  const handleLikeStore = async () => {
    if (!store) return;
    await likeStore(store.id);
    refetchStoreQuery();
  };

  const leaveProgram = async () => {
    if (!store) return;
    await unlikeStore(store.id);
    refetchStoreQuery();
    closeLeaveProgramModal();
    handleGoBack();
  };

  return {
    isPayModalOpen,
    openPayModal,
    closePayModal: handleClose,
    isQRModalOpen,
    openQRModal,
    closeQRModal,
    isLeaveProgramModalOpen,
    openLeaveProgramModal,
    closeLeaveProgramModal,
    handleUnlikeStore,
    handleLikeStore,
    leaveProgram,
    store,
    formik,
    creditPointLoading,
    isStoreLoading,
    isStoreError,
    balance,
    unlikeStoreLoading,
    handleGoBack,
  };
};
