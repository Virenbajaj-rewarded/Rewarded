import {
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { FormikProvider } from 'formik';
import { RootScreenProps } from '@/navigation/types';
import { Paths } from '@/navigation/paths';
import { Typography, PrimaryButton, TextField, Selector, AddressAutocomplete } from '@/components';
import { styles } from './EditBusiness.styles';
import { useEditBusiness } from './useEditBusiness';
import SafeScreen from '@/components/templates/SafeScreen';
import { industryOptions } from '@/screens/Auth/signup/merchant/selectorOptions';

export default function EditBusiness({}: RootScreenProps<Paths.EDIT_BUSINESS>) {
  const {
    merchant,
    isLoading,
    isError,
    formik,
    isPending,
    isUploadingLogo,
    selectedImage,
    handleChangePhoto,
    handleCancel,
    handleAddressSelect,
    handleClearLocation,
    getLocationError,
  } = useEditBusiness();

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#3c83f6" />
      </View>
    );
  }

  if (isError || !merchant) {
    return (
      <View style={styles.center}>
        <Typography fontVariant="regular" fontSize={16} color="#C13333">
          Something went wrong on business fetching
        </Typography>
      </View>
    );
  }

  return (
    <FormikProvider value={formik}>
      <SafeScreen edges={['bottom', 'left', 'right', 'top']}>
        <KeyboardAvoidingView
          style={styles.keyboardAvoidingView}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
          <ScrollView
            keyboardDismissMode="on-drag"
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.photoContainer}>
              {selectedImage || merchant.logoUrl ? (
                <Image
                  source={{ uri: selectedImage || merchant.logoUrl || undefined }}
                  style={styles.photoImage}
                />
              ) : (
                <View style={styles.photoPlaceholder}>
                  <Typography fontVariant="bold" fontSize={24} color="#FFFFFF">
                    Logo
                  </Typography>
                </View>
              )}
              <TouchableOpacity
                onPress={handleChangePhoto}
                disabled={isUploadingLogo}
                style={styles.changePhotoButton}
              >
                {isUploadingLogo ? (
                  <ActivityIndicator size="small" color="#3C83F6" />
                ) : (
                  <Typography
                    fontVariant="regular"
                    fontSize={14}
                    color="#3C83F6"
                    style={styles.changePhotoText}
                  >
                    Change Photo
                  </Typography>
                )}
              </TouchableOpacity>
            </View>

            <TextField
              required
              label="Name"
              value={formik.values.businessName}
              onChangeText={formik.handleChange('businessName')}
              onBlur={formik.handleBlur('businessName')}
              placeholder="Business Name"
              error={
                formik.touched.businessName && formik.errors.businessName
                  ? formik.errors.businessName
                  : undefined
              }
            />

            <Selector
              required
              label="Industry"
              value={formik.values.storeType}
              onValueChange={value => formik.setFieldValue('storeType', value)}
              options={industryOptions}
              placeholder="Select Industry"
              error={
                formik.touched.storeType && formik.errors.storeType
                  ? formik.errors.storeType
                  : undefined
              }
            />

            <TextField
              label="Description"
              value={formik.values.description}
              onChangeText={formik.handleChange('description')}
              onBlur={formik.handleBlur('description')}
              placeholder="Business Description"
              multiline
              numberOfLines={4}
              style={styles.textArea}
              error={
                formik.touched.description && formik.errors.description
                  ? formik.errors.description
                  : undefined
              }
            />

            <TextField
              required
              label="Email"
              value={formik.values.businessEmail}
              onChangeText={formik.handleChange('businessEmail')}
              onBlur={formik.handleBlur('businessEmail')}
              placeholder="Business Email"
              keyboardType="email-address"
              autoCapitalize="none"
              error={
                formik.touched.businessEmail && formik.errors.businessEmail
                  ? formik.errors.businessEmail
                  : undefined
              }
            />

            <AddressAutocomplete
              required
              label="Address"
              placeholder="Enter your address"
              value={formik.values.location?.address || ''}
              onAddressSelect={handleAddressSelect}
              onClear={handleClearLocation}
              error={getLocationError()}
            />

            <TextField
              required
              label="Phone Number"
              value={formik.values.businessPhoneNumber}
              onChangeText={formik.handleChange('businessPhoneNumber')}
              onBlur={formik.handleBlur('businessPhoneNumber')}
              placeholder="Phone Number"
              keyboardType="phone-pad"
              error={
                formik.touched.businessPhoneNumber && formik.errors.businessPhoneNumber
                  ? formik.errors.businessPhoneNumber
                  : undefined
              }
            />

            <TextField
              label="Telegram"
              value={formik.values.tgUsername || ''}
              onChangeText={formik.handleChange('tgUsername')}
              onBlur={formik.handleBlur('tgUsername')}
              placeholder="@username"
              autoCapitalize="none"
              error={
                formik.touched.tgUsername && formik.errors.tgUsername
                  ? formik.errors.tgUsername
                  : undefined
              }
            />

            <TextField
              label="WhatsApp"
              value={formik.values.whatsppUsername || ''}
              onChangeText={formik.handleChange('whatsppUsername')}
              onBlur={formik.handleBlur('whatsppUsername')}
              placeholder="Phone Number"
              keyboardType="phone-pad"
              error={
                formik.touched.whatsppUsername && formik.errors.whatsppUsername
                  ? formik.errors.whatsppUsername
                  : undefined
              }
            />

            <View style={styles.buttonsContainer}>
              <PrimaryButton
                label={isPending ? 'Saving...' : 'Save Changes'}
                onPress={formik.handleSubmit}
                disabled={!formik.isValid || !formik.dirty}
              />
              <PrimaryButton
                label="Cancel"
                onPress={handleCancel}
                style={styles.cancelButton}
                textStyle={styles.cancelButtonText}
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeScreen>
    </FormikProvider>
  );
}
