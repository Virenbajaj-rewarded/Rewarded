import type { RootScreenProps } from '@/navigation/types';

import { ScrollView, View } from 'react-native';

import { Paths } from '@/navigation/paths';

import SafeScreen from '@/components/templates/SafeScreen';
import { TextField, PrimaryButton, Typography } from '@/components';
import { styles } from './SignupUser.styles';
import { useSignupUser } from './useSignupUser';
import { FormikProvider } from 'formik';

const SignupUser = ({}: RootScreenProps<Paths.SIGNUP_USER>) => {
  const { formik, signupUserLoading } = useSignupUser();

  return (
    <FormikProvider value={formik}>
      <SafeScreen style={styles.container}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
          <Typography textAlign="center" fontVariant="medium" fontSize={14} color="#BFBFBF">
            Enter your details to start
          </Typography>

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
            label="Phone"
            value={formik.values.phoneNumber}
            onChangeText={formik.handleChange('phoneNumber')}
            placeholder="Phone"
            keyboardType="phone-pad"
            onBlur={formik.handleBlur('phoneNumber')}
            error={
              formik.touched.phoneNumber && formik.errors.phoneNumber
                ? formik.errors.phoneNumber
                : undefined
            }
          />

          <TextField
            label="Password"
            value={formik.values.password}
            onChangeText={formik.handleChange('password')}
            placeholder="Password"
            secureTextEntry
            onBlur={formik.handleBlur('password')}
            error={
              formik.touched.password && formik.errors.password ? formik.errors.password : undefined
            }
          />

          <TextField
            label="Confirm Password"
            value={formik.values.confirmPassword}
            onChangeText={formik.handleChange('confirmPassword')}
            placeholder="Confirm password"
            secureTextEntry
            onBlur={formik.handleBlur('confirmPassword')}
            error={
              formik.touched.confirmPassword && formik.errors.confirmPassword
                ? formik.errors.confirmPassword
                : undefined
            }
          />
        </ScrollView>

        <View style={styles.buttonContainer}>
          <PrimaryButton
            label={signupUserLoading ? 'Loading...' : 'Create account'}
            disabled={!formik.dirty || !formik.isValid}
            onPress={formik.handleSubmit}
          />
        </View>
      </SafeScreen>
    </FormikProvider>
  );
};

export default SignupUser;
