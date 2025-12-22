import * as Yup from 'yup';

export const creditPointsValidationSchema = Yup.object().shape({
  amount: Yup.number().required('Amount is required'),
  comment: Yup.string().optional(),
});
