import { useMemo, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useMyStores as useStoresService } from '@/services/stores/useStores';
import { EIndustry } from '@/enums';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/routes';
import { useUser } from '@/services/user/useUser';
import { useDebounce } from '@/hooks';
import { useFetchBalanceQuery } from '@/services/user/useUser';
import { IStoreListItem } from '@/services/stores/stores.types';

export const useDiscover = () => {
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);

  const navigate = useNavigate();
  const {
    useFetchAllStoresQuery,
    likeStore,
    unlikeStore,
    likeStoreLoading,
    unlikeStoreLoading,
  } = useStoresService();
  const { useFetchProfileQuery } = useUser();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(
    () => searchParams.get('search') || ''
  );
  const [isLeaveProgramModalOpen, setIsLeaveProgramModalOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState<IStoreListItem | null>(
    null
  );

  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const selectedIndustry = searchParams.get('industry') as EIndustry | null;

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useFetchAllStoresQuery(selectedIndustry, debouncedSearchQuery);

  const { data: profile } = useFetchProfileQuery();
  const {
    data: balance,
    isRefetching: isBalanceRefetching,
    isLoading: isBalanceLoading,
  } = useFetchBalanceQuery();

  const stores = useMemo(
    () => data?.pages.flatMap(page => page.items) || [],
    [data]
  );

  const openLeaveProgramModal = () => setIsLeaveProgramModalOpen(true);

  const closeLeaveProgramModal = () => {
    setIsLeaveProgramModalOpen(false);
  };

  useEffect(() => {
    const newSearchParams = new URLSearchParams(searchParams);
    if (debouncedSearchQuery) {
      newSearchParams.set('search', debouncedSearchQuery);
    } else {
      newSearchParams.delete('search');
    }
    setSearchParams(newSearchParams, { replace: true });
  }, [debouncedSearchQuery, searchParams, setSearchParams]);

  const handleIndustryChange = (industry: EIndustry | null) => {
    const newSearchParams = new URLSearchParams(searchParams);
    if (industry) {
      newSearchParams.set('industry', industry);
    } else {
      newSearchParams.delete('industry');
    }
    setSearchParams(newSearchParams, { replace: true });
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
  };

  const handleStoreClick = (businessCode: string) => {
    navigate(ROUTES.STORE_PROFILE.replace(':businessCode', businessCode));
  };

  const handleLikeStore = async (storeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await likeStore(storeId);
  };

  const leaveProgram = async (storeId: string) => {
    await unlikeStore(storeId);
    closeLeaveProgramModal();
  };

  const handleUnlikeStore = async (storeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const store = stores.find(store => store.id === storeId);
    setSelectedStore(store);

    if (store?.activeRewardProgram) {
      openLeaveProgramModal();
    } else {
      await unlikeStore(storeId);
    }
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
    handleSearchChange,
    searchQuery,
    handleStoreClick,
    handleLikeStore,
    handleUnlikeStore,
    likeStoreLoading,
    unlikeStoreLoading,
    balance,
    profileId: profile?.id || null,
    isLeaveProgramModalOpen,
    closeLeaveProgramModal,
    selectedStore,
    leaveProgram,
    isQRModalOpen,
    setIsQRModalOpen,
  };
};
