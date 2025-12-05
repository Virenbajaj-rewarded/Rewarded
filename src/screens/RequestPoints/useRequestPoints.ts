import { useEffect, useCallback, useState } from 'react';
import { useFormik } from 'formik';
import { requestPointsValidationSchema } from './RequestPoints.validation';
import { useFetchUserById } from '@/services/user/useUser';
import { RootScreenProps } from '@/navigation/types';
import { Paths } from '@/navigation/paths';
import { useLedger } from '@/services/ledger/useLedger';
import { IRequestPointsRequest } from '@/services/ledger/types';
import { MerchantTabPaths } from '@/navigation/paths';
import { ICheckRequestsResponse } from '@/services/ledger/types';
import { seenByMerchant } from '@/services/ledger/ledgerService';

export type IRequestPointsFormValues = {
  points: string;
  comment: string;
};

export const useRequestPoints = (
  userId: string,
  navigation: RootScreenProps<Paths.REQUEST_POINTS>['navigation']
) => {
  const [requestPointsData, setRequestPointsData] = useState<ICheckRequestsResponse | null>(null);
  const {
    requestPoints,
    requestPointsLoading,
    requestPointsSuccess,
    requestPointsError,
    checkRequestStatus,
    checkRequestStatusError,
    checkRequestStatusSuccess,
  } = useLedger();
  const { data: user, isLoading: isLoadingUser } = useFetchUserById(userId);

  const handleRequestPoints = async (values: IRequestPointsFormValues) => {
    const data = {
      amount: Number(values.points),
      customerId: user?.id,
      comment: values.comment,
    } as IRequestPointsRequest;

    await requestPoints(data);
  };

  const formik = useFormik<IRequestPointsFormValues>({
    initialValues: {
      points: '0',
      comment: '',
    },
    validationSchema: requestPointsValidationSchema,
    onSubmit: handleRequestPoints,
  });

  useEffect(() => {
    if (user?.fullName) {
      navigation.setOptions({
        headerTitle: `${user.fullName} Request`,
      });
    }
  }, [user?.fullName, navigation]);

  useEffect(() => {
    if (requestPointsData?.id) {
      seenByMerchant(requestPointsData.id);
    }
  }, [requestPointsData?.id]);

  const handleCheckRequestStatus = useCallback(async () => {
    try {
      const response = await checkRequestStatus();
      setRequestPointsData(response);
    } catch (error) {
      console.error('Failed to check request status:', error);
    }
  }, [checkRequestStatus]);

  useEffect(() => {
    if (requestPointsError) {
      return;
    }

    // Call immediately when request is successful
    handleCheckRequestStatus();

    // Then poll every 20 seconds
    const intervalId = setInterval(handleCheckRequestStatus, 10000);

    // Cleanup interval on unmount or when dependencies change
    return () => {
      clearInterval(intervalId);
    };
  }, [handleCheckRequestStatus, requestPointsError]);

  const handleCancelRequest = () => {
    formik.resetForm();
    navigation.replace(Paths.SCAN_USER, { userId });
  };
  const handleGoToPrograms = () => {
    navigation.replace(Paths.MERCHANT_TABS, {
      screen: MerchantTabPaths.PROGRAM,
    });
  };

  return {
    formik,
    user,
    isLoadingUser,
    requestPointsLoading,
    requestPointsSuccess,
    handleCancelRequest,
    requestPointsData,
    handleGoToPrograms,
    checkRequestStatusError,
    checkRequestStatusSuccess,
  };
};
