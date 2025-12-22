import { useLedger } from '@/services/ledger/useLedger';
import { useEffect, useState, useMemo } from 'react';
import { useFetchUserById } from '@/services/user/useUser';
import { RootScreenProps } from '@/navigation/types';
import { Paths } from '@/navigation/paths';
import { useFormik } from 'formik';
import { creditPointsValidationSchema } from './CreditPoints.validation';
import { ICreditPointsFormValues } from './CreditPoints.types';
import { MerchantTabPaths } from '@/navigation/paths';
import { useDebounce } from '@/hooks';
import { useProgram } from '@/services/program/useProgram';
import { EProgramStatus } from '@/enums';

export const useCreditPoints = (
  userId: string,
  navigation: RootScreenProps<Paths.CREDIT_POINTS>['navigation']
) => {
  const { useFetchProgramsQuery } = useProgram();
  const { data: programs } = useFetchProgramsQuery(EProgramStatus.ACTIVE);
  const {
    creditUser,
    creditUserLoading,
    creditUserError,
    creditUserSuccess,
    useGetPointsByAmountQuery,
  } = useLedger();

  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const { data: user, isLoading: isLoadingUser } = useFetchUserById(userId);

  const activeProgram = useMemo(
    () => (programs?.pages.flatMap(page => page.items) ?? []).shift(),
    [programs]
  );

  const openConfirmModal = () => setShowConfirmModal(true);
  const closeConfirmModal = () => setShowConfirmModal(false);

  const handleCreditPoints = async (values: ICreditPointsFormValues) => {
    const data = {
      amount: Number(values.amount),
      comment: values.comment,
      customerId: userId,
    };

    await creditUser(data);
  };

  const formik = useFormik({
    initialValues: {
      points: '',
      amount: '',
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

  const debouncedAmount = useDebounce(formik.values.amount, 300);

  const { data: points } = useGetPointsByAmountQuery(Number(debouncedAmount), userId);

  const { setFieldValue } = formik;

  useEffect(() => {
    if (points) {
      setFieldValue('points', points.toString());
    } else {
      setFieldValue('points', '0');
    }
  }, [points, setFieldValue]);

  return {
    user,
    handleCreditPoints,
    formik,
    isLoadingUser,
    creditUserLoading,
    creditUserError,
    creditUserSuccess,
    showConfirmModal,
    closeConfirmModal,
    handleConfirmCredit,
    handleGoToPrograms,
    handleTryAgain,
    activeProgram,
  };
};
