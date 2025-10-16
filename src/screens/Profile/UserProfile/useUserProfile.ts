import { useFormik } from 'formik';

import { useUser } from '@/services/user/useUser';
import { Alert } from 'react-native';
import { UserProfileForm, userProfileSchema } from './types';

const validate = (values: UserProfileForm) => {
  const result = userProfileSchema.safeParse(values);
  if (!result.success) {
    const fieldErrors = result.error.flatten().fieldErrors;
    const errors: any = {};

    if (fieldErrors.fullName) errors.fullName = fieldErrors.fullName[0];
    if (fieldErrors.phone) errors.phone = fieldErrors.phone[0];
    if (fieldErrors.email) errors.email = fieldErrors.email[0];

    return errors;
  }
  return {};
};

export const useUserProfile = () => {
  const { useFetchProfileQuery, useUpdateUserMutation } = useUser();
  const { mutate: updateUser, isPending } = useUpdateUserMutation();
  const { data: profile, isLoading, isError } = useFetchProfileQuery();

  const formik = useFormik<UserProfileForm>({
    initialValues: {
      fullName: profile?.fullName || '',
      phone: profile?.phone || '',
      email: profile?.email || '',
    },
    enableReinitialize: true,
    validate,
    validateOnChange: true,
    onSubmit: values => {
      const result = userProfileSchema.safeParse(values);
      if (result.success) {
        console.log('Sending user data:', result.data);
        updateUser(result.data);
      } else {
        console.log('Validation failed:', result.error);
      }
    },
  });

  const isFormValid = userProfileSchema.safeParse(formik.values).success;

  const navigateToChangePassword = () => {
    // TODO: Implement change password logic
    console.warn('change password');
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete your account',
      'This action is irreversible. Your data will be permanently removed.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Yes, delete',
          style: 'destructive',
          onPress: () => {
            // TODO: Implement delete account logic
            console.warn('delete account');
          },
        },
      ]
    );
  };
  return {
    formik,
    isLoading,
    isPending,
    isError,
    isFormValid,
    navigateToChangePassword,
    handleDeleteAccount,
  };
};
