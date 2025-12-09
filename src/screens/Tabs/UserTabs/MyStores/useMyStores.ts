import { useMyStores as useMyStoresService } from '@/services/stores/useStores';
import { EIndustry, EIndustryDisplayNames } from '@/enums';
import { useMemo, useState, useCallback } from 'react';
import { IStoreListItem } from '@/services/stores/stores.types';
import { useFocusEffect } from '@react-navigation/native';

export const useMyStores = () => {
  const [selectedStoreType, setSelectedStoreType] = useState<EIndustry | null>(null);
  const [isLeaveProgramModalOpen, setIsLeaveProgramModalOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState<IStoreListItem | null>(null);
  const { useFetchStoresQuery } = useMyStoresService();

  const { unlikeStore, unlikeStoreLoading } = useMyStoresService();
  const {
    data,
    isLoading: isFetchStoresLoading,
    isError: isFetchStoresError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isRefetching: isFetchStoresRefetching,
  } = useFetchStoresQuery(selectedStoreType);

  const openLeaveProgramModal = () => {
    setIsLeaveProgramModalOpen(true);
  };
  const closeLeaveProgramModal = () => {
    setIsLeaveProgramModalOpen(false);
  };

  const handleStoreTypeChange = (storeType: EIndustry | null) => {
    setSelectedStoreType(storeType);
  };

  const stores = useMemo(() => data?.pages.flatMap(page => page.items) ?? [], [data]);

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  const industryOptions = useMemo(
    () => [
      { value: null, label: 'All industries' },
      ...Object.entries(EIndustryDisplayNames).map(([key, value]) => ({
        value: key as EIndustry,
        label: value,
      })),
    ],
    []
  );

  const leaveProgram = async (storeId: string) => {
    await unlikeStore(storeId);
    closeLeaveProgramModal();
  };

  const handleUnlikeStore = async (storeId: string) => {
    const store = stores.find(store => store.id === storeId);
    setSelectedStore(store ?? null);

    if (store?.rewardPoints && store.rewardPoints > 0) {
      openLeaveProgramModal();
    } else {
      await unlikeStore(storeId);
    }
  };

  return {
    stores,
    unlikeStore,
    unlikeStoreLoading,
    industryOptions,
    selectedStoreType,
    handleStoreTypeChange,
    isFetchStoresLoading,
    isFetchStoresError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isFetchStoresRefetching,
    isLeaveProgramModalOpen,
    selectedStore,
    openLeaveProgramModal,
    closeLeaveProgramModal,
    handleUnlikeStore,
    leaveProgram,
  };
};
