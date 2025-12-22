import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription } from '@/components/ui/card';
import { useFetchCustomerStatsQuery } from '@/services/merchant/useMerchant';
import IncomingIcon from '@/assets/incoming.svg?react';
import SpentIcon from '@/assets/spent.svg?react';

type StatisticItem = {
  id: string;
  label: string;
  value: number;
  backgroundClass: string;
  labelClass: string;
  icon?: ReactNode;
};

export const CustomerStatistic = () => {
  const { data: customerStats, isLoading } = useFetchCustomerStatsQuery();
  const {
    newCustomersLastMonth,
    totalCustomers,
    totalPointsCredited,
    totalPointsRedeemed,
  } = customerStats ?? {};

  const stats: StatisticItem[] = [
    {
      id: 'total-customers',
      label: 'Total Customers',
      value: totalCustomers,
      backgroundClass: 'bg-[#3C83F6] text-white',
      labelClass: 'text-[#D8E6FD]',
    },
    {
      id: 'joined-last-month',
      label: 'Joined Last Month',
      value: newCustomersLastMonth,
      backgroundClass: 'bg-[#0C1A31] text-white',
      labelClass: 'text-[#8AB5FA]',
    },
    {
      id: 'points-earned',
      label: 'Points Earned',
      value: totalPointsRedeemed,
      backgroundClass: 'bg-[#1F1F1F] text-white',
      icon: <IncomingIcon className="h-5 w-5 text-white" aria-hidden="true" />,
      labelClass: 'text-[#8C8C8C]',
    },
    {
      id: 'points-spent',
      label: 'Points Spent',
      value: totalPointsCredited,
      backgroundClass: 'bg-[#1F1F1F] text-white',
      icon: <SpentIcon className="h-5 w-5 text-white" aria-hidden="true" />,
      labelClass: 'text-[#8C8C8C]',
    },
  ];

  return (
    <section
      aria-label="Program statistics overview"
      className="grid grid-cols-1 gap-4 md:grid-cols-4"
    >
      {stats.map(({ id, label, value, backgroundClass, labelClass, icon }) => (
        <Card
          key={id}
          className={cn(
            'flex h-full flex-col justify-between rounded-2xl border-none p-6 shadow-sm transition-colors',
            backgroundClass,
            isLoading && 'animate-pulse'
          )}
        >
          <div className="flex items-center justify-between">
            <CardDescription
              className={cn(
                'text-sm font-medium text-muted-foreground/80',
                labelClass
              )}
            >
              {label}
            </CardDescription>
            {icon ? <span className="text-white">{icon}</span> : null}
          </div>
          <CardDescription className="flex p-0 pt-3 text-3xl font-semibold text-white">
            {value}
          </CardDescription>
        </Card>
      ))}
    </section>
  );
};

export default CustomerStatistic;
