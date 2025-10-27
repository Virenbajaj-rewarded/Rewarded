import { useFormik } from 'formik';
import { useState } from 'react';
import { useUser } from '@/services/user/useUser';
import { profileValidationSchema, Profile } from './Profile.validation';
import { useNavigate } from 'react-router-dom';

export const useProfile = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const navigate = useNavigate();
  const { useFetchProfileQuery, useUpdateUserMutation } = useUser();
  const { mutate: updateUser, isPending } = useUpdateUserMutation();
  const { data: profile, isLoading, isError } = useFetchProfileQuery();

  const formik = useFormik<Profile>({
    initialValues: {
      fullName: profile?.fullName || '',
      phone: profile?.phone || '',
      email: profile?.email || '',
    },
    enableReinitialize: true,
    validationSchema: profileValidationSchema,
    onSubmit: values => {
      updateUser(values);
    },
  });

  const navigateToChangePassword = () => {
    navigate('/change-password');
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
