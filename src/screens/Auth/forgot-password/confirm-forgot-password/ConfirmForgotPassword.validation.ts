import * as Yup from 'yup';

export const confirmCodeValidationSchema = Yup.object().shape({
  code: Yup.string()
    .length(6, 'Code must be exactly 6 digits')
    .matches(/^\d+$/, 'Code must contain only numbers')
    .required('Code is required'),
});
