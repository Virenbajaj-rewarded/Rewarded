import * as Yup from 'yup';

export const topUpProgramValidationSchema = Yup.object().shape({
  amount: Yup.number().required('Points are required'),
});
