import { ProgramsStatistic } from '../../components/ProgramsStatistic';
import { ProgramItem } from '../../components/ProgramItem';
import { CreateProgramButton } from '../../components/CreateProgramButton';
import { TopUpModal } from '../../components/TopUpModal';
import { StopProgramModal } from '../../components/StopProgramModal';
import { useActivePrograms } from './useActivePrograms';
import { Button } from '@/components/ui/button';
import { EProgramStatus } from '@/enums';
import { IProgram } from '@/interfaces';

const ActivePrograms = () => {
  const {
    activePrograms,
    handleStopProgram,
    stopProgramLoading,
    isFetchProgramsLoading,
    isFetchProgramsError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    handleTopUpProgram,
    isTopUpModalOpen,
    setIsTopUpModalOpen,
    selectedProgram,
    handleTopUp,
    topUpProgramLoading,
    isStopModalOpen,
    setIsStopModalOpen,
    selectedStopProgramId,
    selectedStopProgramStrategy,
    handleStop,
  } = useActivePrograms();

  if (isFetchProgramsLoading) {
    return <div>Loading...</div>;
  }

  if (isFetchProgramsError) {
    return <div>Error fetching programs</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Active Programs</h1>
        <CreateProgramButton />
      </div>
      <ProgramsStatistic />
      {activePrograms.length > 0 ? (
        <>
          <div className="grid lg:grid-cols-2 md:grid-cols-1 gap-4">
            {activePrograms.map(program => (
              <ProgramItem
                key={program.id}
                program={
                  program as IProgram & { status: EProgramStatus.ACTIVE }
                }
                handleStopProgram={handleStopProgram}
                stopProgramLoading={stopProgramLoading}
                handleTopUpProgram={handleTopUpProgram}
              />
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
        <div className="text-center text-gray-500">No active programs</div>
      )}
      <TopUpModal
        open={isTopUpModalOpen}
        onOpenChange={setIsTopUpModalOpen}
        program={selectedProgram}
        onTopUp={handleTopUp}
        isLoading={topUpProgramLoading}
      />
      <StopProgramModal
        open={isStopModalOpen}
        onOpenChange={setIsStopModalOpen}
        programId={selectedStopProgramId}
        programStrategy={selectedStopProgramStrategy}
        onStop={handleStop}
        isLoading={stopProgramLoading}
      />
    </div>
  );
};

export default ActivePrograms;
