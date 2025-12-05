import * as Yup from 'yup';

export const topUpStoreValidationSchema = (balance: number | undefined) =>
  Yup.object().shape({
    points: Yup.number()
      .required('Points are required')
      .test('balance-check', 'Not enough balance', function (value) {
        if (!value || !balance) return true;
        return value <= balance;
      }),
  });
