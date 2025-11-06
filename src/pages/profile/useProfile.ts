import { useFormik } from 'formik';
import { useState } from 'react';
import { useUser } from '@/services/user/useUser';
import { profileValidationSchema, Profile } from './Profile.validation';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/services/auth/useAuth';
import { ROUTES } from '@/routes';

export const useProfile = () => {
  const [isDeleteAccountModalVisible, setIsDeleteAccountModalVisible] =
    useState(false);
  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);
  const navigate = useNavigate();
  const { useFetchProfileQuery, useUpdateUserMutation } = useUser();
  const { mutate: updateUser, isPending } = useUpdateUserMutation();
  const { data: profile, isLoading, isError } = useFetchProfileQuery();
  const { logout } = useAuth();

  const showLogoutModal = () => setIsLogoutModalVisible(true);
  const hideLogoutModal = () => setIsLogoutModalVisible(false);

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN);
  };

  const formik = useFormik<Profile>({
    initialValues: {
      fullName: profile?.fullName || '',
      phone: profile?.phone || '',
      email: profile?.email || '',
    },
    enableReinitialize: true,
    validationSchema: profileValidationSchema,
    onSubmit: values => {
      updateUser({ fullName: values.fullName });
    },
  });

  const navigateToChangePassword = () => {
    navigate(ROUTES.CHANGE_PASSWORD);
  };

  const showDeleteAccountModal = () => {
    setIsDeleteAccountModalVisible(true);
  };

  const hideDeleteAccountModal = () => {
    setIsDeleteAccountModalVisible(false);
  };

  const handleDeleteAccount = () => {
    // TODO: Implement delete account logic
    console.warn('delete account');
    hideDeleteAccountModal();
  };
  return {
    formik,
    isLoading,
    isPending,
    isError,
    navigateToChangePassword,
    handleDeleteAccount,
    isDeleteAccountModalVisible,
    showDeleteAccountModal,
    hideDeleteAccountModal,
    handleLogout,
    isLogoutModalVisible,
    showLogoutModal,
    hideLogoutModal,
  };
};
