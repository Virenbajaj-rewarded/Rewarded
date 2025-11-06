import * as Yup from 'yup';
export const confirmCodeValidationSchema = Yup.object().shape({
  code: Yup.string()
    .required('Code is required')
    .matches(/^\d+$/, 'Code must contain only numbers')
    .length(6, 'Code must be exactly 6 digits'),
});
