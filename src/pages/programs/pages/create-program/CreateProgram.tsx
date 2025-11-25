import { useCreateProgram } from './useCreateProgram';
import { ProgramForm } from '../../components/ProgramForm';

const CreateProgram = () => {
  const { formik, createProgramLoading, handlePayProgram, activateProgram } =
    useCreateProgram();

  return (
    <div className="flex justify-center px-4">
      <ProgramForm
        formik={formik}
        title="Create New Program"
        showPayButton={true}
        loading={createProgramLoading}
        handlePayProgram={handlePayProgram}
        activateProgram={activateProgram}
      />
    </div>
  );
};

export default CreateProgram;
