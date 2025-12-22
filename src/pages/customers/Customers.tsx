import CustomerStatistic from './components/CustomerStatistic';
import { useCustomers } from './useCustomers';
import { Button } from '../../components/ui/button';
import IncomingIcon from '@/assets/incoming.svg?react';
import SpentIcon from '@/assets/spent.svg?react';

const Customers = () => {
  const {
    customers,
    isCustomersLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useCustomers();

  if (isCustomersLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Customers</h1>
      </div>

      <CustomerStatistic />
      <h3 className="text-2xl font-bold text-white">Users List</h3>
      {customers.length > 0 ? (
        <>
          <div className="flex flex-col gap-4">
            {customers.map(customer => (
              <div
                key={customer.customerId}
                className="bg-[#141414] flex p-4 rounded-lg justify-between align-center"
              >
                <h5 className="text-md text-white font-medium">
                  {customer.fullName}
                </h5>
                <div className="flex gap-6">
                  <div className="flex items-center gap-1">
                    <SpentIcon />
                    <span className="text-sm text-[#BFBFBF] ">
                      {customer.spent}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <IncomingIcon />
                    <span className="text-sm text-[#BFBFBF]">
                      {customer.earned}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {hasNextPage && (
            <div className="flex justify-center mt-6">
              <Button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                variant="outline"
              >
                {isFetchingNextPage ? 'Loading...' : 'Load More'}
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center text-gray-500">No customers</div>
      )}
    </div>
  );
};

export default Customers;
