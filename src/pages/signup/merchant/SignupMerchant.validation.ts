import * as Yup from 'yup';

export const merchantValidationSchema = Yup.object().shape({
  fullName: Yup.string().required('Full name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  phoneNumber: Yup.string()
    .matches(
      /^\+?\d{8,}$/,
      'Phone number must contain only numbers and optionally start with +'
    )
    .required('Phone number is required'),
  businessName: Yup.string().required('Business name is required'),
  location: Yup.object().shape({
    address: Yup.string().required('Address is required'),
    latitude: Yup.number().required('Latitude is required'),
    longitude: Yup.number().required('Longitude is required'),
  }),
  industry: Yup.string().required('Industry is required'),
  agreedToTerms: Yup.boolean()
    .test(
      'is-true',
      'You must agree to the terms and conditions',
      value => value === true
    )
    .required('You must agree to the terms and conditions'),
});
