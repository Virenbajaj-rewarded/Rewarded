import { ProgramsStatistic } from '../../components/ProgramsStatistic';
import { ProgramItem } from '../../components/ProgramItem';
import { CreateProgramButton } from '../../components/CreateProgramButton';
import { TopUpModal } from '../../components/TopUpModal';
import { useDraftPrograms } from './useDraftPrograms';
import { Button } from '@/components/ui/button';
import { EProgramStatus } from '@/enums';
import { IProgram } from '@/interfaces';

const DraftPrograms = () => {
  const {
    draftPrograms,
    isFetchProgramsLoading,
    isFetchProgramsError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    activateProgram,
    activateProgramLoading,
    handleTopUpProgram,
    isTopUpModalOpen,
    setIsTopUpModalOpen,
    selectedProgram,
    handleTopUp,
    topUpProgramLoading,
  } = useDraftPrograms();

  if (isFetchProgramsLoading) {
    return <div>Loading...</div>;
  }

  if (isFetchProgramsError) {
    return <div>Error fetching programs</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Draft Programs</h1>
        <CreateProgramButton />
      </div>
      <ProgramsStatistic />
      {draftPrograms.length > 0 ? (
        <>
          <div className="grid lg:grid-cols-2 md:grid-cols-1 gap-4">
            {draftPrograms.map(program => (
              <ProgramItem
                key={program.id}
                program={program as IProgram & { status: EProgramStatus.DRAFT }}
                activateProgram={activateProgram}
                activateProgramLoading={activateProgramLoading}
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
        <div className="text-center text-gray-500">No draft programs</div>
      )}
      <TopUpModal
        open={isTopUpModalOpen}
        onOpenChange={setIsTopUpModalOpen}
        program={selectedProgram}
        onTopUp={handleTopUp}
        isLoading={topUpProgramLoading}
      />
    </div>
  );
};

export default DraftPrograms;
