import { ProgramsStatistic } from '../../components/ProgramsStatistic';
import { ProgramItem } from '../../components/ProgramItem';
import { CreateProgramButton } from '../../components/CreateProgramButton';
import { useStoppedPrograms } from './useStoppedPrograms';
import { Button } from '@/components/ui/button';
import { EProgramStatus } from '@/enums';
import { IProgram } from '@/interfaces';

const StoppedPrograms = () => {
  const {
    stoppedPrograms,
    handleRenewProgram,
    renewProgramLoading,
    handleWithdrawProgram,
    withdrawProgramLoading,
    isFetchProgramsLoading,
    isFetchProgramsError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useStoppedPrograms();

  if (isFetchProgramsLoading) {
    return <div>Loading...</div>;
  }

  if (isFetchProgramsError) {
    return <div>Error fetching programs</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Stopped Programs</h1>
        <CreateProgramButton />
      </div>
      <ProgramsStatistic />
      {stoppedPrograms.length > 0 ? (
        <>
          <div className="grid lg:grid-cols-2 md:grid-cols-1 gap-4">
            {stoppedPrograms.map(program => (
              <ProgramItem
                key={program.id}
                program={
                  program as IProgram & { status: EProgramStatus.STOPPED }
                }
                handleRenewProgram={handleRenewProgram}
                renewProgramLoading={renewProgramLoading}
                handleWithdrawProgram={handleWithdrawProgram}
                withdrawProgramLoading={withdrawProgramLoading}
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
        <div className="text-center text-gray-500">No stopped programs</div>
      )}
    </div>
  );
};

export default StoppedPrograms;
