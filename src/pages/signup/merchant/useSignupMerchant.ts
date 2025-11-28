import { useFormik } from 'formik';
import { useState, useMemo } from 'react';
import { merchantValidationSchema } from './SignupMerchant.validation';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/services/auth';
import { IMerchantSignupFormValues } from './SignupMerchant.types';
import { ROUTES } from '@/routes';

export const useSignupMerchant = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const { signupMerchant, isSignupMerchantLoading, healthCheck } = useAuth();
  const navigate = useNavigate();

  const initialValues = {
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

  const handleSubmit = async (values: IMerchantSignupFormValues) => {
    healthCheck()
      .then(async () => {
        const success = await signupMerchant(values);
        if (success) {
          toast.success('Account created successfully!');
          navigate(ROUTES.SIGNUP_MERCHANT_SUCCESS, {
            state: { email: values.email },
          });
        } else {
          toast.error('An account with this email already exists');
        }
      })
      .catch(error => {
        throw error;
      });
  };

  const formik = useFormik<IMerchantSignupFormValues>({
    initialValues,
    validationSchema: merchantValidationSchema,
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

  const handleNext = () => {
    formik.setFieldTouched('fullName', true, false);
    formik.setFieldTouched('email', true, false);
    formik.setFieldTouched('phoneNumber', true, false);

    if (isStep1Valid) {
      setCurrentStep(2);
    }
  };

  const handleStepClick = (step: number) => {
    if (step === 2 && !isStep1Valid) {
      return;
    }
    setCurrentStep(step);
  };

  return {
    formik,
    isLoading: isSignupMerchantLoading,
    currentStep,
    handleNext,
    handleStepClick,
    isStep1Valid,
  };
};
