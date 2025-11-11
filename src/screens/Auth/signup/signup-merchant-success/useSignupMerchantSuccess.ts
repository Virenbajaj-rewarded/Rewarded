import { useNavigation } from '@react-navigation/native';
import { Paths } from '@/navigation/paths';

export const useSignupMerchantSuccess = () => {
  const navigation = useNavigation();
  const handleNavigateToLogin = () => navigation.navigate(Paths.LOGIN);
  return {
    handleNavigateToLogin,
  };
};
