import { useCallback, useState } from 'react';
import { useAuth } from '@/services/auth/useAuth';
import { useNavigation } from '@react-navigation/native';
import { Paths } from '@/navigation/paths';
import { IMerchantSignupFormValues } from './SignupMerchant.types';
import { useFormik } from 'formik';
import { merchantSignupSchema } from './SignupMerchant.validation';
import { showToast } from '@/utils';

export const useSignupMerchant = () => {
  const navigation = useNavigation();
  const { signupMerchant, signupMerchantLoading, healthCheck } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 2;

  const getInitialValues = useCallback((): IMerchantSignupFormValues => {
    return {
      fullName: '',
      email: '',
      phoneNumber: '',
      businessName: '',
      location: {
        address: '',
        latitude: 0,
        longitude: 0,
      },
      industry: null,
      agreedToTerms: false,
    };
  }, []);

  const handleSubmit = async (values: IMerchantSignupFormValues) => {
    await healthCheck()
      .then(async () => {
        try {
          await signupMerchant(values);
          navigation.navigate(Paths.SIGNUP_MERCHANT_SUCCESS, { email: values.email });
        } catch (error) {
          console.error(error);
        }
      })
      .catch(error => {
        showToast({
          type: 'error',
          text1: 'Please try again later',
        });
        throw error;
      });
  };

  const formik = useFormik<IMerchantSignupFormValues>({
    initialValues: getInitialValues(),
    validationSchema: merchantSignupSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
  });

  const isStep1Valid = () => {
    const { fullName, email, phoneNumber } = formik.values;
    const {
      fullName: fullNameTouched,
      email: emailTouched,
      phoneNumber: phoneNumberTouched,
    } = formik.touched;

    return (
      fullName &&
      email &&
      phoneNumber &&
      !formik.errors.fullName &&
      !formik.errors.email &&
      !formik.errors.phoneNumber &&
      fullNameTouched &&
      emailTouched &&
      phoneNumberTouched
    );
  };

  const handleNextStep = () => {
    if (currentStep < totalSteps) {
      if (currentStep === 1 && !isStep1Valid()) {
        return;
      }
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return {
    formik,
    currentStep,
    totalSteps,
    handleNextStep,
    handlePreviousStep,
    signupMerchantLoading,
    isStep1Valid,
  };
};
