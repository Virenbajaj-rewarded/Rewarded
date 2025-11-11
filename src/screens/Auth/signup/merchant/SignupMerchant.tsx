import type { RootScreenProps } from '@/navigation/types';

import { ScrollView, View } from 'react-native';

import { Paths } from '@/navigation/paths';

import SafeScreen from '@/components/templates/SafeScreen';
import {
  TextField,
  PrimaryButton,
  Typography,
  AddressAutocomplete,
  Selector,
  Stepper,
} from '@/components';
import { styles } from './SignupMerchant.styles';
import { useSignupMerchant } from './useSignupMerchant';
import { FormikProvider } from 'formik';
import { industryOptions } from './selectorOptions';

const SignupMerchant = ({}: RootScreenProps<Paths.SIGNUP_MERCHANT>) => {
  const {
    formik,
    currentStep,
    totalSteps,
    handleNextStep,
    handlePreviousStep,
    signupMerchantLoading,
  } = useSignupMerchant();

  const stepTitles = ['Personal Info', 'Business Details'];

  const renderStep1 = () => (
    <>
      <TextField
        label="Full Name"
        value={formik.values.fullName}
        onChangeText={formik.handleChange('fullName')}
        placeholder="Full Name"
        onBlur={formik.handleBlur('fullName')}
        error={
          formik.touched.fullName && formik.errors.fullName ? formik.errors.fullName : undefined
        }
      />

      <TextField
        label="Email"
        value={formik.values.email}
        onChangeText={formik.handleChange('email')}
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        onBlur={formik.handleBlur('email')}
        error={formik.touched.email && formik.errors.email ? formik.errors.email : undefined}
      />

      <TextField
        label="Phone Number"
        value={formik.values.phoneNumber}
        onChangeText={formik.handleChange('phoneNumber')}
        placeholder="Phone Number"
        keyboardType="phone-pad"
        onBlur={formik.handleBlur('phoneNumber')}
        error={
          formik.touched.phoneNumber && formik.errors.phoneNumber
            ? formik.errors.phoneNumber
            : undefined
        }
      />
    </>
  );

  const renderStep2 = () => (
    <>
      <TextField
        label="Business Name"
        value={formik.values.businessName}
        onChangeText={formik.handleChange('businessName')}
        placeholder="Business Name"
        onBlur={formik.handleBlur('businessName')}
        error={
          formik.touched.businessName && formik.errors.businessName
            ? formik.errors.businessName
            : undefined
        }
      />

      <Selector
        label="Industry"
        value={formik.values.industry}
        onValueChange={value => formik.setFieldValue('industry', value)}
        options={industryOptions}
        placeholder="Select Industry"
        error={
          formik.touched.industry && formik.errors.industry ? formik.errors.industry : undefined
        }
      />

      <AddressAutocomplete
        placeholder="Enter your address"
        onAddressSelect={address => {
          formik.setFieldValue('location.address', address.address);
          formik.setFieldValue('location.latitude', address.lat);
          formik.setFieldValue('location.longitude', address.lng);
        }}
        onClear={() => {
          formik.setFieldValue('location.address', '');
          formik.setFieldValue('location.latitude', 0);
          formik.setFieldValue('location.longitude', 0);
        }}
        error={
          formik.touched.location?.address && formik.errors.location?.address
            ? formik.errors.location?.address
            : undefined
        }
      />
    </>
  );
  return (
    <FormikProvider value={formik}>
      <SafeScreen style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.contentContainer}
          nestedScrollEnabled={true}
          keyboardShouldPersistTaps="handled"
        >
          <Typography fontVariant="medium" fontSize={14} color="#BFBFBF">
            Enter your details to start. We&apos;ll verify your information, then you can complete
            your business setup.
          </Typography>

          <Stepper
            style={styles.stepperContainer}
            currentStep={currentStep}
            totalSteps={totalSteps}
            stepTitles={stepTitles}
            onStepPress={stepNumber => {
              if (stepNumber === 1) {
                handlePreviousStep();
              } else if (stepNumber === 2) {
                handleNextStep();
              }
            }}
          />

          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
        </ScrollView>

        <View style={styles.buttonContainer}>
          {currentStep < totalSteps ? (
            <PrimaryButton label="Next" onPress={handleNextStep} style={styles.button} />
          ) : (
            <PrimaryButton
              label={signupMerchantLoading ? 'Loading...' : 'Send Request'}
              disabled={!formik.isValid && !formik.dirty}
              onPress={formik.handleSubmit}
              style={styles.button}
            />
          )}
        </View>
      </SafeScreen>
    </FormikProvider>
  );
};

export default SignupMerchant;
