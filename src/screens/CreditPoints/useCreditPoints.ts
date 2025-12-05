import { useLedger } from '@/services/ledger/useLedger';
import { useEffect, useState } from 'react';
import { useFetchUserById } from '@/services/user/useUser';
import { RootScreenProps } from '@/navigation/types';
import { Paths } from '@/navigation/paths';
import { useFormik } from 'formik';
import { creditPointsValidationSchema } from './CreditPoints.validation';
import { ICreditPointsFormValues } from './CreditPoints.types';
import { MerchantTabPaths } from '@/navigation/paths';

export const useCreditPoints = (
  userId: string,
  navigation: RootScreenProps<Paths.CREDIT_POINTS>['navigation']
) => {
  const { creditPoint, creditPointLoading, creditPointError, creditPointSuccess } = useLedger();
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const { data: user, isLoading: isLoadingUser } = useFetchUserById(userId);

  const openConfirmModal = () => setShowConfirmModal(true);
  const closeConfirmModal = () => setShowConfirmModal(false);

  const handleCreditPoints = async (values: ICreditPointsFormValues) => {
    const data = {
      points: Number(values.points),
      amountCents: Number(values.amountCents),
      comment: values.comment,
      toUserId: userId,
    };

    await creditPoint(data);
  };

  const formik = useFormik({
    initialValues: {
      points: '',
      amountCents: '',
      comment: '',
    },
    validationSchema: creditPointsValidationSchema,
    onSubmit: openConfirmModal,
  });

  useEffect(() => {
    if (user?.fullName) {
      navigation.setOptions({
        headerTitle: `${user.fullName} Credit`,
      });
    }
  }, [user?.fullName, navigation]);

  const handleConfirmCredit = async () => {
    setShowConfirmModal(false);
    if (formik.isValid && formik.values.points) {
      await handleCreditPoints(formik.values);
    }
  };

  const handleGoToPrograms = () => {
    navigation.replace(Paths.MERCHANT_TABS, {
      screen: MerchantTabPaths.PROGRAM,
    });
  };

  const handleTryAgain = () => {
    formik.resetForm();
    navigation.replace(Paths.SCAN_USER, { userId });
  };

  return {
    user,
    handleCreditPoints,
    formik,
    isLoadingUser,
    creditPointLoading,
    creditPointError,
    creditPointSuccess,
    showConfirmModal,
    closeConfirmModal,
    handleConfirmCredit,
    handleGoToPrograms,
    handleTryAgain,
  };
};
