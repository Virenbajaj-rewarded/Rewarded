import * as Yup from 'yup';

export const createCreditPointValidationSchema = (balance: number) =>
  Yup.object().shape({
    points: Yup.string()
      .required('Points are required')
      .matches(/^\d+(\.\d+)?$/, 'Only numbers are allowed')
      .test('min-value', 'Must be greater than 0', value => {
        if (!value) return false;
        return parseFloat(value) > 0;
      })
      .test('balance-check', 'Not enough balance', value => {
        if (!value) return false;
        const points = parseFloat(value);
        return points <= balance;
      }),
  });
