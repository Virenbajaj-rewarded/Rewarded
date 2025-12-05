import * as Yup from 'yup';

export const requestPointsValidationSchema = Yup.object().shape({
  points: Yup.number().required('Points are required'),
  comment: Yup.string().optional(),
});
