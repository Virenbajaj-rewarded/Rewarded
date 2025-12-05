import { useFormik } from 'formik';
import { topUpStoreValidationSchema } from './TopUpStore.validation';
import { useLedger } from '@/services/ledger/useLedger';
import { RootScreenProps } from '@/navigation/types';
import { Paths } from '@/navigation/paths';
import { useFetchBalanceQuery } from '@/services/user/useUser';

export const useTopUpStore = ({ navigation, route }: RootScreenProps<Paths.TOP_UP_STORE>) => {
  const userId = route.params.userId;
  const { creditPoint, creditPointLoading, creditPointSuccess } = useLedger();
  const { data: balance } = useFetchBalanceQuery();

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleTopUpStore = async (values: { points: string }) => {
    const points = Number(values.points);
    await creditPoint({ toUserId: userId, points });
  };

  const formik = useFormik({
    initialValues: {
      points: '0',
    },
    validationSchema: topUpStoreValidationSchema(balance),
    onSubmit: handleTopUpStore,
  });

  return {
    formik,
    creditPointLoading,
    creditPointSuccess,
    handleGoBack,
    balance,
  };
};
