import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription } from '@/components/ui/card';
import { useFetchBalanceQuery } from '@/services/user/useUser';
import USDIcon from '@/assets/usd.svg?react';

type StatisticItem = {
  id: string;
  label: string;
  value: string;
  backgroundClass: string;
  icon?: ReactNode;
};

export const ProgramsStatistic = () => {
  const { data: merchantBalance, isLoading } = useFetchBalanceQuery();

  const stats: StatisticItem[] = [
    {
      id: 'points-issued',
      label: 'Points Issued',
      value: merchantBalance.toString() ?? '0',
      backgroundClass: 'bg-[#0B1A33] text-white',
    },
    {
      id: 'available-usd',
      label: 'Available USD',
      value: merchantBalance ? `${merchantBalance}` : '$0',
      backgroundClass: 'bg-[#1F1F1F] text-white',
      icon: <USDIcon className="h-5 w-5 text-white" aria-hidden="true" />,
    },
    {
      id: 'available-usdc',
      label: 'Available USDC',
      value: merchantBalance ? `${merchantBalance}` : '$0',
      backgroundClass: 'bg-[#1F1F1F] text-white',
      icon: <USDIcon className="h-5 w-5 text-white" aria-hidden="true" />,
    },
  ];

  return (
    <section
      aria-label="Program statistics overview"
      className="grid grid-cols-1 gap-4 md:grid-cols-3"
    >
      {stats.map(({ id, label, value, backgroundClass, icon }) => (
        <Card
          key={id}
          className={cn(
            'flex h-full flex-col justify-between rounded-2xl border-none p-6 shadow-sm transition-colors',
            backgroundClass,
            isLoading && 'animate-pulse'
          )}
        >
          <CardDescription className="text-sm font-medium text-muted-foreground/80">
            {label}
          </CardDescription>
          <CardContent className="flex items-end justify-between p-0 pt-3">
            <span className="text-3xl font-semibold text-white">{value}</span>
            {icon ? <span className="text-white">{icon}</span> : null}
          </CardContent>
        </Card>
      ))}
    </section>
  );
};

export default ProgramsStatistic;
