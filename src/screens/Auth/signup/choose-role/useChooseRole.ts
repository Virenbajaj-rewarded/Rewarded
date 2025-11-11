import { useNavigation } from '@react-navigation/native';
import { Paths } from '@/navigation/paths';
import { ERole } from '@/enums';
import { useState } from 'react';
export const useChooseRole = () => {
  const [selectedRole, setSelectedRole] = useState<ERole>(ERole.USER);
  const navigation = useNavigation();

  const handleNavigateToSignup = () => {
    navigation.navigate(selectedRole === ERole.USER ? Paths.SIGNUP_USER : Paths.SIGNUP_MERCHANT);
  };
  const handleSelectRole = (role: ERole) => {
    setSelectedRole(role);
  };

  return {
    handleSelectRole,
    handleNavigateToSignup,
    selectedRole,
  };
};
