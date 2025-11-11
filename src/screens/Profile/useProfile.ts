import { useFormik } from 'formik';
import { useState } from 'react';
import { useUser } from '@/services/user/useUser';
import { useAuth } from '@/services/auth/useAuth';
import { useNavigation } from '@react-navigation/native';
import { Paths } from '@/navigation/paths';
import { profileValidationSchema, ProfileForm } from './profileValidationSchema';

export const useProfile = () => {
  const [isDeleteAccountModalVisible, setIsDeleteAccountModalVisible] = useState(false);
  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);
  const navigation = useNavigation();

  const { signOut } = useAuth();
  const { useFetchProfileQuery, useUpdateUserMutation } = useUser();
  const { mutate: updateUser, isPending } = useUpdateUserMutation();
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
      updateUser({ fullName: values.fullName });
    },
  });

  const navigateToChangePassword = () => navigation.navigate(Paths.CHANGE_PASSWORD);

  const showDeleteAccountModal = () => setIsDeleteAccountModalVisible(true);
  const hideDeleteAccountModal = () => setIsDeleteAccountModalVisible(false);

  const showLogoutModal = () => setIsLogoutModalVisible(true);
  const hideLogoutModal = () => setIsLogoutModalVisible(false);

  const handleDeleteAccount = () => {
    // TODO: Implement delete account logic
    console.warn('delete account');
    hideDeleteAccountModal();
  };

  const handleLogout = async () => {
    hideLogoutModal();
    signOut();
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
