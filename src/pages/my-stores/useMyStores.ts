import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useMyStores as useStoresService } from '@/services/stores/useStores';
import { EIndustry } from '../../enums';
import { useState } from 'react';
import { IStoreListItem } from '@/services/stores/stores.types';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/routes';

export const useMyStores = () => {
  const navigate = useNavigate();
  const { useFetchMyStoresQuery, unlikeStore, unlikeStoreLoading } =
    useStoresService();
  const [isLeaveProgramModalOpen, setIsLeaveProgramModalOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState<IStoreListItem | null>(
    null
  );
  const [searchParams, setSearchParams] = useSearchParams();

  const openLeaveProgramModal = () => {
    setIsLeaveProgramModalOpen(true);
  };
  const closeLeaveProgramModal = () => {
    setIsLeaveProgramModalOpen(false);
  };

  const selectedIndustry = searchParams.get('industry') as EIndustry | null;

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useFetchMyStoresQuery(selectedIndustry);

  const stores = useMemo(
    () => data?.pages.flatMap(page => page.items) || [],
    [data]
  );

  const setSelectedIndustry = (industry: EIndustry | null) => {
    const newSearchParams = new URLSearchParams(searchParams);
    if (industry) {
      newSearchParams.set('industry', industry);
    } else {
      newSearchParams.delete('industry');
    }
    setSearchParams(newSearchParams, { replace: true });
  };

  const leaveProgram = async (storeId: string) => {
    await unlikeStore(storeId);
    closeLeaveProgramModal();
  };

  const handleUnlikeStore = async (storeId: string) => {
    const store = stores.find(store => store.id === storeId);
    setSelectedStore(store);

    if (store?.activeRewardProgram) {
      openLeaveProgramModal();
    } else {
      await unlikeStore(storeId);
    }
  };

  const handleIndustryChange = (industry: EIndustry | null) => {
    setSelectedIndustry(industry);
  };

  const handleStoreClick = (businessCode: string) => {
    navigate(ROUTES.STORE_PROFILE.replace(':businessCode', businessCode));
  };

  return {
    stores,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    selectedIndustry: selectedIndustry || null,
    handleIndustryChange,
    handleUnlikeStore,
    leaveProgram,
    isLeaveProgramModalOpen,
    closeLeaveProgramModal,
    selectedStore,
    unlikeStoreLoading,
    handleStoreClick,
  };
};
