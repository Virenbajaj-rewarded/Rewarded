import { useMyStores as useMyStoresService } from '@/services/stores/useStores';
import { EIndustry, EIndustryDisplayNames, ERole } from '@/enums';
import { useMemo, useState, useCallback } from 'react';
import { IStoreListItem } from '@/services/stores/stores.types';
import { useFocusEffect } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '@/services/user/useUser';
import { useFetchBalanceQuery } from '@/services/user/useUser';
import { Paths } from '@/navigation/paths';
import { useDebounce } from '@/hooks';

const DEBOUNCE_DELAY = 400;

export const useDiscover = () => {
  const navigation = useNavigation();
  const [isLeaveProgramModalOpen, setIsLeaveProgramModalOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState<IStoreListItem | null>(null);
  const [selectedStoreType, setSelectedStoreType] = useState<EIndustry | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const { useFetchAllStoresQuery, likeStore, unlikeStore } = useMyStoresService();
  const openLeaveProgramModal = () => setIsLeaveProgramModalOpen(true);
  const closeLeaveProgramModal = () => setIsLeaveProgramModalOpen(false);

  const debouncedSearchTerm = useDebounce(searchQuery, DEBOUNCE_DELAY);

  const { useFetchProfileQuery } = useUser();
  const { data: profile } = useFetchProfileQuery();
  const {
    data: balance,
    isRefetching: isBalanceRefetching,
    isLoading: isBalanceLoading,
  } = useFetchBalanceQuery();

  const {
    data,
    isLoading: isFetchStoresLoading,
    isError: isFetchStoresError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isRefetching: isFetchStoresRefetching,
  } = useFetchAllStoresQuery(selectedStoreType, debouncedSearchTerm || undefined);

  const handleStoreTypeChange = (storeType: EIndustry | null) => {
    setSelectedStoreType(storeType);
  };

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const stores = useMemo(() => data?.pages.flatMap(page => page.items) ?? [], [data]);

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  const industryOptions = useMemo(
    () => [
      { value: null, label: 'All Industries' },
      ...Object.entries(EIndustryDisplayNames).map(([key, value]) => ({
        value: key as EIndustry,
        label: value,
      })),
    ],
    []
  );

  const handleLikeStore = async (storeId: string) => {
    await likeStore(storeId);
  };

  const leaveProgram = async (storeId: string) => {
    await unlikeStore(storeId);
    closeLeaveProgramModal();
  };

  const handleUnlikeStore = async (storeId: string) => {
    const store = stores.find(store => store.id === storeId);
    setSelectedStore(store ?? null);

    if (store?.activeRewardProgram) {
      openLeaveProgramModal();
    } else {
      await unlikeStore(storeId);
    }
  };

  const handleNavigateToQR = useCallback(() => {
    if (profile?.id) {
      navigation.navigate(Paths.QR_CODE, {
        value: {
          value: profile.id || '',
          type: 'customer_profile',
          role: ERole.MERCHANT,
        },
        showText: false,
      });
    }
  }, [profile?.id, navigation]);

  return {
    stores,
    industryOptions,
    selectedStoreType,
    handleStoreTypeChange,
    searchQuery,
    handleSearchChange,
    isFetchStoresLoading,
    isFetchStoresError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isFetchStoresRefetching,
    handleLikeStore,
    handleUnlikeStore,
    isLeaveProgramModalOpen,
    closeLeaveProgramModal,
    selectedStore,
    leaveProgram,
    handleNavigateToQR,
    balance,
    isBalanceLoading,
    isBalanceRefetching,
  };
};
