import { useNavigation } from '@react-navigation/native';
import { Paths } from '@/navigation/paths';
import { ERole } from '@/enums';
import { useState } from 'react';

export const useChooseRole = () => {
  const [selectedRole, setSelectedRole] = useState<ERole>(ERole.USER);
  const navigation = useNavigation();

  const handleNavigateToLogin = () => {
    navigation.navigate(Paths.LOGIN, {
      role: selectedRole,
    });
  };
  const handleSelectRole = (role: ERole) => {
    setSelectedRole(role);
  };

  return {
    handleSelectRole,
    handleNavigateToLogin,
    selectedRole,
  };
};
