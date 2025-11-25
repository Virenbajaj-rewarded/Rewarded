import { useFormik } from 'formik';
import { useNavigation } from '@react-navigation/native';
import { useMerchant } from '@/services/merchant/useMerchant';
import { showToast } from '@/utils/showToast';
import { IUpdateMerchantPayload } from '@/services/merchant/merchant.types';
import { businessValidationSchema } from './EditBusiness.validation';
import { launchImageLibrary, ImagePickerResponse, MediaType } from 'react-native-image-picker';
import { useState } from 'react';
import { Keyboard } from 'react-native';

export const useEditBusiness = () => {
  const navigation = useNavigation();
  const { useFetchMerchantProfileQuery, useUpdateMerchantMutation, useUploadMerchantLogoMutation } =
    useMerchant();
  const { data: merchant, isLoading, isError } = useFetchMerchantProfileQuery();
  const { mutateAsync: updateMerchant, isPending } = useUpdateMerchantMutation();
  const { mutateAsync: uploadMerchantLogo, isPending: isUploadingLogo } =
    useUploadMerchantLogoMutation();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleUploadLogo = async (logoUri: string, fileName: string, type: string) => {
    try {
      await uploadMerchantLogo({ logoUri, fileName, type });
      showToast({
        type: 'success',
        text1: 'Logo uploaded successfully',
      });
    } catch (error) {
      console.error('Failed to upload logo:', error);
      showToast({
        type: 'error',
        text1: 'Failed to upload logo',
      });
      throw error;
    }
  };

  const handleChangePhoto = () => {
    if (!launchImageLibrary) {
      showToast({
        type: 'error',
        text1: 'Image picker is not available. Please rebuild the app.',
      });
      return;
    }

    launchImageLibrary(
      {
        mediaType: 'photo' as MediaType,
        quality: 0.8,
        selectionLimit: 1,
      },
      async (response: ImagePickerResponse) => {
        if (response.didCancel) {
          return;
        }

        if (response.errorCode) {
          const errorMessage =
            response.errorCode === 'permission'
              ? 'Please grant photo library access in settings'
              : response.errorMessage || 'Failed to select image';
          showToast({
            type: 'error',
            text1: errorMessage,
          });
          return;
        }

        const asset = response.assets?.[0];
        if (!asset?.uri) {
          return;
        }

        const fileExtension = asset.uri.split('.').pop()?.toLowerCase() || '';
        const allowedExtensions = ['png', 'jpg', 'jpeg'];
        if (!allowedExtensions.includes(fileExtension)) {
          showToast({
            type: 'error',
            text1: 'Please select a PNG, JPG, or JPEG image',
          });
          return;
        }

        const maxSize = 5 * 1024 * 1024;
        if (asset.fileSize && asset.fileSize > maxSize) {
          showToast({
            type: 'error',
            text1: 'Please select an image smaller than 5MB',
          });
          return;
        }

        setSelectedImage(asset.uri);

        const fileName = asset.fileName || `logo.${fileExtension}`;

        let mimeType = asset.type;
        if (!mimeType || mimeType === 'image/jpg') {
          mimeType = fileExtension === 'png' ? 'image/png' : 'image/jpeg';
        }
        if (mimeType === 'image/jpg') {
          mimeType = 'image/jpeg';
        }

        try {
          await handleUploadLogo(asset.uri, fileName, mimeType);
        } catch {
          setSelectedImage(null);
        }
      }
    );
  };

  const handleUpdateBusiness = async (values: IUpdateMerchantPayload) => {
    try {
      await updateMerchant(values);
      showToast({
        type: 'success',
        text1: 'Business updated successfully',
      });
      navigation.goBack();
    } catch (error) {
      console.error('Failed to update business:', error);
      showToast({
        type: 'error',
        text1: 'Failed to update business',
      });
    }
  };

  const formik = useFormik<IUpdateMerchantPayload>({
    initialValues: {
      businessName: merchant?.businessName || '',
      storeType: merchant?.storeType || null,
      description: merchant?.description || '',
      businessEmail: merchant?.businessEmail || '',
      businessPhoneNumber: merchant?.businessPhoneNumber || '',
      location: {
        address: merchant?.location?.address || '',
        latitude: merchant?.location?.latitude || 0,
        longitude: merchant?.location?.longitude || 0,
      },
      tgUsername: merchant?.tgUsername || '',
      whatsppUsername: merchant?.whatsppUsername || '',
    },
    enableReinitialize: true,
    validationSchema: businessValidationSchema,
    onSubmit: handleUpdateBusiness,
  });

  const handleCancel = () => {
    formik.resetForm();
    navigation.goBack();
    Keyboard.dismiss();
  };

  const handleClearLocation = async () => {
    const newValues = {
      ...formik.values,
      location: {
        address: '',
        latitude: 0,
        longitude: 0,
      },
    };
    formik.setValues(newValues, false);
    formik.setFieldTouched('location', true);
    await formik.validateForm(newValues);
  };
  const handleAddressSelect = async (address: any) => {
    const newValues = {
      ...formik.values,
      location: {
        address: address.address,
        latitude: address.lat,
        longitude: address.lng,
      },
    };
    formik.setValues(newValues, false);
    formik.setFieldTouched('location', true);
    await formik.validateForm(newValues);
  };

  const getLocationError = (): string | undefined => {
    const locationTouched = formik.touched.location;
    const isTouched = Boolean(locationTouched);
    if (!isTouched) return undefined;

    const locationError = formik.errors.location;
    if (!locationError) return undefined;

    if (typeof locationError === 'string') {
      return locationError;
    }

    if (locationError && typeof locationError === 'object') {
      const errorObj = locationError as { address?: string };
      return errorObj.address;
    }

    return undefined;
  };

  return {
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
  };
};
