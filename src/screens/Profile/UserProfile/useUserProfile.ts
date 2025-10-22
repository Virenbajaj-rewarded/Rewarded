import { useFormik } from 'formik';

import { useUser } from '@/services/user/useUser';
import { Alert } from 'react-native';
import { UserProfileForm, userProfileSchema } from './types';
import { useNavigation } from '@react-navigation/native';
import { Paths } from '@/navigation/paths';
import { userProfileValidationSchema } from './UserProfile.validation';

export const useUserProfile = () => {
  const navigation = useNavigation();
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
    validationSchema: userProfileValidationSchema,
    onSubmit: values => {
      updateUser(values);
    },
  });

  const isFormValid = userProfileSchema.safeParse(formik.values).success;

  const navigateToChangePassword = () => {
    navigation.navigate(Paths.CHANGE_PASSWORD);
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
