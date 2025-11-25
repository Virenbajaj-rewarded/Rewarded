import { useNavigate } from 'react-router-dom';
import { useMerchant } from '@/services/merchant/useMerchant';
import { ROUTES } from '@/routes';

export const useBusiness = () => {
  const navigate = useNavigate();
  const { useFetchMerchantProfileQuery } = useMerchant();
  const { data: merchant, isLoading, isError } = useFetchMerchantProfileQuery();

  const navigateToEdit = () => {
    navigate(ROUTES.EDIT_BUSINESS_PROFILE);
  };

  return {
    merchant,
    isLoading,
    isError,
    navigateToEdit,
  };
};
