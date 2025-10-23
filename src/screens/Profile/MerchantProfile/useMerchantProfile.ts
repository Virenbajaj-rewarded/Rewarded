import { useFormik } from 'formik';
import { useState } from 'react';
import { useUser } from '@/services/user/useUser';
import { useNavigation } from '@react-navigation/native';
import { Paths } from '@/navigation/paths';
import { profileValidationSchema, ProfileForm } from '../validation/profileValidationSchema';

export const useMerchantProfile = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const navigation = useNavigation();
  const { useFetchProfileQuery, useUpdateUserMutation } = useUser();
  const { isPending } = useUpdateUserMutation();
  const { data: profile, isLoading, isError } = useFetchProfileQuery();

  const formik = useFormik<ProfileForm>({
    initialValues: {
      fullName: profile?.fullName || '',
      phone: profile?.phone || '',
      email: profile?.email || '',
    },
    enableReinitialize: true,
    validationSchema: profileValidationSchema,
    onSubmit: values => {
      // TODO: Implement update merchant profile mutation
      // updateUser(values);
    },
  });

  const navigateToChangePassword = () => {
    navigation.navigate(Paths.CHANGE_PASSWORD);
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const hideModal = () => {
    setIsModalVisible(false);
  };

  const handleDeleteAccount = () => {
    // TODO: Implement delete account logic
    console.warn('delete account');
    hideModal();
  };
  return {
    formik,
    isLoading,
    isPending,
    isError,
    navigateToChangePassword,
    handleDeleteAccount,
    isModalVisible,
    showModal,
    hideModal,
  };
};
