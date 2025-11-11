import { useFormik } from 'formik';
import { ICreateProgramPayload } from '@/services/program/program.types';
import { EOfferType, EProgramStrategy } from '@/enums';
import { createProgramValidationSchema } from './CreateProgram.validation';
import { useProgram } from '@/services/program/useProgram';
import { RootScreenProps } from '@/navigation/types';
import { Paths } from '@/navigation/paths';

export const useCreateProgram = ({
  navigation,
}: Pick<RootScreenProps<Paths.CREATE_PROGRAM>, 'navigation'>) => {
  const { createProgram } = useProgram();

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleCreateProgram = async (values: ICreateProgramPayload) => {
    const payload = {
      name: values.name,
      strategy: values.strategy,
      offerType: values.offerType,
      capPerTransaction: values.capPerTransaction && Number(values.capPerTransaction),
      budget: values.budget && Number(values.budget),
      ...(values.percentBack && { percentBack: values.percentBack && Number(values.percentBack) }),
      ...(values.spendThreshold && {
        spendThreshold: values.spendThreshold && Number(values.spendThreshold),
      }),
      ...(values.rewardPercent && {
        rewardPercent: values.rewardPercent && Number(values.rewardPercent),
      }),
    };
    try {
      await createProgram(payload);
      handleGoBack();
    } catch (error) {
      console.error(error);
    }
  };

  const formik = useFormik<ICreateProgramPayload>({
    initialValues: {
      name: '',
      strategy: EProgramStrategy.PERCENT_BACK,
      offerType: EOfferType.POINTS_CASHBACK,
      percentBack: '',
      spendThreshold: '',
      rewardPercent: '',
      capPerTransaction: '',
      budget: '',
    },
    validationSchema: createProgramValidationSchema,
    onSubmit: handleCreateProgram,
    enableReinitialize: true,
  });

  const handleStrategyChange = (value: string) => {
    formik.setFieldValue('strategy', value);

    if (value === EProgramStrategy.PERCENT_BACK) {
      formik.setFieldValue('spendThreshold', '');
      formik.setFieldValue('rewardPercent', '');
      formik.setFieldTouched('spendThreshold', false);
      formik.setFieldTouched('rewardPercent', false);
    } else if (value === EProgramStrategy.SPEND_TO_EARN) {
      formik.setFieldValue('percentBack', '');
      formik.setFieldTouched('percentBack', false);
    }
  };

  const handleOfferTypeChange = (value: string) => {
    formik.setFieldValue('offerType', value);

    const currentStrategy = formik.values.strategy;

    if (currentStrategy === EProgramStrategy.PERCENT_BACK) {
      formik.setFieldValue('percentBack', '');
      formik.setFieldTouched('percentBack', false);
    } else if (currentStrategy === EProgramStrategy.SPEND_TO_EARN) {
      formik.setFieldValue('spendThreshold', '');
      formik.setFieldValue('rewardPercent', '');
      formik.setFieldTouched('spendThreshold', false);
      formik.setFieldTouched('rewardPercent', false);
    }
  };

  return {
    formik,
    handleStrategyChange,
    handleOfferTypeChange,
    handleGoBack,
  };
};
