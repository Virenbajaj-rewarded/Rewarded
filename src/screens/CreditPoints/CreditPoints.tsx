import { View, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { FormikProvider } from 'formik';

import SafeScreen from '@/components/templates/SafeScreen';
import { RootScreenProps } from '@/navigation/types.ts';
import { Paths } from '@/navigation/paths.ts';
import { TextField, PrimaryButton, Modal } from '@/components';
import { Typography } from '@/components';

import { styles } from './CreditPoints.styles';

import { useCreditPoints } from './useCreditPoints';
import IconByVariant from '@/components/atoms/IconByVariant';

export default function CreditPoints({ navigation, route }: RootScreenProps<Paths.CREDIT_POINTS>) {
  const userId = route.params.userId;

  const {
    formik,
    user,
    isLoadingUser,
    showConfirmModal,
    closeConfirmModal,
    handleConfirmCredit,
    creditPointLoading,
    creditPointSuccess,
    creditPointError,
    handleGoToPrograms,
    handleTryAgain,
  } = useCreditPoints(userId, navigation);

  const { values, errors, touched, handleChange, handleBlur } = formik;

  if (isLoadingUser) {
    return (
      <SafeScreen>
        <View style={styles.stateContainer}>
          <Typography fontVariant="regular" fontSize={16} color="#FFFFFF">
            Loading...
          </Typography>
        </View>
      </SafeScreen>
    );
  }

  if (creditPointSuccess) {
    return (
      <SafeScreen>
        <View style={styles.stateContainer}>
          <IconByVariant path="circle-success" width={80} height={80} />

          <View style={styles.textContainer}>
            <Typography fontVariant="medium" fontSize={24} color="#FFFFFF" textAlign="center">
              Successful Credit
            </Typography>

            <Typography fontVariant="regular" fontSize={14} color="#BFBFBF" textAlign="center">
              {formik.values.points} points added to {user?.fullName}&apos;s balance.
            </Typography>
          </View>

          <PrimaryButton
            label="Go to Programs"
            onPress={handleGoToPrograms}
            style={styles.successButton}
            textStyle={styles.successButtonText}
          />
        </View>
      </SafeScreen>
    );
  }

  if (creditPointError) {
    return (
      <SafeScreen>
        <View style={styles.stateContainer}>
          <IconByVariant path="circle-failed" width={80} height={80} />
          <View style={styles.textContainer}>
            <Typography fontVariant="medium" fontSize={24} color="#FFFFFF" textAlign="center">
              Credit Failed
            </Typography>

            <Typography fontVariant="regular" fontSize={16} color="#BFBFBF" textAlign="center">
              Credit failed — please check your connection and try again.
            </Typography>
          </View>
          <View style={styles.errorButtonsContainer}>
            <PrimaryButton
              label="Try Again"
              onPress={handleTryAgain}
              style={styles.tryAgainButton}
            />
            <PrimaryButton
              label="Go to Programs"
              onPress={handleGoToPrograms}
              style={styles.goToProgramsButton}
              textStyle={styles.goToProgramsButtonText}
            />
          </View>
        </View>
      </SafeScreen>
    );
  }

  const confirmationMessage = `You're about to add ${values.points || 0} CAD points to ${user?.fullName || 'the user'}'s balance. Confirm credit?`;

  return (
    <FormikProvider value={formik}>
      <SafeScreen>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.formContainer}>
              <TextField
                label="Sum Paid by User"
                value={values.amountCents}
                onChangeText={handleChange('amountCents')}
                onBlur={handleBlur('amountCents')}
                placeholder="Enter amount"
                keyboardType="number-pad"
                mask="CAD"
                error={touched.amountCents && errors.amountCents ? errors.amountCents : undefined}
              />

              <TextField
                label="Points to issue"
                value={values.points}
                onChangeText={handleChange('points')}
                onBlur={handleBlur('points')}
                placeholder="Enter points"
                keyboardType="number-pad"
                error={touched.points && errors.points ? errors.points : undefined}
              />

              <TextField
                label="Comment (optional)"
                value={values.comment}
                onChangeText={handleChange('comment')}
                onBlur={handleBlur('comment')}
                placeholder="Leave a comment"
                multiline
                numberOfLines={4}
                style={styles.commentInput}
                error={touched.comment && errors.comment ? errors.comment : undefined}
              />
            </View>
          </ScrollView>

          <View style={styles.buttonContainer}>
            <PrimaryButton
              label="Credit"
              onPress={() => formik.handleSubmit()}
              disabled={!formik.isValid || !formik.dirty || creditPointLoading}
              style={styles.creditButton}
            />
          </View>
        </KeyboardAvoidingView>

        <Modal
          visible={showConfirmModal}
          title="Confirm Credit"
          description={confirmationMessage}
          submitButtonLabel="Confirm Credit"
          cancelButtonLabel="Cancel"
          onSubmit={handleConfirmCredit}
          onCancel={closeConfirmModal}
          onClose={closeConfirmModal}
        />
      </SafeScreen>
    </FormikProvider>
  );
}
