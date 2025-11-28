import * as Yup from 'yup';

export const userValidationSchema = Yup.object().shape({
  fullName: Yup.string().required('Full name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  phoneNumber: Yup.string()
    .matches(
      /^\+?\d{8,}$/,
      'Phone number must contain only numbers and optionally start with +'
    )
    .required('Phone number is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .max(20, 'Password must be less than 20 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
  agreedToTerms: Yup.boolean()
    .test(
      'is-true',
      'You must agree to the terms and conditions',
      value => value === true
    )
    .required('You must agree to the terms and conditions'),
});
