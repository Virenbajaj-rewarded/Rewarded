import { useFormik } from 'formik';
import { useState } from 'react';
import { merchantValidationSchema } from './SignupMerchant.validation';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/services/auth';
import { IMerchantSignupFormValues } from './SignupMerchant.types';
import { ROUTES } from '@/routes';

export const useSignupMerchant = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const { signupMerchant, isSignupMerchantLoading } = useAuth();
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
  };

  const handleSubmit = async (values: IMerchantSignupFormValues) => {
    try {
      const success = await signupMerchant(values);
      if (success) {
        toast.success('Account created successfully!');
        navigate(ROUTES.SIGNUP_MERCHANT_SUCCESS, {
          state: { email: values.email },
        });
      } else {
        toast.error('An account with this email already exists');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    }
  };

  const formik = useFormik<IMerchantSignupFormValues>({
    initialValues,
    validationSchema: merchantValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
  });

  const handleNext = () => {
    setCurrentStep(2);
  };

  const handleStepClick = (step: number) => {
    setCurrentStep(step);
  };

  return {
    formik,
    isLoading: isSignupMerchantLoading,
    currentStep,
    handleNext,
    handleStepClick,
  };
};
