import * as Yup from 'yup';

export const userValidationSchema = Yup.object().shape({
  fullName: Yup.string().min(2, 'At least 2 characters').required('Full name is required'),
  email: Yup.string().email('Invalid email format').required('Email is required'),
  phoneNumber: Yup.string()
    .matches(/^\+?\d{8,}$/, 'Phone number must contain only numbers and optionally start with +')
    .required('Phone number is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .max(20, 'Password must be less than 20 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .min(8, 'Password confirmation is required')
    .oneOf([Yup.ref('password')], "Passwords don't match")
    .required('Password confirmation is required'),
  agreedToTerms: Yup.boolean()
    .test('is-true', 'You must agree to the terms and conditions', value => value === true)
    .required('You must agree to the terms and conditions'),
});
