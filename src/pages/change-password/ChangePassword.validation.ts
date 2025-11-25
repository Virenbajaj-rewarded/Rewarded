import * as Yup from 'yup';

export const changePasswordValidationSchema = Yup.object().shape({
  oldPassword: Yup.string().required('Current password is required'),
  newPassword: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .max(20, 'Password must be less than 16 characters')
    .notOneOf(
      [Yup.ref('oldPassword')],
      'New password must be different from current password'
    )
    .required('New password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword')], 'Passwords must match')
    .required('Confirm new password is required'),
});
