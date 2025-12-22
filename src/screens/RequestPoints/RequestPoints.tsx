import { KeyboardAvoidingView, Platform, View, ScrollView } from 'react-native';
import { Typography, TextField, PrimaryButton } from '@/components';
import { useRequestPoints } from './useRequestPoints';
import SafeScreen from '@/components/templates/SafeScreen';
import { FormikProvider } from 'formik';
import { styles } from './RequestPoints.styles';
import { RootScreenProps } from '@/navigation/types';
import { Paths } from '@/navigation/paths';
import IconByVariant from '@/components/atoms/IconByVariant';
import { ELedgerStatus } from '@/enums';

export default function RequestPoints({
  route,
  navigation,
}: RootScreenProps<Paths.REQUEST_POINTS>) {
  const {
    formik,
    requestPointsLoading,
    requestPointsSuccess,
    isLoadingUser,
    user,
    handleCancelRequest,
    requestPointsData,
    handleGoToPrograms,
  } = useRequestPoints(route.params.userId, navigation);
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

  if (requestPointsSuccess && !requestPointsData) {
    return (
      <SafeScreen>
        <View style={styles.stateContainer}>
          <IconByVariant path="circle-pending" width={80} height={80} />

          <View style={styles.textContainer}>
            <Typography fontVariant="medium" fontSize={24} color="#FFFFFF" textAlign="center">
              Payment Requested
            </Typography>

            <Typography fontVariant="regular" fontSize={14} color="#BFBFBF" textAlign="center">
              You&apos;ve requested {formik.values.points} CAD points from {user?.fullName}. Please
              wait for approval.
            </Typography>
          </View>

          <PrimaryButton
            label="Go to Programs"
            onPress={handleGoToPrograms}
            style={styles.cancelButton}
            textStyle={styles.cancelButtonText}
          />
        </View>
      </SafeScreen>
    );
  }

  if (requestPointsData && requestPointsData.status === ELedgerStatus.DECLINED) {
    return (
      <SafeScreen>
        <View style={styles.stateContainer}>
          <IconByVariant path="circle-failed" width={80} height={80} />
          <View style={styles.textContainer}>
            <Typography fontVariant="medium" fontSize={24} color="#FFFFFF" textAlign="center">
              Request Denied
            </Typography>

            <Typography fontVariant="regular" fontSize={14} color="#BFBFBF" textAlign="center">
              Your request {requestPointsData?.amount} CAD points from {user?.fullName} has been
              declined.
            </Typography>
          </View>
          <PrimaryButton
            label="Try Again"
            onPress={handleCancelRequest}
            style={styles.tryAgainButton}
          />
          <PrimaryButton
            label="Go to Programs"
            onPress={handleGoToPrograms}
            style={styles.cancelButton}
            textStyle={styles.cancelButtonText}
          />
        </View>
      </SafeScreen>
    );
  }

  if (requestPointsData && requestPointsData.status === ELedgerStatus.APPROVED) {
    return (
      <SafeScreen>
        <View style={styles.stateContainer}>
          <IconByVariant path="circle-success" width={80} height={80} />
          <View style={styles.textContainer}>
            <Typography fontVariant="regular" fontSize={24} color="#FFFFFF" textAlign="center">
              Request Approved
            </Typography>

            <Typography fontVariant="medium" fontSize={14} color="#BFBFBF" textAlign="center">
              Your request {requestPointsData.amount} CAD points from{' '}
              {requestPointsData?.customer?.fullName} has been approved.
            </Typography>
          </View>
          <PrimaryButton
            label="Go to Programs"
            onPress={handleGoToPrograms}
            style={styles.cancelButton}
            textStyle={styles.cancelButtonText}
          />
        </View>
      </SafeScreen>
    );
  }

  return (
    <FormikProvider value={formik}>
      <SafeScreen>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView
            keyboardDismissMode="on-drag"
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.contentContainer}>
              <View style={styles.formContainer}>
                <TextField
                  variant="points"
                  value={values.points}
                  onChangeText={handleChange('points')}
                  onBlur={handleBlur('points')}
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
                  numberOfLines={3}
                  style={styles.commentInput}
                  error={touched.comment && errors.comment ? errors.comment : undefined}
                />
              </View>
            </View>
          </ScrollView>

          <View style={styles.buttonContainer}>
            <PrimaryButton
              label={requestPointsLoading ? 'Requesting...' : 'Request CAD Points'}
              onPress={formik.handleSubmit}
              disabled={!formik.isValid || !formik.dirty || requestPointsLoading}
              style={styles.submitButton}
            />
          </View>
        </KeyboardAvoidingView>
      </SafeScreen>
    </FormikProvider>
  );
}
