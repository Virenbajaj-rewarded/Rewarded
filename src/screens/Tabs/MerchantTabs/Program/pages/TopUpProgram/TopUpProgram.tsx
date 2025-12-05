import { View, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { Typography, TextField, PrimaryButton } from '@/components';
import IconByVariant from '@/components/atoms/IconByVariant';
import SafeScreen from '@/components/templates/SafeScreen';
import { formatCurrency } from '@/utils';

import { styles } from './TopUpProgram.styles';
import { RootScreenProps } from '@/navigation/types';
import { Paths } from '@/navigation/paths';
import { useTopUpProgram } from './useTopUpProgram';
import { FormikProvider } from 'formik';

export default function TopUpProgram({ route, navigation }: RootScreenProps<Paths.TOP_UP_PROGRAM>) {
  const program = route.params.program;

  const { formik, topUpProgramLoading, topUpProgramSuccess, handleGoBack } = useTopUpProgram({
    navigation,
    route,
  });
  const { values, errors, touched, handleChange, handleBlur } = formik;
  const remainingBudget = program.fundedAmount - program.spentAmount;

  if (topUpProgramSuccess) {
    return (
      <SafeScreen>
        <View style={styles.stateContainer}>
          <IconByVariant path="circle-success" width={80} height={80} />

          <View style={styles.textContainer}>
            <Typography fontVariant="medium" fontSize={24} color="#FFFFFF" textAlign="center">
              Top Up Successful
            </Typography>

            <Typography fontVariant="regular" fontSize={14} color="#BFBFBF" textAlign="center">
              CAD {formik.values.amount} added to {program.name}&apos;s program.
            </Typography>
          </View>

          <PrimaryButton
            label="Back to Programs"
            onPress={handleGoBack}
            style={styles.backButton}
            textStyle={styles.backButtonText}
          />
        </View>
      </SafeScreen>
    );
  }
  return (
    <FormikProvider value={formik}>
      <SafeScreen>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.container}>
            <View style={styles.contentContainer}>
              <Typography fontVariant="medium" fontSize={20} color="#FFFFFF">
                Enter top up amount
              </Typography>
              <View style={styles.programBalanceContainer}>
                <IconByVariant path="wallet" width={12} height={12} color="#639CF8" />
                <Typography fontVariant="regular" fontSize={14} color="#639CF8">
                  {formatCurrency(remainingBudget)} Program Balance
                </Typography>
              </View>

              <TextField
                value={values.amount}
                onChangeText={handleChange('amount')}
                onBlur={handleBlur('amount')}
                keyboardType="number-pad"
                error={touched.amount && errors.amount ? errors.amount : undefined}
                style={styles.pointsInput}
              />
            </View>
            <View style={styles.buttonContainer}>
              <PrimaryButton
                label={topUpProgramLoading ? 'Topping up...' : 'Top Up'}
                onPress={() => formik.handleSubmit()}
                disabled={!formik.isValid || !formik.dirty || topUpProgramLoading}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </SafeScreen>
    </FormikProvider>
  );
}
