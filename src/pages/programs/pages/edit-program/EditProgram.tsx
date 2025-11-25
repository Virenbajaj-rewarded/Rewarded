import { useEditProgram } from './useEditProgram';
import { ProgramForm } from '../../components/ProgramForm';

const EditProgram = () => {
  const {
    formik,
    editProgramLoading,
    handlePayProgram,
    activateProgram,
    initialBudget,
  } = useEditProgram();

  return (
    <div className="flex justify-center px-4">
      <ProgramForm
        formik={formik}
        title="Edit Program"
        showPayButton={true}
        loading={editProgramLoading}
        handlePayProgram={handlePayProgram}
        activateProgram={activateProgram}
        initialBudget={initialBudget}
      />
    </div>
  );
};

export default EditProgram;
