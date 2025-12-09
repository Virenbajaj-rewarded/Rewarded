import { IProgram } from '@/interfaces';
import {
  EProgramStatus,
  EProgramStrategy,
  EProgramStrategyDisplayNames,
} from '@/enums';
import { useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Tag } from '@/components/ui/tag';
import EditIcon from '@/assets/edit.svg?react';
import USDIcon from '@/assets/usd.svg?react';
import StopIcon from '@/assets/stop.svg?react';
import RenewIcon from '@/assets/renew.svg?react';
import { useNavigate } from 'react-router-dom';

const capitalize = (str: string): string => {
  return str.charAt(0) + str.slice(1).toLowerCase();
};

type ActiveProgramItemProps = {
  program: IProgram & { status: EProgramStatus.ACTIVE };
  handleStopProgram: (id: string, strategy: EProgramStrategy) => void;
  stopProgramLoading: boolean;
  handleTopUpProgram: (program: IProgram) => void;
};

type DraftProgramItemProps = {
  program: IProgram & { status: EProgramStatus.DRAFT };
  activateProgram: (id: string) => void;
  activateProgramLoading: boolean;
  handleTopUpProgram: (program: IProgram) => void;
};

type StoppedProgramItemProps = {
  program: IProgram & { status: EProgramStatus.STOPPED };
  handleRenewProgram: (id: string) => void;
  renewProgramLoading: boolean;
  handleWithdrawProgram: (id: string) => void;
  withdrawProgramLoading: boolean;
  handleTopUpProgram: (program: IProgram) => void;
};

type ProgramItemProps =
  | ActiveProgramItemProps
  | DraftProgramItemProps
  | StoppedProgramItemProps;

export const ProgramItem = ({ program, ...props }: ProgramItemProps) => {
  const navigate = useNavigate();
  const {
    status,
    name,
    budget,
    strategy,
    percentBack,
    maxDailyBudget,
    spendThreshold,
    rewardPercent,
    id,
  } = program;

  const handleEditClick = () => {
    navigate(`/programs/edit/${id}`, { state: { program } });
  };

  const getProgramStatusTextColor = useCallback(() => {
    switch (status) {
      case EProgramStatus.ACTIVE:
        return '#73D13D';
      case EProgramStatus.DRAFT:
        return '#D48806';
      case EProgramStatus.STOPPED:
        return '#FF4D4F';
      default:
        return '#FFFFFF';
    }
  }, [status]);

  const getProgramStatusBackgroundColor = useCallback(() => {
    switch (status) {
      case EProgramStatus.ACTIVE:
        return '#092B00';
      case EProgramStatus.DRAFT:
        return '#613400';
      case EProgramStatus.STOPPED:
        return '#5C0011';
      default:
        return '#6B7280';
    }
  }, [status]);

  const getProgramStrategyTextColor = useCallback(() => {
    switch (strategy) {
      case EProgramStrategy.PERCENT_BACK:
        return '#639CF8';
      case EProgramStrategy.SPEND_TO_EARN:
        return '#9254DE';
      default:
        return '#FFFFFF';
    }
  }, [strategy]);

  const getProgramStrategyBackground = useCallback(() => {
    switch (strategy) {
      case EProgramStrategy.PERCENT_BACK:
        return '#0C1A31';
      case EProgramStrategy.SPEND_TO_EARN:
        return '#120338';
      default:
        return '#FFFFFF';
    }
  }, [strategy]);

  const renderButtons = useCallback(() => {
    switch (status) {
      case EProgramStatus.ACTIVE: {
        const { handleStopProgram, stopProgramLoading, handleTopUpProgram } =
          props as ActiveProgramItemProps;
        return (
          <>
            <Button
              variant="default"
              onClick={() => handleTopUpProgram(program)}
              className="w-full md:w-1/2 bg-[#0C1A31] text-[#639CF8] hover:bg-[#0C1A31]/80"
            >
              Top Up
            </Button>
            <Button
              variant="outline"
              onClick={() => handleStopProgram(id, strategy)}
              disabled={stopProgramLoading}
              className="border-[#FF4D4F] text-[#FF4D4F] hover:bg-[#FF4D4F]/10 w-full md:w-1/2"
            >
              <StopIcon className="h-4 w-4" />
              Stop
            </Button>
          </>
        );
      }
      case EProgramStatus.DRAFT: {
        const { activateProgram, activateProgramLoading, handleTopUpProgram } =
          props as DraftProgramItemProps;
        return (
          <>
            <Button
              variant="default"
              onClick={() => handleTopUpProgram(program)}
              className="w-full md:w-1/2 bg-[#0C1A31] text-[#639CF8] hover:bg-[#0C1A31]/80"
            >
              Top Up
            </Button>
            <Button
              variant="default"
              onClick={() => activateProgram(id)}
              disabled={activateProgramLoading}
              className="w-full md:w-1/2 text-white bg-[#3C83F6]"
            >
              {activateProgramLoading ? 'Activating...' : 'Set as active'}
            </Button>
          </>
        );
      }
      case EProgramStatus.STOPPED: {
        const {
          handleRenewProgram,
          renewProgramLoading,
          handleWithdrawProgram,
          withdrawProgramLoading,
          handleTopUpProgram,
        } = props as StoppedProgramItemProps;
        return (
          <div className="flex flex-col flex-1 gap-2">
            <div className="flex gap-2">
              <Button
                variant="default"
                onClick={() => handleWithdrawProgram(id)}
                disabled={withdrawProgramLoading}
                className="w-full md:w-1/2 bg-[#0C1A31] text-[#639CF8] hover:bg-[#0C1A31]/80"
              >
                <RenewIcon className="h-4 w-4" color="#639CF8" />
                {withdrawProgramLoading ? 'Withdrawing...' : 'Withdraw'}
              </Button>
              <Button
                variant="default"
                onClick={() => handleRenewProgram(id)}
                disabled={renewProgramLoading}
                className="w-full md:w-1/2 text-white bg-[#3C83F6]"
              >
                <USDIcon className="h-4 w-4" />
                {renewProgramLoading ? 'Renewing...' : 'Renew'}
              </Button>
            </div>
            <Button
              variant="link"
              onClick={() => handleTopUpProgram(program)}
              className="w-full"
            >
              Top Up
            </Button>
          </div>
        );
      }
    }
  }, [status, props, id, program, strategy]);

  return (
    <Card className="bg-[#141414] border-border flex flex-col h-full">
      <CardHeader className="pb-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-normal text-white">{name}</h3>
          <span className="text-2xl font-semibold text-white">${budget}</span>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col flex-1 min-h-0 p-6 pt-0">
        <div className="space-y-4 mb-4">
          <div className="flex gap-2 flex-wrap items-center justify-between">
            <div className="flex gap-2 flex-wrap">
              <Tag
                textColor={getProgramStatusTextColor()}
                backgroundColor={getProgramStatusBackgroundColor()}
              >
                {capitalize(status)}
              </Tag>
              <Tag
                textColor={getProgramStrategyTextColor()}
                backgroundColor={getProgramStrategyBackground()}
              >
                {EProgramStrategyDisplayNames[strategy]}
              </Tag>
            </div>
            {status === EProgramStatus.DRAFT && (
              <button
                type="button"
                onClick={handleEditClick}
                className="cursor-pointer hover:opacity-80 transition-opacity"
                aria-label="Edit program"
              >
                <EditIcon className="h-6 w-6" />
              </button>
            )}
            {status === EProgramStatus.STOPPED && (
              <USDIcon className="h-6 w-6" color="#639CF8" />
            )}
          </div>

          <div className="space-y-2 text-white">
            <div className="flex items-center justify-between">
              <span className="font-medium text-[#BFBFBF]">
                {EProgramStrategyDisplayNames[strategy]}
              </span>{' '}
              <span className="font-medium text-white ">
                {percentBack ? `${percentBack}` : 'N/A'}
              </span>
            </div>
            {maxDailyBudget && (
              <div className="flex items-center justify-between">
                <span className="font-medium text-[#BFBFBF]">
                  Max Daily Budget
                </span>
                <span className="font-medium text-white ">
                  ${maxDailyBudget}
                </span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="font-medium text-[#BFBFBF]">
                Target Audience
              </span>
              <span className="font-medium text-white ">All Customers</span>
            </div>
            {strategy === EProgramStrategy.SPEND_TO_EARN && (
              <div className="flex items-center justify-between">
                <span className="font-medium text-[#BFBFBF]">
                  Amount to Spend
                </span>
                <span className="font-medium text-white ">
                  ${spendThreshold}
                </span>
              </div>
            )}
            {strategy === EProgramStrategy.SPEND_TO_EARN && (
              <div className="flex items-center justify-between">
                <span className="font-medium text-[#BFBFBF]">
                  Amount of Points
                </span>
                <span className="font-medium text-white ">{rewardPercent}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-2 pt-2 mt-auto">
          {renderButtons()}
        </div>
      </CardContent>
    </Card>
  );
};
