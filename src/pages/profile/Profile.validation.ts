import * as Yup from 'yup';

export const profileValidationSchema = Yup.object().shape({
  fullName: Yup.string().required('Full name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  phone: Yup.string()
    .min(8, 'Phone number must be at least 8 characters')
    .required('Phone number is required'),
});

export type Profile = Yup.InferType<typeof profileValidationSchema>;
