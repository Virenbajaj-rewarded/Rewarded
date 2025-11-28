import { useNavigation } from '@react-navigation/native';
import { Paths } from '@/navigation/paths';
import { ERole } from '@/enums';

export const useSignupMerchantSuccess = () => {
  const navigation = useNavigation();
  const handleNavigateToLogin = () => navigation.navigate(Paths.LOGIN, { role: ERole.MERCHANT });
  return {
    handleNavigateToLogin,
  };
};
